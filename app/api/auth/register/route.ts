import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/utils';
import { createAdminClient } from '@/lib/supabase/server';
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { UserRole } from '@prisma/client';

// Registration schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
  role: z.enum(['SUPPLIER', 'PROCESSOR', 'BUYER', 'COLLECTOR']),
  businessDetails: z.object({
    businessName: z.string().min(1).max(200),
    address: z.string().min(1).max(500),
    contactPhone: z.string().min(1).max(50),
    // Role-specific fields
    supplierType: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    processorType: z.enum(['BIOGAS', 'BIODIESEL', 'BOTH']).optional(),
    buyerType: z.enum(['BIODIESEL_BUYER', 'GLYCERIN_BUYER', 'DIGESTATE_BUYER', 'CARBON_CREDIT_BUYER', 'OTHER']).optional(),
    vehicleType: z.string().optional(),
    capacity: z.number().optional(),
  }),
});

export const POST = withRateLimit(
  async (req: NextRequest) => {
    try {
      // Parse request body
      const body = await req.json();
      const validationResult = registerSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validationResult.error.errors },
          { status: 400 }
        );
      }

      const data = validationResult.data;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }

      // Create user in Supabase Auth
      const supabase = createAdminClient();
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true, // Auto-confirm for now, implement email verification in production
        user_metadata: {
          name: data.name,
          role: data.role,
        },
      });

      if (authError || !authUser.user) {
        console.error('Supabase auth error:', authError);
        return NextResponse.json(
          { error: 'Failed to create account' },
          { status: 500 }
        );
      }

      // Create user and role-specific record in database
      const result = await prisma.$transaction(async (tx) => {
        // Create user record
        const user = await tx.user.create({
          data: {
            id: authUser.user.id,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
          },
        });

        // Create role-specific record
        let roleRecord;
        const businessDetails = data.businessDetails;

        switch (data.role) {
          case 'SUPPLIER':
            roleRecord = await tx.supplier.create({
              data: {
                userId: user.id,
                businessName: businessDetails.businessName,
                address: businessDetails.address,
                contactPhone: businessDetails.contactPhone,
                supplierType: businessDetails.supplierType || 'SMALL',
              },
            });
            break;

          case 'PROCESSOR':
            roleRecord = await tx.processor.create({
              data: {
                userId: user.id,
                businessName: businessDetails.businessName,
                location: businessDetails.address,
                processorType: businessDetails.processorType || 'BOTH',
                capacity: businessDetails.capacity || 10,
              },
            });
            break;

          case 'BUYER':
            roleRecord = await tx.buyer.create({
              data: {
                userId: user.id,
                businessName: businessDetails.businessName,
                buyerType: businessDetails.buyerType || 'OTHER',
              },
            });
            break;

          case 'COLLECTOR':
            roleRecord = await tx.collector.create({
              data: {
                userId: user.id,
                vehicleType: businessDetails.vehicleType || 'Van',
                capacity: businessDetails.capacity || 500,
              },
            });
            break;
        }

        // Create default subscription for suppliers
        if (data.role === 'SUPPLIER') {
          const plan = businessDetails.supplierType === 'SMALL' 
            ? 'SMALL_SUPPLIER' 
            : businessDetails.supplierType === 'MEDIUM' 
              ? 'MEDIUM_SUPPLIER' 
              : 'LARGE_SUPPLIER';

          await tx.subscription.create({
            data: {
              userId: user.id,
              planType: plan,
              status: 'ACTIVE',
              monthlyFee: plan === 'SMALL_SUPPLIER' ? 49 : 199,
              perBatchFee: plan === 'SMALL_SUPPLIER' ? 5 : 0,
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
            },
          });
        }

        // Send welcome notification
        await tx.notification.create({
          data: {
            userId: user.id,
            type: 'SYSTEM_ALERT',
            title: 'Welcome to ReLoop!',
            message: `Your ${data.role.toLowerCase()} account has been created successfully. Complete your profile to get started.`,
            data: { onboarding: true },
          },
        });

        return { user, roleRecord };
      });

      // Log registration
      await prisma.agentActivity.create({
        data: {
          agentName: 'AuthSystem',
          action: 'user_registration',
          inputData: { email: data.email, role: data.role },
          outputData: { userId: result.user.id },
          success: true,
          duration: 0,
        },
      });

      return NextResponse.json(
        {
          success: true,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  { limiter: 'auth' }
);
