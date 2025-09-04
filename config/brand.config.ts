// Genesis Reloop Brand Configuration
export const brandConfig = {
  // Brand Identity
  brand: {
    name: "Genesis Reloop",
    tagline: "Turn waste into local industry.",
    tone: "direct, operational, credible, DAO-first, no fluff"
  },

  // SEO & Metadata
  seo: {
    defaultTitle: "Genesis Reloop — Decentralized Circular Economy for Waste-to-Value",
    defaultDescription: "Connect feedstock suppliers, labs, and buyers. Automate deals, verify chain-of-custody, and issue GIRM Credits for measurable impact across UK/EU.",
    keywords: "circular economy, waste to value, chemical recycling, DAO marketplace, verified chain of custody, UK, EU, Genesis"
  },

  // Navigation
  nav: [
    { label: "Platform", href: "/" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Supply Chains", href: "/supply-chains" },
    { label: "Governance", href: "/governance" },
    { label: "GIRM Credits", href: "/girm" },
    { label: "Learn", href: "/learn" },
    { label: "Partners", href: "/partners" }
  ],

  // Footer Configuration
  footer: {
    legal: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Compliance", href: "/compliance" },
      { label: "Contact", href: "/contact" }
    ],
    cta: {
      headline: "Ready to close a loop?",
      subcopy: "List a feedstock, book a lab run, or pre-buy verified output. Genesis Reloop routes the rest.",
      buttons: [
        { label: "List Feedstock", href: "/onboard/supplier" },
        { label: "Book a Lab", href: "/onboard/lab" },
        { label: "Pre-Buy Product", href: "/onboard/buyer" }
      ]
    }
  },

  // Button Text
  buttons: {
    primary: "Start a Loop",
    secondary: "Talk to Genesis AI",
    supplier: "List Feedstock",
    lab: "Join as Lab",
    buyer: "Pre-Buy Product",
    partner: "Become a Partner"
  },

  // Brand Lexicon
  lexicon: {
    weSay: [
      "loop",
      "chain-of-custody",
      "measured impact",
      "routing",
      "escrow",
      "SRL",
      "GIRM"
    ],
    avoid: [
      "offsets",
      "credits as investments",
      "carbon hype",
      "thought leadership"
    ]
  },

  // Legal Disclaimers
  legal: {
    disclaimer: "Genesis provides marketplace, routing, and verification software. We do not provide medical, legal, tax, or investment advice. GIRM Credits are utility impact records tied to specific projects and do not represent ownership or a claim on cashflows.",
    safety: "Operators must follow site-specific safety protocols and applicable regulations. High-risk materials require prior approval."
  }
} as const;

