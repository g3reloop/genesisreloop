-- Genesis Reloop Agent System Database Schema
-- Includes PostGIS for geospatial and TimescaleDB for time-series data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE feedstock_type AS ENUM ('FW', 'UCO');
CREATE TYPE product_type AS ENUM ('FW', 'UCO', 'BIOGAS', 'BIODIESEL', 'GLYCEROL', 'DIGESTATE');
CREATE TYPE loop_state AS ENUM ('SRL', 'CRL');
CREATE TYPE agent_status AS ENUM ('healthy', 'degraded', 'offline');
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE entity_type AS ENUM ('supplier', 'collector', 'processor', 'buyer', 'verifier', 'admin');

-- Agent registry and monitoring
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    status agent_status DEFAULT 'offline',
    queue_name VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}',
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_heartbeat ON agents(last_heartbeat);

-- Agent jobs queue
CREATE TABLE agent_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent VARCHAR(100) NOT NULL,
    queue_name VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status job_status DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error TEXT,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_jobs_queue_status ON agent_jobs(queue_name, status, scheduled_at);
CREATE INDEX idx_agent_jobs_agent ON agent_jobs(agent);

-- Convert to TimescaleDB hypertable for better time-series performance
SELECT create_hypertable('agent_jobs', 'created_at', if_not_exists => TRUE);

-- Agent metrics (time-series)
CREATE TABLE agent_metrics (
    time TIMESTAMPTZ NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    queue_depth INTEGER,
    avg_latency INTEGER, -- milliseconds
    jobs_processed INTEGER DEFAULT 0,
    jobs_failed INTEGER DEFAULT 0,
    error_rate DECIMAL(5,4)
);

SELECT create_hypertable('agent_metrics', 'time', if_not_exists => TRUE);
CREATE INDEX idx_agent_metrics_agent ON agent_metrics(agent_name, time DESC);

-- Feedstock lots
CREATE TABLE lots (
    id VARCHAR(50) PRIMARY KEY,
    type feedstock_type NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL CHECK (unit IN ('kg', 'L', 'tonnes')),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    location_address TEXT,
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,
    quality_metrics JSONB DEFAULT '{}',
    srl_hint BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lots_location ON lots USING GIST(location);
CREATE INDEX idx_lots_status ON lots(status);
CREATE INDEX idx_lots_type ON lots(type);
CREATE INDEX idx_lots_window ON lots(window_start, window_end);

-- Processors
CREATE TABLE processors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    location_address TEXT,
    capacity DECIMAL(10,2) NOT NULL, -- kg/day or L/day
    current_utilization DECIMAL(3,2) DEFAULT 0,
    price_per_unit JSONB DEFAULT '{}', -- Different prices for different types
    reputation_score INTEGER DEFAULT 50,
    is_srl_participant BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_processors_location ON processors USING GIST(location);
CREATE INDEX idx_processors_type ON processors(type);

-- Processor capacities (time-series)
CREATE TABLE processor_capacities (
    time TIMESTAMPTZ NOT NULL,
    processor_id VARCHAR(50) NOT NULL,
    available_capacity DECIMAL(10,2),
    utilization_rate DECIMAL(3,2)
);

SELECT create_hypertable('processor_capacities', 'time', if_not_exists => TRUE);

-- Match results
CREATE TABLE agent_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id VARCHAR(50) NOT NULL REFERENCES lots(id),
    processor_id VARCHAR(50) NOT NULL REFERENCES processors(id),
    score DECIMAL(5,2) NOT NULL,
    distance_km DECIMAL(10,2),
    price_estimate DECIMAL(10,2),
    route_eta TIMESTAMPTZ,
    srl_score DECIMAL(3,2),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_lot ON agent_matches(lot_id);
CREATE INDEX idx_matches_status ON agent_matches(status);

-- Trace batches
CREATE TABLE batches (
    id VARCHAR(50) PRIMARY KEY,
    type product_type NOT NULL,
    weight DECIMAL(10,2),
    volume DECIMAL(10,2),
    operator_id VARCHAR(50) NOT NULL,
    srl_state loop_state,
    hash VARCHAR(64),
    merkle_root VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_batches_type ON batches(type);
CREATE INDEX idx_batches_operator ON batches(operator_id);

-- Batch timestamps
CREATE TABLE batch_timestamps (
    batch_id VARCHAR(50) REFERENCES batches(id),
    event_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (batch_id, event_type)
);

-- Trace events (time-series)
CREATE TABLE trace_events (
    id UUID DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(50) NOT NULL REFERENCES batches(id),
    event_type VARCHAR(50) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    timestamp TIMESTAMPTZ NOT NULL,
    data JSONB DEFAULT '{}',
    PRIMARY KEY (id, timestamp)
);

SELECT create_hypertable('trace_events', 'timestamp', if_not_exists => TRUE);
CREATE INDEX idx_trace_events_batch ON trace_events(batch_id, timestamp DESC);

-- Batch media (photos, documents)
CREATE TABLE batch_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(50) NOT NULL REFERENCES batches(id),
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'document')),
    url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_batch_media_batch ON batch_media(batch_id);

