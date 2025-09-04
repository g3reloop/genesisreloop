-- Row Level Security Policies for ReLoop Platform
-- Run this after tables are created via Prisma

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Processor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Buyer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Collector" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeedstockBatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Collection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CollectionRoute" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProcessedBatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecondaryProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecondaryProductOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CarbonCredit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CarbonTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComplianceDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReputationScore" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TraceData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IoTReading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AgentActivity" ENABLE ROW LEVEL SECURITY;

-- User table policies
CREATE POLICY "Users can view their own profile" ON "User"
    FOR SELECT USING (id = auth_user_id() OR auth_role() = 'ADMIN');

CREATE POLICY "Users can update their own profile" ON "User"
    FOR UPDATE USING (id = auth_user_id());

CREATE POLICY "Only admins can create users" ON "User"
    FOR INSERT WITH CHECK (auth_role() = 'ADMIN');

CREATE POLICY "Only admins can delete users" ON "User"
    FOR DELETE USING (auth_role() = 'ADMIN');

-- Supplier policies
CREATE POLICY "Suppliers can view their own data" ON "Supplier"
    FOR SELECT USING (
        "userId" = auth_user_id() OR 
        auth_role() = 'ADMIN' OR
        auth_role() IN ('PROCESSOR', 'COLLECTOR') -- They need to see suppliers
    );

CREATE POLICY "Suppliers can update their own data" ON "Supplier"
    FOR UPDATE USING ("userId" = auth_user_id());

CREATE POLICY "Only suppliers can insert supplier data" ON "Supplier"
    FOR INSERT WITH CHECK ("userId" = auth_user_id() AND EXISTS (
        SELECT 1 FROM "User" WHERE id = auth_user_id() AND role = 'SUPPLIER'
    ));

-- Processor policies
CREATE POLICY "Anyone can view processors" ON "Processor"
    FOR SELECT USING (true); -- Public information

CREATE POLICY "Processors can update their own data" ON "Processor"
    FOR UPDATE USING ("userId" = auth_user_id());

CREATE POLICY "Only processors can insert processor data" ON "Processor"
    FOR INSERT WITH CHECK ("userId" = auth_user_id() AND EXISTS (
        SELECT 1 FROM "User" WHERE id = auth_user_id() AND role = 'PROCESSOR'
    ));

-- Buyer policies
CREATE POLICY "Buyers viewable by all authenticated users" ON "Buyer"
    FOR SELECT USING (auth_user_id() IS NOT NULL);

CREATE POLICY "Buyers can update their own data" ON "Buyer"
    FOR UPDATE USING ("userId" = auth_user_id());

-- Collector policies
CREATE POLICY "Collectors viewable by suppliers and admins" ON "Collector"
    FOR SELECT USING (
        "userId" = auth_user_id() OR 
        auth_role() IN ('ADMIN', 'SUPPLIER')
    );

CREATE POLICY "Collectors can update their own data" ON "Collector"
    FOR UPDATE USING ("userId" = auth_user_id());

-- FeedstockBatch policies
CREATE POLICY "Suppliers can view own batches, others see limited" ON "FeedstockBatch"
    FOR SELECT USING (
        "supplierId" IN (SELECT id FROM "Supplier" WHERE "userId" = auth_user_id()) OR
        auth_role() IN ('ADMIN', 'PROCESSOR', 'COLLECTOR')
    );

CREATE POLICY "Only suppliers can create batches" ON "FeedstockBatch"
    FOR INSERT WITH CHECK (
        "supplierId" IN (SELECT id FROM "Supplier" WHERE "userId" = auth_user_id())
    );

CREATE POLICY "Suppliers can update own batches" ON "FeedstockBatch"
    FOR UPDATE USING (
        "supplierId" IN (SELECT id FROM "Supplier" WHERE "userId" = auth_user_id()) AND
        status IN ('REGISTERED', 'ASSIGNED') -- Can't update after collection
    );

