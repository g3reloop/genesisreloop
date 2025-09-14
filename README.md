# ReLoop - Circular Economy Platform

An AI-powered platform for sustainable waste management and circular economy, focusing on transforming food waste and used cooking oil (UCO) into valuable resources through Short Renewable Loops (SRL).

## 🌟 Overview

ReLoop is a comprehensive circular economy platform that connects suppliers, processors, collectors, and buyers in an intelligent marketplace. The platform uses AI agents to optimize collection routes, verify quality, match suppliers with processors, generate carbon credits, and ensure regulatory compliance.

### Key Features

- **Feedstock Marketplace**: Trade UCO and food waste with SRL/CRL classification
- **Smart Collection Routing**: AI-optimized micro-collection routes
- **Quality & Traceability**: Real-time tracking with IoT sensor integration
- **Secondary Product Market**: Match biodiesel, glycerin, and digestate with buyers
- **Carbon Credit Ledger**: Automated carbon credit generation and trading
- **Compliance Dashboard**: UK/EU regulatory documentation
- **Reputation System**: Dynamic trust scores for all participants
- **Interactive Visualization**: Toroidal loop network showing real-time flows

## 🤖 AI Agents

### Live Agents (10/18)

1. **FeedstockMatcher** - Matches suppliers to processors based on location, capacity, and SRL priority
2. **TraceBot** - Batch quality verification and SRL/CRL classification
3. **RouteGen** - Generates optimal micro-collection routes
4. **ByproductMatcher** - Matches secondary products to new buyers
5. **BuyerDiscoveryBot** - Finds buyers for biodiesel and secondary products
6. **CarbonVerifier** - Calculates avoided CO₂ per batch
7. **ComplianceClerk** - Generates compliance documentation
8. **ReputationBot** - Tracks deliveries and updates trust scores
9. **LiquidityBot** - Operates AMM/escrow pools with instant buy/sell quotes
10. **LoopAuditBot** - Generates zero-knowledge proofs and immutable audit trails

### Planned Agents (8/18)

- DynamicPricingBot (12 months)
- PredictiveSupplyBot (12-18 months)
- LoopInsurer (12 months) - Micro-insurance with automated claims
- InsuranceRiskBot (18 months)
- FinanceBot (18-24 months)
- DAOGovernanceBot (24 months)
- LoopExpansionBot (24 months)
- ConsumerPortalBot (24 months)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- Redis
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd reloop-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the platform.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Custom mythic-tech theme with Radix UI
- **Visualization**: D3.js for toroidal network visualization
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Real-time**: Socket.io
- **State Management**: React Query
- **Authentication**: NextAuth.js (planned)
- **Smart Contracts**: Ethereum/Polygon (planned)

## 🔐 DARPA-Level Security

### Encryption Layers
- **In-Transit**: TLS 1.3 + Post-Quantum hybrid (X25519+Kyber)
- **At-Rest**: AES-256-GCM with hardware-backed keys (TPM/HSM)
- **Field-Level**: Encrypted PII with searchable encrypted indexes
- **Post-Quantum**: Kyber512/768 for key exchange, Dilithium2 for signatures
- **Confidential Compute**: TEE attestation (SGX/TDX/SEV) for agent execution

### Zero-Knowledge Validation
- Prove batch quality thresholds without revealing sensor data
- Prove chain-of-custody continuity without exposing handlers
- Prove carbon credit calculations with Groth16/PLONK proofs
- On-chain Merkle roots with IPFS/Arweave proof artifacts

### Access Control
- WebAuthn + Passkeys + Hardware keys (YubiKey/NFC)
- DID/VC roles for all participants
- Just-in-time scoped tokens with device posture checks
- Geo/route geofencing for collectors

### DAO-Signed Updates
- SBOM generation and SLSA Level 3 attestations
- Threshold signatures (TSS) for releases
- Versioned rollout with kill-switch capabilities

## 📊 Pricing Model

### Suppliers
- **Small Suppliers**: £49/month + £5/batch
- **Medium/Large Suppliers**: £199/month + £0/batch

### Other Participants
- **Micro-collection Agents**: £29/month
- **Buyers (Secondary Products)**: 1.5% transaction fee

## 🗺️ Roadmap

### Q2 2024
- ✅ Core platform development
- ✅ Live AI agents (8/15)
- ✅ Marketplace functionality
- 🔄 IoT sensor integration

### Q3 2024
- 🔄 Cross-border trade hub
- 🔄 AI predictive supply modeling
- 🔄 Blockchain smart contracts
- 🔄 Modular certification engine

### Q4 2024
- 📅 Dynamic pricing engine
- 📅 Insurance & risk module

### Q1 2025
- 📅 Global buyer networks
- 📅 Embedded finance layer
- 📅 Consumer-facing portal

### Q2 2025
- 📅 DAO governance layer
- 📅 Remaining AI agents

## 🌱 Environmental Impact

The ReLoop platform helps create a circular economy by:
- Converting waste into valuable resources
- Reducing CO₂ emissions through verified carbon credits
- Prioritizing Short Renewable Loops (SRL) over contaminated ones
- Creating transparency in the waste-to-resource supply chain

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](docs/)
- [API Reference](docs/api/)
- [Agent Documentation](docs/agents/)

## 📧 Contact

For questions or partnerships, contact us at: hello@reloop.eco

---

Built with 💚 for a sustainable future by the Genesis Protocol team.
