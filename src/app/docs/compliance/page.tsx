'use client'

import { motion } from 'framer-motion'
import { FileText, Shield, Truck, Factory, Users, CheckCircle, AlertCircle, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const complianceDocs = {
  shared: {
    title: "Shared Compliance (All Parties)",
    icon: Users,
    color: "mythic-primary-500",
    docs: [
      { 
        name: "Master Compliance Overview",
        file: "biogas_biodiesel_compliance_uk_eu.docx",
        description: "Complete regulatory framework for biogas & biodiesel operations"
      },
      {
        name: "Duty of Care & Waste Classification",
        file: "duty_of_care_waste_classification_pack.docx",
        description: "Legal obligations for waste handling and classification"
      },
      {
        name: "Transport & ADR Compliance",
        file: "transport_and_adr_compliance_for_used_cooking_oil_and_biodiesel.docx",
        description: "Safe transport regulations for UCO and biodiesel"
      },
      {
        name: "Sustainability & Certification Guide",
        file: "biodiesel_sustainability_certification_guide_rtfo_red_ii_iii_iscc.docx",
        description: "RTFO, RED II-III, and ISCC certification requirements"
      },
      {
        name: "Environmental Monitoring Plan",
        file: "environmental_monitoring_and_reporting_plan.docx",
        description: "Environmental compliance and reporting procedures"
      },
      {
        name: "Supplier Onboarding Kit",
        file: "genesis_reloop_supplier_onboarding_kit_food_waste_uco.docx",
        description: "Complete onboarding process for waste suppliers"
      }
    ]
  },
  biogas: {
    title: "Food Waste → Biogas",
    icon: Factory,
    color: "mythic-accent-300",
    docs: [
      {
        name: "AD Permit & Operations Dossier",
        file: "food_waste_biogas_permit_operations_dossier.docx",
        description: "Anaerobic digestion facility permits and operational requirements"
      },
      {
        name: "Digestate Quality Manual",
        file: "digestate_compliance_pas_110_quality_manual.docx",
        description: "PAS 110 compliance for digestate quality assurance"
      },
      {
        name: "Grid/Utilisation Compliance",
        file: "ad_facility_grid_utilisation_compliance_chp_electricity_biomethane.docx",
        description: "Compliance for CHP, electricity generation, and biomethane injection"
      },
      {
        name: "Biogas Operations Overview",
        file: "biogas_operations_compliance_document_outline.docx",
        description: "Operational compliance framework for biogas facilities"
      }
    ]
  },
  biodiesel: {
    title: "UCO → Biodiesel",
    icon: Truck,
    color: "flow-credits",
    docs: [
      {
        name: "Processor Permit & Safety Dossier",
        file: "uco_biodiesel_processor_permit_and_safety_dossier.docx",
        description: "Processing facility permits and safety requirements"
      },
      {
        name: "Fuel Quality Standards (EN 14214)",
        file: "fuel_quality_product_conformity_pack_en_14214.docx",
        description: "Biodiesel quality standards and testing requirements"
      },
      {
        name: "Regulatory Compliance Pack",
        file: "genesis_reloop_regulatory_compliance_pack.docx",
        description: "Complete regulatory framework for biodiesel operations"
      }
    ]
  }
}

export default function ComplianceDocs() {
  const [selectedCategory, setSelectedCategory] = useState<'shared' | 'biogas' | 'biodiesel'>('shared')

  const handleDownload = (filename: string) => {
    // Create download link
    const link = document.createElement('a')
    link.href = `/compliance/${filename}`
    link.download = filename
    link.click()
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Compliance Documentation
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            UK & EU regulatory compliance for waste-to-energy operations. 
            Real documents. No greenwash. Full transparency.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {Object.entries(complianceDocs).map(([key, category]) => {
            const Icon = category.icon
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as keyof typeof complianceDocs)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                  selectedCategory === key
                    ? `bg-${category.color}/20 border-2 border-${category.color} text-white`
                    : 'bg-mythic-dark-900/50 border-2 border-mythic-primary-500/20 text-mythic-text-muted hover:text-mythic-text-primary hover:border-mythic-primary-500/40'
                }`}
              >
                <Icon className={`h-6 w-6 ${selectedCategory === key ? `text-${category.color}` : ''}`} />
                <span className="font-semibold">{category.title}</span>
                <span className="text-sm opacity-70">({category.docs.length})</span>
              </button>
            )
          })}
        </motion.div>

        {/* Document Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {complianceDocs[selectedCategory].docs.map((doc, idx) => (
            <motion.div
              key={doc.file}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass rounded-xl p-6 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-${complianceDocs[selectedCategory].color}/10`}>
                  <FileText className={`h-6 w-6 text-${complianceDocs[selectedCategory].color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-mythic-text-primary mb-1 group-hover:text-mythic-primary-500 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-mythic-text-muted">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleDownload(doc.file)}
                  className="flex items-center gap-2 text-sm text-mythic-primary-500 hover:text-mythic-primary-400 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <Link
                  href={`/docs/compliance/${selectedCategory}/${doc.file.replace('.docx', '')}`}
                  className="flex items-center gap-2 text-sm text-mythic-accent-300 hover:text-mythic-accent-200 transition-colors"
                >
                  View Online
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-mythic-primary-500/10">
                <Shield className="h-6 w-6 text-mythic-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-mythic-primary-500 mb-2">Compliance First</h3>
                <p className="text-mythic-text-muted mb-4">
                  All Genesis Reloop operations follow UK & EU regulations. These documents represent
                  our commitment to safety, sustainability, and legal compliance. No shortcuts.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-mythic-primary-500" />
                    <span className="text-sm text-mythic-text-muted">EA/SEPA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-mythic-primary-500" />
                    <span className="text-sm text-mythic-text-muted">RTFO Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-mythic-primary-500" />
                    <span className="text-sm text-mythic-text-muted">PAS 110 Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/docs"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mythic-dark-900/50 border border-mythic-primary-500/20 text-mythic-text-muted hover:text-mythic-text-primary hover:border-mythic-primary-500/40 transition-all"
          >
            <FileText className="h-4 w-4" />
            Back to Docs
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mythic-dark-900/50 border border-mythic-primary-500/20 text-mythic-text-muted hover:text-mythic-text-primary hover:border-mythic-primary-500/40 transition-all"
          >
            <AlertCircle className="h-4 w-4" />
            Compliance Questions?
          </Link>
          <Link
            href="/join"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mythic-primary-500/20 border border-mythic-primary-500 text-mythic-primary-500 hover:bg-mythic-primary-500/30 transition-all"
          >
            <Shield className="h-4 w-4" />
            Join Network
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
