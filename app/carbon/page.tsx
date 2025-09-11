'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import {
  Leaf,
  TrendingUp,
  Shield,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Unlock,
  Activity,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

// Mock carbon credit data
const mockCredits = [
  {
    id: '1',
    tokenId: 'RLC-2024-001',
    batchCode: 'UCO-2024-001',
    co2Avoided: 2.5,
    status: 'verified',
    verificationId: 'VER-ABC123',
    srlRatio: 100,
    vintage: '2024',
    price: 45.50,
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123',
    metadata: {
      methodology: 'UCO-to-Biodiesel',
      geo: 'London, UK',
      verifierSig: '0xabc...'
    }
  },
  {
    id: '2',
    tokenId: 'RLC-2024-002',
    batchCode: 'FW-2024-002',
    co2Avoided: 3.8,
    status: 'listed',
    verificationId: 'VER-DEF456',
    srlRatio: 85,
    vintage: '2024',
    price: 52.00,
    owner: '0x892d35Cc6634C0532925a3b844Bc9e7595f6E456',
    metadata: {
      methodology: 'Food-Waste-to-Biogas',
      geo: 'Manchester, UK',
      verifierSig: '0xdef...'
    }
  },
  {
    id: '3',
    tokenId: 'RLC-2024-003',
    batchCode: 'UCO-2024-003',
    co2Avoided: 1.2,
    status: 'retired',
    verificationId: 'VER-GHI789',
    srlRatio: 75,
    vintage: '2024',
    price: 38.25,
    owner: '0x392d35Cc6634C0532925a3b844Bc9e7595f6E789',
    metadata: {
      methodology: 'UCO-to-Biodiesel',
      geo: 'Birmingham, UK',
      verifierSig: '0xghi...'
    }
  }
]

// Mock market data
const mockMarketData = {
  totalSupply: 15234.5,
  totalRetired: 8456.2,
  currentPrice: 48.75,
  priceChange24h: 3.2,
  volume24h: 125000,
  marketCap: 742830.75
}

// Mock liquidity pool data
const mockLiquidityPool = {
  poolId: 'POOL-CARBON-USDC',
  reserves: {
    carbon: 5000,
    usdc: 243750
  },
  apy: 12.5,
  fees24h: 1829.50,
  instantBuy: 49.85,
  instantSell: 47.65,
  forwardPrices: {
    '7d': 50.25,
    '30d': 52.10,
    '90d': 55.40
  }
}

const statusColors = {
  verified: { bg: 'bg-mythic-secondary-100 dark:bg-mythic-secondary-900/20', text: 'text-mythic-secondary-700 dark:text-mythic-secondary-400', icon: CheckCircle2 },
  listed: { bg: 'bg-mythic-primary-100 dark:bg-mythic-primary-900/20', text: 'text-mythic-primary-700 dark:text-mythic-primary-400', icon: Unlock },
  retired: { bg: 'bg-mythic-dark-100 dark:bg-mythic-dark-800', text: 'text-mythic-dark-700 dark:text-mythic-dark-400', icon: Lock },
  traded: { bg: 'bg-mythic-accent-100 dark:bg-mythic-accent-900/20', text: 'text-mythic-accent-700 dark:text-mythic-accent-400', icon: ArrowUpRight }
}

