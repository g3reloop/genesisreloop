-- WebAuthn Support for ReLoop Platform

-- Create Authenticator table
CREATE TABLE IF NOT EXISTS "Authenticator" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "credentialID" TEXT NOT NULL UNIQUE,
    "credentialPublicKey" BYTEA NOT NULL,
    counter BIGINT NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    transports TEXT[] NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index on userId
CREATE INDEX idx_authenticator_user_id ON "Authenticator"("userId");

-- Create WebAuthn Challenge table
CREATE TABLE IF NOT EXISTS "WebAuthnChallenge" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    challenge TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('registration', 'authentication')),
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("userId", type)
);

-- Create index on expiresAt for cleanup
CREATE INDEX idx_webauthn_challenge_expires ON "WebAuthnChallenge"("expiresAt");

-- Update trigger for Authenticator
CREATE TRIGGER update_authenticator_updated_at BEFORE UPDATE ON "Authenticator"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE "Authenticator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebAuthnChallenge" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Authenticator
CREATE POLICY "Users can view own authenticators" ON "Authenticator"
    FOR SELECT USING ("userId" = auth_user_id());

CREATE POLICY "Users can create own authenticators" ON "Authenticator"
    FOR INSERT WITH CHECK ("userId" = auth_user_id());

CREATE POLICY "Users can delete own authenticators" ON "Authenticator"
    FOR DELETE USING ("userId" = auth_user_id());

-- RLS Policies for WebAuthnChallenge
CREATE POLICY "Users can view own challenges" ON "WebAuthnChallenge"
    FOR SELECT USING ("userId" = auth_user_id() OR "userId" = 'anonymous');

CREATE POLICY "Service role bypass for challenges" ON "WebAuthnChallenge"
    USING (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Cleanup function for expired challenges
CREATE OR REPLACE FUNCTION cleanup_expired_webauthn_challenges()
RETURNS void AS $$
BEGIN
    DELETE FROM "WebAuthnChallenge"
    WHERE "expiresAt" < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-webauthn-challenges', '*/5 * * * *', 'SELECT cleanup_expired_webauthn_challenges();');
