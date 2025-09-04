-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types for better type safety
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPPLIER', 'PROCESSOR', 'BUYER', 'COLLECTOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create auth schema tables (if not using Supabase Auth)
-- Note: If using Supabase Auth, skip this and use auth.users instead

-- Enable Row Level Security on all tables
-- This will be applied after tables are created via Prisma

-- Create helper functions
CREATE OR REPLACE FUNCTION auth_user_id() 
RETURNS TEXT 
LANGUAGE SQL 
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

CREATE OR REPLACE FUNCTION auth_role() 
RETURNS TEXT 
LANGUAGE SQL 
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
$$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate unique batch codes
CREATE OR REPLACE FUNCTION generate_batch_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate code: YYMMDD-XXXX (where XXXX is random)
        code := TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FOR 4));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM "FeedstockBatch" WHERE "batchCode" = code) INTO exists_check;
        
        -- If not exists, return the code
        IF NOT exists_check THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate trust score
CREATE OR REPLACE FUNCTION calculate_trust_score(supplier_id TEXT)
RETURNS FLOAT AS $$
DECLARE
    avg_score FLOAT;
BEGIN
    SELECT 
        AVG(score)::FLOAT 
    INTO avg_score
    FROM "ReputationScore"
    WHERE "supplierId" = supplier_id
    AND "createdAt" > CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    RETURN COALESCE(avg_score, 5.0); -- Default to 5.0 if no scores
END;
$$ LANGUAGE plpgsql;

-- Function to verify SRL compliance
CREATE OR REPLACE FUNCTION verify_srl_compliance(batch_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    loop_type TEXT;
    quality_score FLOAT;
BEGIN
    SELECT "loopType", "qualityScore" 
    INTO loop_type, quality_score
    FROM "FeedstockBatch"
    WHERE id = batch_id;
    
    -- SRL requires quality score > 7 and proper classification
    RETURN loop_type = 'SRL' AND quality_score > 7.0;
END;
$$ LANGUAGE plpgsql;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth_user_id());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth_user_id());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth_user_id());
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
    COUNT(DISTINCT s.id) as total_suppliers,
    COUNT(DISTINCT p.id) as total_processors,
    COUNT(DISTINCT b.id) as total_buyers,
    COUNT(DISTINCT c.id) as total_collectors,
    COUNT(DISTINCT fb.id) as total_batches,
    SUM(fb.quantity) as total_feedstock_kg,
    COUNT(DISTINCT fb.id) FILTER (WHERE fb."loopType" = 'SRL') as srl_batches,
    COUNT(DISTINCT fb.id) FILTER (WHERE fb.status = 'PROCESSED') as processed_batches,
    SUM(cc."co2Avoided") as total_co2_avoided
FROM "User" u
LEFT JOIN "Supplier" s ON u.id = s."userId"
LEFT JOIN "Processor" p ON u.id = p."userId"
LEFT JOIN "Buyer" b ON u.id = b."userId"
LEFT JOIN "Collector" c ON u.id = c."userId"
LEFT JOIN "FeedstockBatch" fb ON s.id = fb."supplierId"
LEFT JOIN "ProcessedBatch" pb ON fb.id = pb."batchId"
LEFT JOIN "CarbonCredit" cc ON fb."batchCode" = cc."batchCode";

-- Create index for the materialized view
CREATE UNIQUE INDEX idx_dashboard_stats ON dashboard_stats (total_suppliers);

-- Function to refresh dashboard stats
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule periodic refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-dashboard-stats', '*/15 * * * *', 'SELECT refresh_dashboard_stats();');