-- Collection routes
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id VARCHAR(50) NOT NULL,
    driver_id VARCHAR(50) NOT NULL,
    stop_sequence TEXT[] NOT NULL,
    eta_sequence TIMESTAMPTZ[] NOT NULL,
    distance_km DECIMAL(10,2),
    emissions_estimate DECIMAL(10,2),
    polyline TEXT,
    status VARCHAR(20) DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection jobs
CREATE TABLE pickups (
    id VARCHAR(50) PRIMARY KEY,
    lot_id VARCHAR(50) REFERENCES lots(id),
    route_id UUID REFERENCES routes(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    time_window_start TIMESTAMPTZ NOT NULL,
    time_window_end TIMESTAMPTZ NOT NULL,
    service_time INTEGER NOT NULL, -- minutes
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fleet vehicles
CREATE TABLE fleet (
    id VARCHAR(50) PRIMARY KEY,
    capacity DECIMAL(10,2) NOT NULL,
    current_location GEOGRAPHY(POINT, 4326),
    start_depot GEOGRAPHY(POINT, 4326) NOT NULL,
    depot_address TEXT,
    driver_id VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyers
CREATE TABLE buyers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    buyer_type VARCHAR(50) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    requirements JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyer leads
CREATE TABLE buyer_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type product_type NOT NULL,
    buyer_id VARCHAR(50) REFERENCES buyers(id),
    fit_score DECIMAL(3,2),
    target_price DECIMAL(10,2),
    contract_template_id VARCHAR(50),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history (time-series)
CREATE TABLE price_history (
    time TIMESTAMPTZ NOT NULL,
    product_type product_type NOT NULL,
    buyer_id VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL
);

SELECT create_hypertable('price_history', 'time', if_not_exists => TRUE);

-- Carbon ledger
CREATE TABLE carbon_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(50) REFERENCES batches(id),
    tco2e_avoided DECIMAL(10,6) NOT NULL,
    calculation_method VARCHAR(100) NOT NULL,
    baseline_factor DECIMAL(10,6),
    evidence_pack_id VARCHAR(100) NOT NULL,
    tokenized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carbon_batch ON carbon_ledger(batch_id);
CREATE INDEX idx_carbon_tokenized ON carbon_ledger(tokenized);

-- Evidence packs
CREATE TABLE evidence_packs (
    id VARCHAR(100) PRIMARY KEY,
    content JSONB NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    storage_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance document packs
CREATE TABLE doc_packs (
    id VARCHAR(100) PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(id),
    documents JSONB NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doc_packs_batch ON doc_packs(batch_id);

-- Reputation scores
CREATE TABLE reputation_scores (
    entity_id VARCHAR(50) NOT NULL,
    entity_type entity_type NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    on_time_delivery INTEGER,
    quality_consistency INTEGER,
    srl_ratio INTEGER,
    dispute_rate INTEGER,
    explanations TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (entity_id, updated_at)
);

CREATE INDEX idx_reputation_entity ON reputation_scores(entity_id, updated_at DESC);

-- Reputation events (time-series)
CREATE TABLE reputation_events (
    id UUID DEFAULT uuid_generate_v4(),
    entity_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    score DECIMAL(3,2) NOT NULL, -- -1 to 1
    weight DECIMAL(3,2) DEFAULT 1,
    details JSONB DEFAULT '{}',
    PRIMARY KEY (id, timestamp)
);

SELECT create_hypertable('reputation_events', 'timestamp', if_not_exists => TRUE);

-- Feature flags
CREATE TABLE feature_flags (
    key VARCHAR(50) PRIMARY KEY,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default feature flags
INSERT INTO feature_flags (key, enabled, description) VALUES
('tokenization', FALSE, 'Enable GIRM token features'),
('ml_ranking', FALSE, 'Use ML model for matching');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_jobs_updated_at BEFORE UPDATE ON agent_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lots_updated_at BEFORE UPDATE ON lots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
