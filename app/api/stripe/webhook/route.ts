import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { syncSubscriptionFromStripe } from '@/lib/stripe/billing';
import { prisma } from '@/lib/db/utils';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle successful checkout
        if (session.mode === 'subscription' && session.subscription) {
          // Subscription created via checkout
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await syncSubscriptionFromStripe(subscription);
        } else if (session.mode === 'payment') {
          // One-time payment completed
          const userId = session.metadata?.userId;
          const serviceType = session.metadata?.serviceType;
          
          if (userId && serviceType) {
            // Create service order record
            await prisma.serviceOrder.create({
              data: {
                userId,
                serviceType,
                stripePaymentIntentId: session.payment_intent as string,
                amount: session.amount_total! / 100,
                status: 'PAID',
                metadata: session.metadata,
              },
            });
            
            // Send notification
            await prisma.notification.create({
              data: {
                userId,
                type: 'PAYMENT_RECEIVED',
                title: 'Payment Received',
                message: `Your payment for ${serviceType} has been received. We'll be in touch soon.`,
                data: { orderId: session.id },
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionFromStripe(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as cancelled
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { 
            status: 'CANCELLED',
            endDate: new Date(),
          },
        });
        
        // Notify user
        const userId = subscription.metadata.userId;
        if (userId) {
          await prisma.notification.create({
            data: {
              userId,
              type: 'SYSTEM_ALERT',
              title: 'Subscription Cancelled',
              message: 'Your subscription has been cancelled. You can reactivate it anytime.',
            },
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Record successful payment
        if (invoice.subscription && invoice.metadata?.userId) {
          await prisma.paymentRecord.create({
            data: {
              userId: invoice.metadata.userId,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid / 100,
              status: 'SUCCEEDED',
              description: invoice.description || 'Subscription payment',
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Handle failed payment
        if (invoice.subscription && invoice.metadata?.userId) {
          const userId = invoice.metadata.userId;
          
          // Record failed payment
          await prisma.paymentRecord.create({
            data: {
              userId,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_due / 100,
              status: 'FAILED',
              description: 'Payment failed - ' + (invoice.description || 'Subscription payment'),
            },
          });
          
          // Send notification
          await prisma.notification.create({
            data: {
              userId,
              type: 'PAYMENT_RECEIVED', // Using existing type
              title: 'Payment Failed',
              message: 'Your payment failed. Please update your payment method to continue your subscription.',
              data: { invoiceId: invoice.id },
            },
          });
        }
        break;
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        
        // Update user email if changed
        if (customer.email && customer.metadata?.userId) {
          await prisma.user.update({
            where: { id: customer.metadata.userId },
            data: { email: customer.email },
          });
        }
        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        
        // Log payment method attachment
        console.log('Payment method attached:', paymentMethod.id);
        break;
      }

      case 'usage_record.created': {
        const usageRecord = event.data.object as Stripe.UsageRecord;
        
        // Log metered usage
        console.log('Usage recorded:', usageRecord);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log webhook event
    await prisma.agentActivity.create({
      data: {
        agentName: 'StripeWebhook',
        action: event.type,
        inputData: { eventId: event.id },
        outputData: { processed: true },
        success: true,
        duration: 0,
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Log error
    await prisma.agentActivity.create({
      data: {
        agentName: 'StripeWebhook',
        action: event.type,
        inputData: { eventId: event.id },
        outputData: {},
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: 0,
      },
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook route
export const runtime = 'nodejs';
