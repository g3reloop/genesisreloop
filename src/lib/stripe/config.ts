import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Product/Price IDs (will be populated from stripe_ids.json)
export const STRIPE_PRODUCTS = {
  // SaaS Tiers
  BASIC_LOOP: process.env.NEXT_PUBLIC_STRIPE_BASIC_LOOP_PRICE_ID!,
  OPERATIONAL_LOOP: process.env.NEXT_PUBLIC_STRIPE_OPS_LOOP_PRICE_ID!,
  FULL_LOOP: process.env.NEXT_PUBLIC_STRIPE_FULL_LOOP_PRICE_ID!,
  AGENT_OVERAGE: process.env.NEXT_PUBLIC_STRIPE_OVERAGE_PRICE_ID!,
  
  // Professional Services
  CAT_SERVICE: process.env.NEXT_PUBLIC_STRIPE_CAT_PRICE_ID!,
  DAO_SERVICE: process.env.NEXT_PUBLIC_STRIPE_DAO_PRICE_ID!,
  DAO_CAT_BUNDLE: process.env.NEXT_PUBLIC_STRIPE_BUNDLE_PRICE_ID!,
  GRANT_SERVICE: process.env.NEXT_PUBLIC_STRIPE_GRANT_PRICE_ID!,
  DAO_RETAINER: process.env.NEXT_PUBLIC_STRIPE_RETAINER_PRICE_ID!,
};

// Pricing tiers configuration
export const PRICING_TIERS = {
  BASIC_LOOP: {
    name: 'Basic Loop Access',
    price: 49,
    currency: 'gbp',
    interval: 'month',
    features: [
      'Up to 2 AI agents',
      '200 agent calls per month',
      'Basic analytics',
      'Email support',
      'SRL/CRL classification',
    ],
    agentLimit: 2,
    callLimit: 200,
  },
  OPERATIONAL_LOOP: {
    name: 'Operational Loop',
    price: 199,
    currency: 'gbp',
    interval: 'month',
    features: [
      'Up to 6 AI agents',
      '2,000 agent calls per month',
      'Advanced analytics',
      'Priority support',
      'Compliance reports',
      'API access',
    ],
    agentLimit: 6,
    callLimit: 2000,
  },
  FULL_LOOP: {
    name: 'Full Loop Suite',
    price: 499,
    currency: 'gbp',
    interval: 'month',
    features: [
      'All 18 AI agents enabled',
      'Unlimited agent calls (fair use)',
      'Real-time analytics',
      'Dedicated support',
      'Custom integrations',
      'White-label options',
      'Advanced API access',
    ],
    agentLimit: 18,
    callLimit: -1, // Unlimited
  },
};

// Professional services
export const PROFESSIONAL_SERVICES = {
  CAT_SERVICE: {
    name: 'CAT Application Service',
    price: 2000,
    currency: 'gbp',
    description: 'Council-ready CAT dossier & submission',
    deliverables: [
      'Full CAT application preparation',
      'Council submission support',
      'Documentation review',
      'Follow-up assistance',
    ],
  },
  DAO_SERVICE: {
    name: 'DAO Setup Service',
    price: 3500,
    currency: 'gbp',
    description: 'Pre-DAO → DAO transformation',
    deliverables: [
      'DAO governance structure',
      'Smart contract deployment',
      'Member onboarding',
      'Operations setup',
      'Training materials',
    ],
  },
  DAO_CAT_BUNDLE: {
    name: 'DAO + CAT Bundle',
    price: 5000,
    currency: 'gbp',
    description: 'Complete DAO setup with CAT application',
    deliverables: [
      'All DAO Setup services',
      'All CAT Application services',
      'Integrated compliance',
      '£500 bundle discount',
    ],
  },
  GRANT_SERVICE: {
    name: 'Research Grant Application',
    price: 2500,
    currency: 'gbp',
    description: 'Grant scoping, dossier, budget, submission',
    deliverables: [
      'Grant opportunity research',
      'Application writing',
      'Budget preparation',
      'Submission support',
    ],
  },
  DAO_RETAINER: {
    name: 'DAO Management Retainer',
    price: 500,
    currency: 'gbp',
    interval: 'month',
    description: 'Ongoing DAO support and management',
    deliverables: [
      'Monthly audits',
      'PM training sessions',
      'Treasury reviews',
      'Operations optimization',
    ],
  },
};

// Agent overage pricing
export const OVERAGE_PRICING = {
  pricePerCall: 0.02, // £0.02 per call
  currency: 'gbp',
  billingThreshold: 100, // Bill when £1.00 of usage
};

// Webhook events we handle
export const STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.updated',
  'payment_method.attached',
  'usage_record.created',
];
