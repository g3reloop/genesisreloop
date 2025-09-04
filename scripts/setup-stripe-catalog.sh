#!/bin/bash

# Genesis Reloop Stripe Catalog Setup Script
# This script creates all products and prices in Stripe

echo "🚀 Setting up Genesis Reloop Stripe Catalog"
echo "=========================================="

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
mkdir -p stripe-catalog

echo "📦 Creating SaaS Products..."

# Basic Loop Access
echo "Creating Basic Loop Access..."
$STRIPE_CLI products create \
    --name 'Basic Loop Access' \
    --description 'Genesis Reloop SaaS. Up to 2 agents, 200 agent calls/month.' \
    --metadata "tier=basic" \
    --metadata "agent_limit=2" \
    --metadata "call_limit=200" \
    --json > stripe-catalog/product_basic.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 4900 \
    --recurring interval=month \
    --product $(jq -r .id stripe-catalog/product_basic.json) \
    --metadata[tier]="basic" \
    --json > stripe-catalog/price_basic.json

# Operational Loop
echo "Creating Operational Loop..."
$STRIPE_CLI products create \
    --name 'Operational Loop' \
    --type service \
    --description 'Up to 6 agents, 2,000 agent calls/month.' \
    --metadata[tier]="operational" \
    --metadata[agent_limit]="6" \
    --metadata[call_limit]="2000" \
    --json > stripe-catalog/product_ops.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 19900 \
    --recurring interval=month \
    --product $(jq -r .id stripe-catalog/product_ops.json) \
    --metadata[tier]="operational" \
    --json > stripe-catalog/price_ops.json

# Full Loop Suite
echo "Creating Full Loop Suite..."
$STRIPE_CLI products create \
    --name 'Full Loop Suite' \
    --type service \
    --description 'All agents enabled. Fair-use policy.' \
    --metadata[tier]="full" \
    --metadata[agent_limit]="18" \
    --metadata[call_limit]="-1" \
    --json > stripe-catalog/product_full.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 49900 \
    --recurring interval=month \
    --product $(jq -r .id stripe-catalog/product_full.json) \
    --metadata[tier]="full" \
    --json > stripe-catalog/price_full.json

# Agent Overage
echo "Creating Agent Compute Overage..."
$STRIPE_CLI products create \
    --name 'Agent Compute Overage' \
    --type service \
    --description 'Metered overage for agent calls beyond plan cap.' \
    --metadata[type]="overage" \
    --json > stripe-catalog/product_over.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount-decimal 200 \
    --billing-scheme per_unit \
    --recurring interval=month usage_type=metered aggregate_usage=sum \
    --product $(jq -r .id stripe-catalog/product_over.json) \
    --nickname '£0.02 per agent_call' \
    --metadata[type]="overage" \
    --json > stripe-catalog/price_over.json

echo "📋 Creating Professional Services..."

# CAT Service
echo "Creating CAT Application Service..."
$STRIPE_CLI products create \
    --name 'CAT Application Service' \
    --type service \
    --description 'Council-ready CAT dossier & submission.' \
    --metadata[type]="professional_service" \
    --metadata[service]="cat" \
    --json > stripe-catalog/product_cat.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 200000 \
    --product $(jq -r .id stripe-catalog/product_cat.json) \
    --metadata[type]="one_time" \
    --json > stripe-catalog/price_cat.json

# DAO Service
echo "Creating DAO Setup Service..."
$STRIPE_CLI products create \
    --name 'DAO Setup Service' \
    --type service \
    --description 'Pre-DAO → DAO rules, PM induction, go-live.' \
    --metadata[type]="professional_service" \
    --metadata[service]="dao_setup" \
    --json > stripe-catalog/product_dao.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 350000 \
    --product $(jq -r .id stripe-catalog/product_dao.json) \
    --metadata[type]="one_time" \
    --json > stripe-catalog/price_dao.json

