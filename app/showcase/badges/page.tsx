'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoopBadge, GirmBadge, DaoBadge } from '@/components/ui/badges'

export default function BadgeShowcasePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Genesis Badge System
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Visual indicators for loop types, GIRM proofs, and DAO status
        </p>
      </div>

      <div className="space-y-8">
        {/* Loop Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Loop Type Badges</CardTitle>
            <CardDescription>
              Identify Stabilized Recursive Loops (SRL) and Corporate Recursive Loops (CRL)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Sizes</h4>
              <div className="flex items-center gap-3">
                <LoopBadge type="SRL" size="sm" />
                <LoopBadge type="SRL" size="md" />
                <LoopBadge type="SRL" size="lg" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Types</h4>
              <div className="flex items-center gap-3">
                <LoopBadge type="SRL" />
                <LoopBadge type="CRL" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GIRM Badges */}
        <Card>
          <CardHeader>
            <CardTitle>GIRM Proof Badges</CardTitle>
            <CardDescription>
              Show verification status of Governance, Identity, Risk, and Material proofs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Statuses</h4>
              <div className="flex items-center gap-3 flex-wrap">
                <GirmBadge status="verified" />
                <GirmBadge status="anchored" />
                <GirmBadge status="pending" />
                <GirmBadge status="failed" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Sizes</h4>
              <div className="flex items-center gap-3">
                <GirmBadge status="verified" size="sm" />
                <GirmBadge status="verified" size="md" />
                <GirmBadge status="verified" size="lg" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Without Icons</h4>
              <div className="flex items-center gap-3">
                <GirmBadge status="verified" showIcon={false} />
                <GirmBadge status="anchored" showIcon={false} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DAO Badges */}
        <Card>
          <CardHeader>
            <CardTitle>DAO Status Badges</CardTitle>
            <CardDescription>
              Display DAO participation and governance status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Statuses</h4>
              <div className="flex items-center gap-3">
                <DaoBadge status="signed" />
                <DaoBadge status="voting" />
                <DaoBadge status="member" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Sizes</h4>
              <div className="flex items-center gap-3">
                <DaoBadge status="signed" size="sm" />
                <DaoBadge status="signed" size="md" />
                <DaoBadge status="signed" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              How badges are used in context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">UCO-2024-001</h3>
                  <p className="text-sm text-gray-400">Community Kitchen Co-op</p>
                </div>
                <div className="flex items-center gap-2">
                  <LoopBadge type="SRL" />
                  <GirmBadge status="anchored" size="sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Quantity</p>
                  <p className="font-medium">450 kg</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <DaoBadge status="signed" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
