-- Triggers for ReLoop Platform

-- 1. Auto-update timestamps
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_updated_at BEFORE UPDATE ON "Supplier"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processor_updated_at BEFORE UPDATE ON "Processor"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_updated_at BEFORE UPDATE ON "Buyer"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collector_updated_at BEFORE UPDATE ON "Collector"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedstock_batch_updated_at BEFORE UPDATE ON "FeedstockBatch"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_updated_at BEFORE UPDATE ON "Collection"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_route_updated_at BEFORE UPDATE ON "CollectionRoute"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secondary_product_updated_at BEFORE UPDATE ON "SecondaryProduct"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secondary_product_order_updated_at BEFORE UPDATE ON "SecondaryProductOrder"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_credit_updated_at BEFORE UPDATE ON "CarbonCredit"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_document_updated_at BEFORE UPDATE ON "ComplianceDocument"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Audit logging for critical tables
CREATE TRIGGER audit_feedstock_batch AFTER INSERT OR UPDATE OR DELETE ON "FeedstockBatch"
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_processed_batch AFTER INSERT OR UPDATE OR DELETE ON "ProcessedBatch"
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_carbon_credit AFTER INSERT OR UPDATE OR DELETE ON "CarbonCredit"
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_carbon_transaction AFTER INSERT OR UPDATE OR DELETE ON "CarbonTransaction"
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_compliance_document AFTER INSERT OR UPDATE OR DELETE ON "ComplianceDocument"
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- 3. Business logic triggers

-- Auto-generate batch code if not provided
CREATE OR REPLACE FUNCTION auto_generate_batch_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."batchCode" IS NULL OR NEW."batchCode" = '' THEN
        NEW."batchCode" := generate_batch_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_batch_code BEFORE INSERT ON "FeedstockBatch"
    FOR EACH ROW EXECUTE FUNCTION auto_generate_batch_code();

-- Update supplier trust score after reputation change
CREATE OR REPLACE FUNCTION update_supplier_trust_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Supplier"
    SET "trustScore" = calculate_trust_score(NEW."supplierId")
    WHERE id = NEW."supplierId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trust_score AFTER INSERT OR UPDATE ON "ReputationScore"
    FOR EACH ROW EXECUTE FUNCTION update_supplier_trust_score();

-- Calculate SRL compliance percentage
CREATE OR REPLACE FUNCTION update_srl_compliance()
RETURNS TRIGGER AS $$
DECLARE
    total_batches INTEGER;
    srl_batches INTEGER;
    compliance_percent FLOAT;
BEGIN
    -- Count total and SRL batches for supplier
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE "loopType" = 'SRL')
    INTO total_batches, srl_batches
    FROM "FeedstockBatch"
    WHERE "supplierId" = NEW."supplierId"
    AND "createdAt" > CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    -- Calculate compliance percentage
    IF total_batches > 0 THEN
        compliance_percent := (srl_batches::FLOAT / total_batches) * 100;
    ELSE
        compliance_percent := 0;
    END IF;
    
    -- Update supplier
    UPDATE "Supplier"
    SET "srlCompliance" = compliance_percent
    WHERE id = NEW."supplierId";
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_srl_compliance_trigger AFTER INSERT OR UPDATE ON "FeedstockBatch"
    FOR EACH ROW EXECUTE FUNCTION update_srl_compliance();

