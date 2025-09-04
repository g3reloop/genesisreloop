#!/bin/bash

# Genesis Reloop Stripe Catalog Setup Script
# This script creates all products and prices in Stripe

echo "🚀 Setting up Genesis Reloop Stripe Catalog"
echo "==========================================="

# Check if Stripe CLI is installed
STRIPE_CLI="/usr/local/bin/stripe"
if [ ! -f "$STRIPE_CLI" ]; then
    echo "❌ Stripe CLI not found. Please install it first:"
    echo "https://stripe.com/docs/stripe-cli#install"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq not found. Installing..."
    sudo apt-get update && sudo apt-get install -y jq
fi

# Create output directory
rm -rf stripe-catalog
mkdir -p stripe-catalog

echo "📦 Creating SaaS Products..."

# Basic Loop Access
echo "Creating Basic Loop Access..."
BASIC_PRODUCT=$($STRIPE_CLI products create \
    --name='Basic Loop Access' \
    --description='Genesis Reloop SaaS. Up to 2 agents, 200 agent calls/month.' \
    -d "metadata[tier]=basic" \
    -d "metadata[agent_limit]=2" \
    -d "metadata[call_limit]=200" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $BASIC_PRODUCT"

BASIC_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=4900 \
    --product=$BASIC_PRODUCT \
    -d "recurring[interval]=month" \
    -d "metadata[tier]=basic" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $BASIC_PRICE"

# Operational Loop
echo "Creating Operational Loop..."
OPS_PRODUCT=$($STRIPE_CLI products create \
    --name='Operational Loop' \
    --description='Up to 6 agents, 2,000 agent calls/month.' \
    -d "metadata[tier]=operational" \
    -d "metadata[agent_limit]=6" \
    -d "metadata[call_limit]=2000" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $OPS_PRODUCT"

OPS_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=19900 \
    --product=$OPS_PRODUCT \
    -d "recurring[interval]=month" \
    -d "metadata[tier]=operational" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $OPS_PRICE"

# Full Loop Suite
echo "Creating Full Loop Suite..."
FULL_PRODUCT=$($STRIPE_CLI products create \
    --name='Full Loop Suite' \
    --description='All agents enabled. Fair-use policy.' \
    -d "metadata[tier]=full" \
    -d "metadata[agent_limit]=18" \
    -d "metadata[call_limit]=-1" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $FULL_PRODUCT"

FULL_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=49900 \
    --product=$FULL_PRODUCT \
    -d "recurring[interval]=month" \
    -d "metadata[tier]=full" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $FULL_PRICE"

# Agent Overage
echo "Creating Agent Compute Overage..."
OVER_PRODUCT=$($STRIPE_CLI products create \
    --name='Agent Compute Overage' \
    --description='Metered overage for agent calls beyond plan cap.' \
    -d "metadata[type]=overage" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $OVER_PRODUCT"

OVER_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount-decimal=200 \
    --product=$OVER_PRODUCT \
    -d "recurring[interval]=month" \
    -d "recurring[usage_type]=metered" \
    -d "billing_scheme=per_unit" \
    -d "metadata[type]=overage" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $OVER_PRICE"

echo "📋 Creating Professional Services..."

# CAT Service
echo "Creating CAT Application Service..."
CAT_PRODUCT=$($STRIPE_CLI products create \
    --name='CAT Application Service' \
    --description='Council-ready CAT dossier & submission.' \
    -d "metadata[type]=professional_service" \
    -d "metadata[service]=cat" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $CAT_PRODUCT"

CAT_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=200000 \
    --product=$CAT_PRODUCT \
    -d "metadata[type]=one_time" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $CAT_PRICE"

# DAO Service
echo "Creating DAO Setup Service..."
DAO_PRODUCT=$($STRIPE_CLI products create \
    --name='DAO Setup Service' \
    --description='Pre-DAO → DAO rules, PM induction, go-live.' \
    -d "metadata[type]=professional_service" \
    -d "metadata[service]=dao_setup" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $DAO_PRODUCT"

DAO_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=350000 \
    --product=$DAO_PRODUCT \
    -d "metadata[type]=one_time" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $DAO_PRICE"

# Bundle Service
echo "Creating DAO + CAT Bundle..."
BUNDLE_PRODUCT=$($STRIPE_CLI products create \
    --name='DAO + CAT Bundle' \
    --description='Combined DAO setup and CAT application.' \
    -d "metadata[type]=professional_service" \
    -d "metadata[service]=bundle" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $BUNDLE_PRODUCT"

BUNDLE_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=500000 \
    --product=$BUNDLE_PRODUCT \
    -d "metadata[type]=one_time" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $BUNDLE_PRICE"

# Grant Service
echo "Creating Research Grant Application..."
GRANT_PRODUCT=$($STRIPE_CLI products create \
    --name='Research Grant Application' \
    --description='Grant scoping, dossier, budget, submission.' \
    -d "metadata[type]=professional_service" \
    -d "metadata[service]=grant" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $GRANT_PRODUCT"

GRANT_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=250000 \
    --product=$GRANT_PRODUCT \
    -d "metadata[type]=one_time" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $GRANT_PRICE"

# Retainer Service
echo "Creating DAO Management Retainer..."
RETAINER_PRODUCT=$($STRIPE_CLI products create \
    --name='DAO Management Retainer' \
    --description='Ongoing audits, PM training, treasury/ops review.' \
    -d "metadata[type]=professional_service" \
    -d "metadata[service]=retainer" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Product ID: $RETAINER_PRODUCT"

RETAINER_PRICE=$($STRIPE_CLI prices create \
    --currency=gbp \
    --unit-amount=50000 \
    --product=$RETAINER_PRODUCT \
    -d "recurring[interval]=month" \
    -d "metadata[type]=recurring" | grep '"id"' | head -1 | cut -d'"' -f4)

echo "Price ID: $RETAINER_PRICE"

# Create .env snippet
echo "
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Stripe Price IDs for Genesis Reloop
NEXT_PUBLIC_STRIPE_BASIC_LOOP_PRICE_ID=$BASIC_PRICE
NEXT_PUBLIC_STRIPE_OPS_LOOP_PRICE_ID=$OPS_PRICE
NEXT_PUBLIC_STRIPE_FULL_LOOP_PRICE_ID=$FULL_PRICE
NEXT_PUBLIC_STRIPE_OVERAGE_PRICE_ID=$OVER_PRICE
NEXT_PUBLIC_STRIPE_CAT_PRICE_ID=$CAT_PRICE
NEXT_PUBLIC_STRIPE_DAO_PRICE_ID=$DAO_PRICE
NEXT_PUBLIC_STRIPE_BUNDLE_PRICE_ID=$BUNDLE_PRICE
NEXT_PUBLIC_STRIPE_GRANT_PRICE_ID=$GRANT_PRICE
NEXT_PUBLIC_STRIPE_RETAINER_PRICE_ID=$RETAINER_PRICE
" > stripe-catalog/env_snippet.txt

# Create summary JSON
echo "{
  \"basic\": \"$BASIC_PRICE\",
  \"ops\": \"$OPS_PRICE\",
  \"full\": \"$FULL_PRICE\",
  \"overage\": \"$OVER_PRICE\",
  \"cat\": \"$CAT_PRICE\",
  \"dao\": \"$DAO_PRICE\",
  \"bundle\": \"$BUNDLE_PRICE\",
  \"grant\": \"$GRANT_PRICE\",
  \"retainer\": \"$RETAINER_PRICE\"
}" > stripe-catalog/price_ids.json

echo ""
echo "✅ Stripe catalog setup complete!"
echo ""
echo "📋 Summary:"
echo "- Created 9 products with prices"
echo "- Price IDs saved to: stripe-catalog/price_ids.json"
echo "- Environment variables saved to: stripe-catalog/env_snippet.txt"
echo ""
echo "🔧 Next steps:"
echo "1. Copy the environment variables from stripe-catalog/env_snippet.txt to your .env.local"
echo "2. Get your Stripe secret key from: https://dashboard.stripe.com/test/apikeys"
echo "3. Set up webhook endpoint at: https://your-domain.com/api/stripe/webhook"
echo "4. Configure webhook secret in Stripe dashboard"
echo ""
