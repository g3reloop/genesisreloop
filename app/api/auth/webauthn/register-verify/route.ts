import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { webauthn } from '@/lib/auth/webauthn';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: RegistrationResponseJSON = await req.json();
    const verification = await webauthn.verifyRegistrationResponse(user.id, body);

    if (verification.verified) {
      return NextResponse.json({
        verified: true,
        message: 'Passkey registered successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('WebAuthn registration verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify registration' },
      { status: 500 }
    );
  }
}