# Bundle Service
echo "Creating DAO + CAT Bundle..."
$STRIPE_CLI products create \
    --name 'DAO + CAT Bundle' \
    --type service \
    --description 'Combined DAO setup and CAT application.' \
    --metadata[type]="professional_service" \
    --metadata[service]="bundle" \
    --json > stripe-catalog/product_bundle.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 500000 \
    --product $(jq -r .id stripe-catalog/product_bundle.json) \
    --metadata[type]="one_time" \
    --json > stripe-catalog/price_bundle.json

# Grant Service
echo "Creating Research Grant Application..."
$STRIPE_CLI products create \
    --name 'Research Grant Application' \
    --type service \
    --description 'Grant scoping, dossier, budget, submission.' \
    --metadata[type]="professional_service" \
    --metadata[service]="grant" \
    --json > stripe-catalog/product_grant.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 250000 \
    --product $(jq -r .id stripe-catalog/product_grant.json) \
    --metadata[type]="one_time" \
    --json > stripe-catalog/price_grant.json

# Retainer Service
echo "Creating DAO Management Retainer..."
$STRIPE_CLI products create \
    --name 'DAO Management Retainer' \
    --type service \
    --description 'Ongoing audits, PM training, treasury/ops review.' \
    --metadata[type]="professional_service" \
    --metadata[service]="retainer" \
    --json > stripe-catalog/product_retainer.json

$STRIPE_CLI prices create \
    --currency gbp \
    --unit-amount 50000 \
    --recurring interval=month \
    --product $(jq -r .id stripe-catalog/product_retainer.json) \
    --metadata[type]="recurring" \
    --json > stripe-catalog/price_retainer.json

echo "📊 Collecting all IDs..."

# Collect all price IDs
jq -s '{
    basic: .[0].id,
    ops: .[1].id,
    full: .[2].id,
    over: .[3].id,
    cat: .[4].id,
    dao: .[5].id,
    bundle: .[6].id,
    grant: .[7].id,
    retainer: .[8].id
}' stripe-catalog/price_basic.json \
   stripe-catalog/price_ops.json \
   stripe-catalog/price_full.json \
   stripe-catalog/price_over.json \
   stripe-catalog/price_cat.json \
   stripe-catalog/price_dao.json \
   stripe-catalog/price_bundle.json \
   stripe-catalog/price_grant.json \
   stripe-catalog/price_retainer.json \
   > stripe-catalog/stripe_ids.json

# Create .env snippet
echo "
# Stripe Price IDs for Genesis Reloop
NEXT_PUBLIC_STRIPE_BASIC_LOOP_PRICE_ID=$(jq -r .basic stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_OPS_LOOP_PRICE_ID=$(jq -r .ops stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_FULL_LOOP_PRICE_ID=$(jq -r .full stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_OVERAGE_PRICE_ID=$(jq -r .over stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_CAT_PRICE_ID=$(jq -r .cat stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_DAO_PRICE_ID=$(jq -r .dao stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_BUNDLE_PRICE_ID=$(jq -r .bundle stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_GRANT_PRICE_ID=$(jq -r .grant stripe-catalog/stripe_ids.json)
NEXT_PUBLIC_STRIPE_RETAINER_PRICE_ID=$(jq -r .retainer stripe-catalog/stripe_ids.json)
" > stripe-catalog/env_snippet.txt

echo ""
echo "✅ Stripe catalog setup complete!"
echo ""
echo "📋 Summary:"
echo "- Created 9 products with prices"
echo "- Product IDs saved to: stripe-catalog/stripe_ids.json"
echo "- Environment variables saved to: stripe-catalog/env_snippet.txt"
echo ""
echo "🔧 Next steps:"
echo "1. Copy the environment variables from stripe-catalog/env_snippet.txt to your .env.local"
echo "2. Set up webhook endpoint at: https://your-domain.com/api/stripe/webhook"
echo "3. Configure webhook secret in Stripe dashboard"
echo ""