// Page-specific content
export const pageContent = {
  home: {
    hero: {
      pretitle: "DAO-governed marketplace",
      title: "From waste to revenue. From entropy to industry.",
      subtitle: "Genesis Reloop matches waste feedstocks with certified labs and guaranteed buyers—verifiable, bankable, and local-first.",
      primaryCta: { label: "Start a Loop", href: "/how-it-works" },
      secondaryCta: { label: "Talk to Genesis AI", href: "/learn" }
    },
    valueProps: [
      {
        title: "Automated Routing",
        body: "Upload a feedstock spec; Reloop routes it to the optimal process and buyer using real-time capacity, logistics, and price signals.",
        icon: "route"
      },
      {
        title: "Verified Chain-of-Custody",
        body: "Every handoff is signed. Sampling, yields, and product specs are logged to an auditable ledger—no green theater.",
        icon: "shield"
      },
      {
        title: "Guaranteed Offtake",
        body: "Pre-purchase agreements and escrow reduce risk. If a node fails, the DAO re-routes to keep the loop alive.",
        icon: "contract"
      },
      {
        title: "GIRM Credits",
        body: "Issue impact credits backed by measured material conversions and energy balances—not narratives.",
        icon: "metric"
      }
    ],
    proof: {
      title: "Built for ruthless execution",
      bullets: [
        "UK/EU supplier–lab–buyer network with verified processes",
        "Standardized material passports & SDS integration",
        "DAO dispute resolution and collateralized escrow",
        "API for ERPs, MRFs, and municipal datasets"
      ]
    },
    segments: [
      {
        title: "For Suppliers",
        body: "Turn disposal costs into revenue. Upload composition and volume; get instant routing and pricing.",
        cta: { label: "List Feedstock", href: "/onboard/supplier" }
      },
      {
        title: "For Labs & Operators",
        body: "Keep reactors full. Receive pre-qualified feedstocks, QC workflows, and guaranteed offtake.",
        cta: { label: "Join as Lab", href: "/onboard/lab" }
      },
      {
        title: "For Buyers",
        body: "Procure recycled oils, monomers, biochemicals, and materials with documented specs and delivery SLAs.",
        cta: { label: "Pre-Buy Product", href: "/onboard/buyer" }
      },
      {
        title: "For Municipalities",
        body: "Divert landfill streams into local industry. Transparent performance, local jobs, and budget relief.",
        cta: { label: "Partner with Genesis", href: "/partners" }
      }
    ],
    socialProof: {
      kpiHeadline: "Measured, not promised",
      kpis: [
        { label: "Verified loops live", value: "—" },
        { label: "Avg. yield uplift", value: "—" },
        { label: "Days from listing to sale", value: "—" },
        { label: "tCO₂e avoided (audited)", value: "—" }
      ],
      note: "KPIs update in real time as loops execute."
    }
  },

  howItWorks: {
    hero: {
      title: "How Genesis Reloop Works",
      subtitle: "Three-sided marketplace. One purpose: close loops."
    },
    steps: [
      {
        step: "01",
        title: "List the feedstock",
        body: "Suppliers upload material passports: composition, contaminants, moisture, volume, frequency, location. NDA support available."
      },
      {
        step: "02",
        title: "Match & simulate",
        body: "Reloop simulates viable processes and yields, ranks labs by capacity, distance, price, and compliance."
      },
      {
        step: "03",
        title: "Lock offtake & escrow",
        body: "Buyers pre-commit to spec windows. Funds escrow. DAO rules enforce delivery, quality, and dispute resolution."
      },
      {
        step: "04",
        title: "Process & verify",
        body: "Labs process the feedstock. Sampling, QC, and metrology are logged. Chain-of-custody immutably recorded."
      },
      {
        step: "05",
        title: "Deliver, settle, and issue GIRM",
        body: "Products ship. Payments settle from escrow. Measured impact issues as GIRM Credits for audited reporting."
      }
    ],
    callout: {
      title: "No speculation. Just execution.",
      body: "Every loop is tied to physical flows, real invoices, and verifiable data. If a step fails, the DAO re-routes."
    }
  },

  supplyChains: {
    hero: {
      title: "Operational Supply Chains",
      subtitle: "From plastics and textiles to wastewater and organics. Pick a loop and execute."
    },
    intro: "Each listing includes inputs, outputs, CAPEX/OPEX ranges, skills, and SRL (self-regenerative loop) effects. All chains run with verified chain-of-custody and lab QC.",
    categories: [
      { title: "Plastics to Monomers/Oils", body: "PET depolymerization, polyolefin pyrolysis, PU glycolysis." },
      { title: "Food & Ag Waste", body: "Anaerobic digestion, PHA from sludge, enzymes & nutraceuticals." },
      { title: "Textiles", body: "Cotton to glucose, polyester to monomers." },
      { title: "Wastewater & Sludge", body: "Struvite, MCCAs, biogas with carbon diversion." },
      { title: "C&D Waste", body: "RCA aggregates, gypsum, geopolymers." },
      { title: "E-waste", body: "Black mass metals, indium, rare earth magnets." }
    ]
  },

  governance: {
    hero: {
      title: "Governance: DGO (Decentralized Governance Operator)",
      subtitle: "Rules that keep loops alive, fair, and fast."
    },
    pillars: [
      { title: "Escrow & Collateral", body: "All high-value transactions clear through escrow. Operators post collateral to accept jobs." },
      { title: "Quality & Disputes", body: "Sampling protocols, third-party QC, and rapid, binding dispute paths." },
      { title: "Routing & Redundancy", body: "If a node fails, automated re-routing triggers to protect delivery and cashflow." },
      { title: "Open Accounting", body: "Treasury, fees, and credit issuance are transparent and auditable." }
    ]
  },

  girm: {
    hero: {
      title: "GIRM Credits",
      subtitle: "Measured impact per verified loop."
    },
    explainer: [
      { title: "What is GIRM?", body: "Genesis Impact & Resource Metrics. Credits backed by measured material conversions, yields, and energy balances within a loop. No double counting." },
      { title: "How it's issued", body: "On delivery, metrology data finalizes. Credits mint to the loop account with a public record of inputs→outputs and QA." },
      { title: "Use cases", body: "Procurement reporting, ESG with proof, municipal diversion targets, contract performance." }
    ],
    disclaimer: "GIRM Credits are utility impact records, not financial securities. They represent measured physical conversions tied to specific projects."
  }
} as const;
