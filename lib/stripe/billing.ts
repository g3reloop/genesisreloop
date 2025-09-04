import { stripe, STRIPE_PRODUCTS, PRICING_TIERS } from './config';
import { prisma } from '../db/utils';
import type { Stripe } from 'stripe';

// Create or retrieve Stripe customer
export async function getOrCreateStripeCustomer(userId: string, email: string) {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user && user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
      platform: 'reloop',
    },
  });

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// Create checkout session for subscription
export async function createSubscriptionCheckout({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      ...metadata,
    },
    subscription_data: {
      metadata: {
        userId,
        ...metadata,
      },
    },
    allow_promotion_codes: true,
  });

  return session;
}

// Create checkout for one-time service
export async function createServiceCheckout({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      serviceType: metadata.serviceType || 'professional',
      ...metadata,
    },
    invoice_creation: {
      enabled: true,
    },
  });

  return session;
}

// Get user's current subscription
export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user?.stripeCustomerId || !user.subscriptions[0]) {
    return null;
  }

  // Get Stripe subscription details
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

// Update subscription tier
export async function updateSubscriptionTier(subscriptionId: string, newPriceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });

  return updatedSubscription;
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  // Update local subscription status
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'CANCELLED' },
  });

  return subscription;
}

// Record agent usage for metering
export async function recordAgentUsage(userId: string, agentName: string, calls: number = 1) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user?.stripeCustomerId || !user.subscriptions[0]) {
    throw new Error('No active subscription');
  }

  const subscription = user.subscriptions[0];
  const tier = subscription.planType;

  // Check limits based on tier
  const limits = {
    SMALL_SUPPLIER: { agents: 2, calls: 200 },
    MEDIUM_SUPPLIER: { agents: 6, calls: 2000 },
    LARGE_SUPPLIER: { agents: 18, calls: -1 }, // Unlimited
  };

  const limit = limits[tier as keyof typeof limits];
  if (!limit) return; // No limits for this tier

  // Track usage in database
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usage = await prisma.agentUsage.upsert({
    where: {
      userId_month: {
        userId,
        month: currentMonth,
      },
    },
    update: {
      totalCalls: { increment: calls },
      agentsUsed: {
        push: agentName,
      },
    },
    create: {
      userId,
      month: currentMonth,
      totalCalls: calls,
      agentsUsed: [agentName],
    },
  });

  // If over limit and not unlimited, record overage
  if (limit.calls > 0 && usage.totalCalls > limit.calls) {
    const overage = usage.totalCalls - limit.calls;
    
    // Get Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId!
    );
    
    // Find metered subscription item
    const meteredItem = stripeSubscription.items.data.find(
      item => item.price.id === STRIPE_PRODUCTS.AGENT_OVERAGE
    );

    if (meteredItem) {
      // Report usage to Stripe
      await stripe.subscriptionItems.createUsageRecord(
        meteredItem.id,
        {
          quantity: overage,
          timestamp: Math.floor(Date.now() / 1000),
          action: 'set', // Set total overage for the period
        }
      );
    }
  }

  return usage;
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Get subscription usage for current period
export async function getSubscriptionUsage(userId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const usage = await prisma.agentUsage.findUnique({
    where: {
      userId_month: {
        userId,
        month: currentMonth,
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        take: 1,
      },
    },
  });

  const subscription = user?.subscriptions[0];
  const tier = subscription?.planType || 'SMALL_SUPPLIER';
  
  const limits = {
    SMALL_SUPPLIER: { agents: 2, calls: 200 },
    MEDIUM_SUPPLIER: { agents: 6, calls: 2000 },
    LARGE_SUPPLIER: { agents: 18, calls: -1 },
  };

  const limit = limits[tier as keyof typeof limits] || limits.SMALL_SUPPLIER;
  const uniqueAgents = [...new Set(usage?.agentsUsed || [])].length;

  return {
    totalCalls: usage?.totalCalls || 0,
    uniqueAgents,
    callLimit: limit.calls,
    agentLimit: limit.agents,
    overage: limit.calls > 0 ? Math.max(0, (usage?.totalCalls || 0) - limit.calls) : 0,
    percentUsed: limit.calls > 0 ? ((usage?.totalCalls || 0) / limit.calls) * 100 : 0,
  };
}

// Sync subscription from Stripe webhook
export async function syncSubscriptionFromStripe(stripeSubscription: Stripe.Subscription) {
  const userId = stripeSubscription.metadata.userId;
  if (!userId) return;

  // Determine plan type from price
  let planType: string = 'SMALL_SUPPLIER';
  const priceId = stripeSubscription.items.data[0]?.price.id;
  
  if (priceId === STRIPE_PRODUCTS.BASIC_LOOP) {
    planType = 'SMALL_SUPPLIER';
  } else if (priceId === STRIPE_PRODUCTS.OPERATIONAL_LOOP) {
    planType = 'MEDIUM_SUPPLIER';
  } else if (priceId === STRIPE_PRODUCTS.FULL_LOOP) {
    planType = 'LARGE_SUPPLIER';
  }

  // Update or create subscription
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: stripeSubscription.id,
    },
    update: {
      status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
      endDate: stripeSubscription.current_period_end 
        ? new Date(stripeSubscription.current_period_end * 1000)
        : undefined,
    },
    create: {
      userId,
      stripeSubscriptionId: stripeSubscription.id,
      planType: planType as any,
      status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
      startDate: new Date(stripeSubscription.current_period_start * 1000),
      endDate: new Date(stripeSubscription.current_period_end * 1000),
      monthlyFee: (stripeSubscription.items.data[0]?.price.unit_amount || 0) / 100,
      perBatchFee: 0,
    },
  });
}