-- Collection policies
CREATE POLICY "Collections viewable by involved parties" ON "Collection"
    FOR SELECT USING (
        "supplierId" IN (SELECT id FROM "Supplier" WHERE "userId" = auth_user_id()) OR
        "collectorId" IN (SELECT id FROM "Collector" WHERE "userId" = auth_user_id()) OR
        auth_role() IN ('ADMIN', 'PROCESSOR')
    );

CREATE POLICY "Only collectors and admins can update collections" ON "Collection"
    FOR UPDATE USING (
        "collectorId" IN (SELECT id FROM "Collector" WHERE "userId" = auth_user_id()) OR
        auth_role() = 'ADMIN'
    );

-- CollectionRoute policies
CREATE POLICY "Routes viewable by collectors and admins" ON "CollectionRoute"
    FOR SELECT USING (
        "collectorId" IN (SELECT id FROM "Collector" WHERE "userId" = auth_user_id()) OR
        auth_role() = 'ADMIN'
    );

CREATE POLICY "Only system can create routes" ON "CollectionRoute"
    FOR INSERT WITH CHECK (false); -- Routes created by AI agents via service role

-- ProcessedBatch policies
CREATE POLICY "Processed batches viewable by involved parties" ON "ProcessedBatch"
    FOR SELECT USING (
        auth_role() IN ('ADMIN', 'BUYER') OR
        "processorId" IN (SELECT id FROM "Processor" WHERE "userId" = auth_user_id()) OR
        EXISTS (
            SELECT 1 FROM "FeedstockBatch" fb 
            JOIN "Supplier" s ON fb."supplierId" = s.id 
            WHERE fb.id = "ProcessedBatch"."batchId" AND s."userId" = auth_user_id()
        )
    );

-- SecondaryProduct policies
CREATE POLICY "Secondary products viewable by all authenticated" ON "SecondaryProduct"
    FOR SELECT USING (auth_user_id() IS NOT NULL);

CREATE POLICY "Only processors can create products" ON "SecondaryProduct"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "ProcessedBatch" pb
            JOIN "Processor" p ON pb."processorId" = p.id
            WHERE pb.id = "SecondaryProduct"."processedBatchId" 
            AND p."userId" = auth_user_id()
        )
    );

-- CarbonCredit policies
CREATE POLICY "Carbon credits are public" ON "CarbonCredit"
    FOR SELECT USING (true);

CREATE POLICY "Only system can create carbon credits" ON "CarbonCredit"
    FOR INSERT WITH CHECK (false); -- Created by AI agents

-- Notification policies
CREATE POLICY "Users can view own notifications" ON "Notification"
    FOR SELECT USING ("userId" = auth_user_id());

CREATE POLICY "Users can update own notifications" ON "Notification"
    FOR UPDATE USING ("userId" = auth_user_id());

-- AgentActivity policies  
CREATE POLICY "Agent activity viewable by admins only" ON "AgentActivity"
    FOR SELECT USING (auth_role() = 'ADMIN');

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON "Subscription"
    FOR SELECT USING ("userId" = auth_user_id() OR auth_role() = 'ADMIN');

CREATE POLICY "Only admins can manage subscriptions" ON "Subscription"
    FOR ALL USING (auth_role() = 'ADMIN');

-- Add service role bypass for all tables (for backend operations)
-- This allows your backend with service role key to bypass RLS
CREATE POLICY "Service role bypass" ON "User"
    USING (current_setting('request.jwt.claim.role', true) = 'service_role');
    
-- Repeat for all tables (example for a few)
CREATE POLICY "Service role bypass" ON "FeedstockBatch"
    USING (current_setting('request.jwt.claim.role', true) = 'service_role');
    
CREATE POLICY "Service role bypass" ON "ProcessedBatch"
    USING (current_setting('request.jwt.claim.role', true) = 'service_role');