export default function CarbonCreditPage() {
  const [selectedTab, setSelectedTab] = useState<'credits' | 'market' | 'verify'>('credits')
  const [zkProofVisible, setZkProofVisible] = useState(false)
  const [auditTrail, setAuditTrail] = useState<any>(null)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      mockMarketData.currentPrice += (Math.random() - 0.5) * 0.5
      mockMarketData.priceChange24h += (Math.random() - 0.5) * 0.1
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const handleVerifyCredit = async (creditId: string) => {
    // Simulate ZK proof verification
    setZkProofVisible(true)
    
    // Simulate fetching audit trail
    setTimeout(() => {
      setAuditTrail({
        merkleRoot: '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123abc',
        ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        zkProofs: {
          quality: { verified: true, proofSystem: 'groth16' },
          custody: { verified: true, proofSystem: 'plonk' },
          credit: { verified: true, proofSystem: 'groth16' }
        },
        timestamp: new Date().toISOString()
      })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Credits that carry their own evidence.</h1>
          <p className="text-mythic-dark-500 dark:text-mythic-dark-400">
            Every credit carries a GIRM proof and an anchor. Mint, trade, or retire credits.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-mythic-secondary-500" />
          <span className="text-sm font-medium">DAO-signed</span>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-mythic-dark-500">Current Price</p>
              <TrendingUp className={cn(
                "h-4 w-4",
                mockMarketData.priceChange24h > 0 ? "text-mythic-secondary-500" : "text-red-500"
              )} />
            </div>
            <p className="text-2xl font-bold">£{mockMarketData.currentPrice.toFixed(2)}</p>
            <p className={cn(
              "text-xs",
              mockMarketData.priceChange24h > 0 ? "text-mythic-secondary-500" : "text-red-500"
            )}>
              {mockMarketData.priceChange24h > 0 ? '+' : ''}{mockMarketData.priceChange24h.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-mythic-dark-500">Total Supply</p>
            <p className="text-2xl font-bold">{mockMarketData.totalSupply.toLocaleString()}</p>
            <p className="text-xs text-mythic-dark-400">tCO₂</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-mythic-dark-500">Total Retired</p>
            <p className="text-2xl font-bold">{mockMarketData.totalRetired.toLocaleString()}</p>
            <p className="text-xs text-mythic-dark-400">tCO₂</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-mythic-dark-500">24h Volume</p>
            <p className="text-2xl font-bold">£{(mockMarketData.volume24h / 1000).toFixed(1)}K</p>
            <p className="text-xs text-mythic-dark-400">+12.5%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-mythic-dark-500">Market Cap</p>
            <p className="text-2xl font-bold">£{(mockMarketData.marketCap / 1000).toFixed(1)}K</p>
            <p className="text-xs text-mythic-dark-400">Rank #42</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-mythic-dark-500">Pool APY</p>
            <p className="text-2xl font-bold">{mockLiquidityPool.apy}%</p>
            <p className="text-xs text-mythic-secondary-500">+£{mockLiquidityPool.fees24h.toFixed(0)} fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-mythic-dark-100 dark:bg-mythic-dark-900 p-1 rounded-lg w-fit">
        {(['credits', 'market', 'verify'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "px-4 py-2 rounded-md transition-all duration-200 capitalize",
              selectedTab === tab
                ? "bg-white dark:bg-mythic-dark-800 shadow-sm"
                : "hover:bg-mythic-dark-50 dark:hover:bg-mythic-dark-800"
            )}
          >
            {tab === 'credits' ? 'Credits' : tab === 'market' ? 'Trade' : 'Audit'}
          </button>
        ))}
      </div>

      {/* Credits Tab */}
      {selectedTab === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCredits.map(credit => {
            const status = statusColors[credit.status as keyof typeof statusColors]
            const StatusIcon = status.icon
            
            return (
              <Card key={credit.id} className="overflow-hidden">
                <div className={cn(
                  "h-1 w-full",
                  credit.srlRatio >= 85 ? "bg-mythic-loop-srl" : "bg-mythic-accent-500"
                )} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-mythic-secondary-500" />
                        {credit.tokenId}
                      </CardTitle>
                      <CardDescription>Batch: {credit.batchCode}</CardDescription>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center",
                      status.bg,
                      status.text
                    )}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {credit.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-mythic-dark-500 dark:text-mythic-dark-400">CO₂ Avoided</p>
                      <p className="font-semibold">{credit.co2Avoided} tCO₂</p>
                    </div>
                    <div>
                      <p className="text-mythic-dark-500 dark:text-mythic-dark-400">SRL Ratio</p>
                      <p className="font-semibold">{credit.srlRatio}%</p>
                    </div>
                    <div>
                      <p className="text-mythic-dark-500 dark:text-mythic-dark-400">Price</p>
                      <p className="font-semibold">£{credit.price}/tCO₂</p>
                    </div>
                    <div>
                      <p className="text-mythic-dark-500 dark:text-mythic-dark-400">Vintage</p>
                      <p className="font-semibold">{credit.vintage}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t flex items-center justify-between">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleVerifyCredit(credit.id)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    {credit.status === 'listed' && (
                      <Button size="sm" variant="secondary">
                        <Coins className="h-4 w-4 mr-1" />
                        Trade
                      </Button>
                    )}
                    {credit.status === 'verified' && (
                      <Button size="sm" variant="primary">
                        List for Sale
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Market Tab */}
      {selectedTab === 'market' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AMM Pool */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Community Pool</CardTitle>
              <CardDescription>Route credits through the stabilized pool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Deploy Credits</h4>
                  <div className="p-4 rounded-lg bg-mythic-secondary-50 dark:bg-mythic-secondary-900/20 border border-mythic-secondary-200 dark:border-mythic-secondary-800">
                    <p className="text-3xl font-bold text-mythic-secondary-700 dark:text-mythic-secondary-400">
                      £{mockLiquidityPool.instantBuy}
                    </p>
                    <p className="text-sm text-mythic-dark-500">per tCO₂</p>
                  </div>
                  <Button variant="secondary" className="w-full">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Settle Credits</h4>
                  <div className="p-4 rounded-lg bg-mythic-accent-50 dark:bg-mythic-accent-900/20 border border-mythic-accent-200 dark:border-mythic-accent-800">
                    <p className="text-3xl font-bold text-mythic-accent-700 dark:text-mythic-accent-400">
                      £{mockLiquidityPool.instantSell}
                    </p>
                    <p className="text-sm text-mythic-dark-500">per tCO₂</p>
                  </div>
                  <Button variant="accent" className="w-full">
                    <ArrowDownRight className="h-4 w-4 mr-2" />
                    Settle
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Forward Prices</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-mythic-dark-500">7 Day</p>
                    <p className="font-semibold">£{mockLiquidityPool.forwardPrices['7d']}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-mythic-dark-500">30 Day</p>
                    <p className="font-semibold">£{mockLiquidityPool.forwardPrices['30d']}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-mythic-dark-500">90 Day</p>
                    <p className="font-semibold">£{mockLiquidityPool.forwardPrices['90d']}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pool Reserves</span>
                  <Activity className="h-4 w-4 text-mythic-primary-500" />
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Carbon Credits</span>
                    <span className="font-medium">{mockLiquidityPool.reserves.carbon.toLocaleString()} tCO₂</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>USDC</span>
                    <span className="font-medium">${mockLiquidityPool.reserves.usdc.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pool Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Pool Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-mythic-primary-50 dark:bg-mythic-primary-900/20">
                <p className="text-sm text-mythic-dark-500">Total Value Locked</p>
                <p className="text-2xl font-bold">£{((mockLiquidityPool.reserves.carbon * mockLiquidityPool.instantBuy + mockLiquidityPool.reserves.usdc) / 1000).toFixed(1)}K</p>
              </div>
              
              <div>
                <p className="text-sm text-mythic-dark-500">24h Fees Generated</p>
                <p className="text-xl font-semibold">£{mockLiquidityPool.fees24h.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-mythic-dark-500">Current APY</p>
                <p className="text-xl font-semibold text-mythic-secondary-500">{mockLiquidityPool.apy}%</p>
              </div>
              
              <Button variant="primary" className="w-full" glow>
                Add Liquidity
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verify & Audit Tab */}
      {selectedTab === 'verify' && (
        <div className="space-y-6">
          {zkProofVisible && auditTrail && (
            <Card className="border-mythic-secondary-200 dark:border-mythic-secondary-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>GIRM Proof Verification</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-mythic-secondary-500" />
                </div>
                <CardDescription>Anchored proofs for every credit in the loop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-mythic-dark-50 dark:bg-mythic-dark-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-mythic-secondary-500" />
                      Material Proof
                    </h4>
                    <p className="text-xs text-mythic-dark-500 mb-1">System: {auditTrail.zkProofs.quality.proofSystem}</p>
                    <p className="text-xs font-mono truncate">Anchored: UCO purity ≥ 75%</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-mythic-dark-50 dark:bg-mythic-dark-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-mythic-primary-500" />
                      Chain Proof
                    </h4>
                    <p className="text-xs text-mythic-dark-500 mb-1">System: {auditTrail.zkProofs.custody.proofSystem}</p>
                    <p className="text-xs font-mono truncate">Anchored: Zero gaps in custody</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-mythic-dark-50 dark:bg-mythic-dark-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-mythic-accent-500" />
                      Impact Proof
                    </h4>
                    <p className="text-xs text-mythic-dark-500 mb-1">System: {auditTrail.zkProofs.credit.proofSystem}</p>
                    <p className="text-xs font-mono truncate">Anchored: 2.5 tCO₂ avoided</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Community Anchor</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-mythic-dark-500">Root Hash</span>
                      <span className="font-mono text-xs">{auditTrail.merkleRoot.substring(0, 16)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-mythic-dark-500">IPFS Anchor</span>
                      <span className="font-mono text-xs">{auditTrail.ipfsHash.substring(0, 16)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-mythic-dark-500">Node Timestamp</span>
                      <span className="text-xs">{new Date(auditTrail.timestamp).toLocaleString('en-GB')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Audit Proof
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Lock className="h-4 w-4 mr-1" />
                    Node Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Audit Tools</CardTitle>
              <CardDescription>Audit any credit{`'`}s GIRM proof and anchors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-mythic-dark-200 dark:border-mythic-dark-800">
                <label className="text-sm font-medium mb-2 block">Token ID or Anchor Hash</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-md border border-mythic-dark-200 dark:border-mythic-dark-700 bg-white dark:bg-mythic-dark-900"
                    placeholder="RLC-2024-001 or 0xabc123..."
                  />
                  <Button variant="primary">
                    <Shield className="h-4 w-4 mr-2" />
                    Audit
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-mythic-primary-50 dark:bg-mythic-primary-900/20">
                  <h4 className="font-medium mb-2">Node Security</h4>
                  <ul className="space-y-1 text-sm text-mythic-dark-600 dark:text-mythic-dark-400">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      Quantum-resistant anchors
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      Hardware attestation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      Community key binding
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      DAO-signed deployments
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-mythic-accent-50 dark:bg-mythic-accent-900/20">
                  <h4 className="font-medium mb-2">Protocol Standards</h4>
                  <ul className="space-y-1 text-sm text-mythic-dark-600 dark:text-mythic-dark-400">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      ETS anchor format
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      VCM proof structure
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      ISCC chain custody
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 text-mythic-secondary-500" />
                      SLSA build provenance
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