-- Create notification on batch status change
CREATE OR REPLACE FUNCTION notify_batch_status_change()
RETURNS TRIGGER AS $$
DECLARE
    supplier_user_id TEXT;
    collector_user_id TEXT;
    notification_type "NotificationType";
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Only notify on status changes
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get supplier user ID
    SELECT u.id INTO supplier_user_id
    FROM "Supplier" s
    JOIN "User" u ON s."userId" = u.id
    WHERE s.id = NEW."supplierId";
    
    -- Determine notification details based on status
    CASE NEW.status
        WHEN 'ASSIGNED' THEN
            notification_type := 'BATCH_ASSIGNED';
            notification_title := 'Batch Assigned';
            notification_message := 'Your batch ' || NEW."batchCode" || ' has been assigned for collection.';
        WHEN 'COLLECTED' THEN
            notification_type := 'COLLECTION_SCHEDULED';
            notification_title := 'Batch Collected';
            notification_message := 'Your batch ' || NEW."batchCode" || ' has been collected.';
        WHEN 'DELIVERED' THEN
            notification_type := 'COLLECTION_SCHEDULED';
            notification_title := 'Batch Delivered';
            notification_message := 'Your batch ' || NEW."batchCode" || ' has been delivered to processor.';
        WHEN 'PROCESSED' THEN
            notification_type := 'COMPLIANCE_UPDATE';
            notification_title := 'Batch Processed';
            notification_message := 'Your batch ' || NEW."batchCode" || ' has been processed successfully.';
        WHEN 'REJECTED' THEN
            notification_type := 'QUALITY_ALERT';
            notification_title := 'Batch Rejected';
            notification_message := 'Your batch ' || NEW."batchCode" || ' has been rejected. Please check quality requirements.';
        ELSE
            RETURN NEW; -- No notification for other statuses
    END CASE;
    
    -- Create notification for supplier
    INSERT INTO "Notification" (
        "userId", 
        "type", 
        "title", 
        "message", 
        "data", 
        "read", 
        "createdAt"
    ) VALUES (
        supplier_user_id,
        notification_type,
        notification_title,
        notification_message,
        jsonb_build_object('batchId', NEW.id, 'batchCode', NEW."batchCode"),
        false,
        CURRENT_TIMESTAMP
    );
    
    -- Also notify collector if assigned
    IF NEW.status = 'ASSIGNED' THEN
        SELECT u.id INTO collector_user_id
        FROM "Collection" c
        JOIN "Collector" col ON c."collectorId" = col.id
        JOIN "User" u ON col."userId" = u.id
        WHERE c."batchId" = NEW.id;
        
        IF collector_user_id IS NOT NULL THEN
            INSERT INTO "Notification" (
                "userId", 
                "type", 
                "title", 
                "message", 
                "data", 
                "read", 
                "createdAt"
            ) VALUES (
                collector_user_id,
                'BATCH_ASSIGNED',
                'New Collection Assigned',
                'You have been assigned to collect batch ' || NEW."batchCode",
                jsonb_build_object('batchId', NEW.id, 'batchCode', NEW."batchCode"),
                false,
                CURRENT_TIMESTAMP
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_status_change AFTER UPDATE ON "FeedstockBatch"
    FOR EACH ROW EXECUTE FUNCTION notify_batch_status_change();

-- Auto-create carbon credits when batch is processed
CREATE OR REPLACE FUNCTION create_carbon_credits()
RETURNS TRIGGER AS $$
DECLARE
    co2_per_kg FLOAT := 2.5; -- Example: 2.5 kg CO2 avoided per kg of UCO
    verification_id TEXT;
BEGIN
    -- Generate verification ID
    verification_id := 'VER-' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FOR 6);
    
    -- Create carbon credit entry
    INSERT INTO "CarbonCredit" (
        "batchCode",
        "co2Avoided",
        "verificationId",
        "status",
        "createdAt",
        "updatedAt"
    )
    SELECT 
        fb."batchCode",
        (fb.quantity * co2_per_kg / 1000), -- Convert to tons
        verification_id,
        'VERIFIED',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM "FeedstockBatch" fb
    WHERE fb.id = NEW."batchId"
    AND NOT EXISTS (
        SELECT 1 FROM "CarbonCredit" cc
        WHERE cc."batchCode" = fb."batchCode"
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_carbon_credits_trigger AFTER INSERT ON "ProcessedBatch"
    FOR EACH ROW EXECUTE FUNCTION create_carbon_credits();
