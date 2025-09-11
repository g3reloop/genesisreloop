import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorDevice,
} from '@simplewebauthn/types';
import { prisma } from '../db/utils';
import { config } from '../config/env';

// WebAuthn configuration
const rpName = 'ReLoop Platform';
const rpID = process.env.NODE_ENV === 'production' 
  ? new URL(config.appUrl).hostname 
  : 'localhost';
const origin = config.appUrl;

// Extended Prisma schema for WebAuthn (add to your schema)
// model Authenticator {
//   id                String   @id @default(cuid())
//   credentialID      String   @unique
//   credentialPublicKey Bytes
//   counter           BigInt
//   credentialDeviceType String
//   credentialBackedUp Boolean
//   transports        String[]
//   userId            String
//   user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//   createdAt         DateTime @default(now())
//   updatedAt         DateTime @updatedAt
// }

export const webauthn = {
  // Generate registration options
  async generateRegistrationOptions(userId: string, userName: string) {
    // Get user's existing authenticators
    const userAuthenticators = await prisma.$queryRaw<AuthenticatorDevice[]>`
      SELECT * FROM "Authenticator" WHERE "userId" = ${userId}
    `;

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: userId,
      userName,
      attestationType: 'none',
      excludeCredentials: userAuthenticators.map((authenticator: any) => ({
        id: Buffer.from(authenticator.credentialID, 'base64url'),
        type: 'public-key',
        transports: authenticator.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    // Store challenge for verification
    await prisma.$executeRaw`
      INSERT INTO "WebAuthnChallenge" ("userId", "challenge", "type", "expiresAt")
      VALUES (${userId}, ${options.challenge}, 'registration', ${new Date(Date.now() + 60000)})
      ON CONFLICT ("userId", "type") DO UPDATE SET 
        "challenge" = ${options.challenge},
        "expiresAt" = ${new Date(Date.now() + 60000)}
    `;

    return options;
  },

  // Verify registration response
  async verifyRegistrationResponse(
    userId: string,
    response: RegistrationResponseJSON
  ): Promise<VerifiedRegistrationResponse> {
    // Get stored challenge
    const challengeRecord = await prisma.$queryRaw<any[]>`
      SELECT "challenge" FROM "WebAuthnChallenge" 
      WHERE "userId" = ${userId} AND "type" = 'registration' AND "expiresAt" > NOW()
    `;

    if (!challengeRecord || challengeRecord.length === 0) {
      throw new Error('Challenge expired or not found');
    }

    const expectedChallenge = challengeRecord[0].challenge;

    // Verify the registration
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      // Store the authenticator
      const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
      
      await prisma.$executeRaw`
        INSERT INTO "Authenticator" (
          "credentialID", "credentialPublicKey", "counter", 
          "credentialDeviceType", "credentialBackedUp", "transports", "userId"
        ) VALUES (
          ${credentialID},
          ${Buffer.from(credentialPublicKey)},
          ${counter},
          ${response.response.authenticatorData ? 'platform' : 'cross-platform'},
          ${verification.registrationInfo.credentialBackedUp || false},
          ${JSON.stringify(response.response.transports || [])},
          ${userId}
        )
      `;

      // Clean up challenge
      await prisma.$executeRaw`
        DELETE FROM "WebAuthnChallenge" 
        WHERE "userId" = ${userId} AND "type" = 'registration'
      `;
    }

    return verification;
  },

  // Generate authentication options
  async generateAuthenticationOptions(userId?: string) {
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: userId ? await this.getUserAuthenticators(userId) : undefined,
    });

    // Store challenge
    const challengeUserId = userId || 'anonymous';
    await prisma.$executeRaw`
      INSERT INTO "WebAuthnChallenge" ("userId", "challenge", "type", "expiresAt")
      VALUES (${challengeUserId}, ${options.challenge}, 'authentication', ${new Date(Date.now() + 60000)})
      ON CONFLICT ("userId", "type") DO UPDATE SET 
        "challenge" = ${options.challenge},
        "expiresAt" = ${new Date(Date.now() + 60000)}
    `;

    return options;
  },

  // Verify authentication response
  async verifyAuthenticationResponse(
    response: AuthenticationResponseJSON,
    userId?: string
  ): Promise<VerifiedAuthenticationResponse & { userId?: string }> {
    // Get authenticator
    const authenticator = await prisma.$queryRaw<any[]>`
      SELECT * FROM "Authenticator" 
      WHERE "credentialID" = ${response.id}
    `;

    if (!authenticator || authenticator.length === 0) {
      throw new Error('Authenticator not found');
    }

    const auth = authenticator[0];
    const expectedUserId = userId || auth.userId;

    // Get challenge
    const challengeRecord = await prisma.$queryRaw<any[]>`
      SELECT "challenge" FROM "WebAuthnChallenge" 
      WHERE "userId" = ${expectedUserId} AND "type" = 'authentication' AND "expiresAt" > NOW()
    `;

    if (!challengeRecord || challengeRecord.length === 0) {
      throw new Error('Challenge expired or not found');
    }

    const expectedChallenge = challengeRecord[0].challenge;

    // Verify authentication
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(auth.credentialID, 'base64url'),
        credentialPublicKey: auth.credentialPublicKey,
        counter: Number(auth.counter),
        transports: auth.transports,
      },
    });

    if (verification.verified) {
      // Update counter
      await prisma.$executeRaw`
        UPDATE "Authenticator" 
        SET "counter" = ${verification.authenticationInfo.newCounter}
        WHERE "credentialID" = ${response.id}
      `;

      // Clean up challenge
      await prisma.$executeRaw`
        DELETE FROM "WebAuthnChallenge" 
        WHERE "userId" = ${expectedUserId} AND "type" = 'authentication'
      `;

      return {
        ...verification,
        userId: auth.userId,
      };
    }

    return verification;
  },

  // Get user's authenticators
  async getUserAuthenticators(userId: string) {
    const authenticators = await prisma.$queryRaw<any[]>`
      SELECT "credentialID", "transports" FROM "Authenticator" 
      WHERE "userId" = ${userId}
    `;

    return authenticators.map((auth) => ({
      id: Buffer.from(auth.credentialID, 'base64url'),
      type: 'public-key' as const,
      transports: auth.transports,
    }));
  },

  // Remove authenticator
  async removeAuthenticator(userId: string, credentialID: string) {
    await prisma.$executeRaw`
      DELETE FROM "Authenticator" 
      WHERE "userId" = ${userId} AND "credentialID" = ${credentialID}
    `;
  },

  // List user's authenticators
  async listAuthenticators(userId: string) {
    return await prisma.$queryRaw`
      SELECT 
        "credentialID",
        "credentialDeviceType",
        "credentialBackedUp",
        "transports",
        "createdAt",
        "updatedAt"
      FROM "Authenticator" 
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `;
  },
};
