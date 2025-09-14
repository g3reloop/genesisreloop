'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { LoopNode, LoopFlow } from '@/lib/types'
import { createBrowserClient } from '@supabase/ssr'

// Define the loop network structure
const loopNodes: LoopNode[] = [
  { id: 'supplier_node', type: 'feedstock_supplier', agents: ['FeedstockMatcher', 'TraceBot'], loopState: 'SRL' },
  { id: 'micro_collection_node', type: 'collector', agents: ['RouteGen', 'TraceBot'], loopState: 'SRL' },
  { id: 'processor_node', type: 'processor', agents: ['TraceBot', 'ByproductMatcher', 'CarbonVerifier', 'ComplianceClerk'], loopState: 'SRL' },
  { id: 'secondary_product_node', type: 'byproduct_market', agents: ['ByproductMatcher', 'BuyerDiscoveryBot'], loopState: 'SRL' },
  { id: 'carbon_credit_node', type: 'carbon_ledger', agents: ['CarbonVerifier'], loopState: 'SRL' },
  { id: 'reputation_node', type: 'trust_score', agents: ['ReputationBot'], loopState: 'SRL' },
  { id: 'consumer_portal_node', type: 'dashboard', agents: ['ConsumerPortalBot'], loopState: 'SRL' },
]

const loopFlows: LoopFlow[] = [
  { from: 'supplier_node', to: 'micro_collection_node', description: 'Feedstock pickup', color: 'var(--flow-feedstock)' },
  { from: 'micro_collection_node', to: 'processor_node', description: 'Delivery to processor', color: 'var(--flow-feedstock)' },
  { from: 'processor_node', to: 'secondary_product_node', description: 'Byproducts created', color: 'var(--flow-byproduct)' },
  { from: 'processor_node', to: 'carbon_credit_node', description: 'Credits generated', color: 'var(--flow-credits)' },
  { from: 'processor_node', to: 'reputation_node', description: 'Trust updated', color: 'var(--flow-reputation)' },
  { from: 'secondary_product_node', to: 'supplier_node', description: 'Market feedback', color: 'var(--flow-byproduct)' },
  { from: 'reputation_node', to: 'supplier_node', description: 'Trust feedback', color: 'var(--flow-reputation)' },
]

interface RealTimeFlow {
  id: string
  fromType: string
  toType: string
  volume: number
  timestamp: string
}

export function LoopVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [realTimeFlows, setRealTimeFlows] = useState<RealTimeFlow[]>([])
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Load real-time transaction data
  useEffect(() => {
    loadRealTimeData()
    
    // Set up real-time subscription
    const channel = supabase.channel('loop-visualization')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions' },
        (payload) => {
          // Add new flow when transaction is created
          if (payload.new.status === 'completed') {
            loadRealTimeData()
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  const loadRealTimeData = async () => {
    try {
      // Get recent completed transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select(`
          id,
          quantity,
          created_at,
          listings (
            category,
            seller_id,
            profiles!seller_id (
              role
            )
          ),
          profiles!buyer_id (
            role
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (transactions) {
        const flows: RealTimeFlow[] = transactions.map(t => ({
          id: t.id,
          fromType: t.listings?.profiles?.role === 'supplier' ? 'feedstock_supplier' : 'collector',
          toType: t.profiles?.role === 'processor' ? 'processor' : 'byproduct_market',
          volume: t.quantity || 0,
          timestamp: t.created_at
        }))
        
        setRealTimeFlows(flows)
      }
    } catch (error) {
      console.error('Error loading real-time data:', error)
    }
  }

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 600
    const centerX = width / 2
    const centerY = height / 2
    const radius = 200

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    // Create gradient definitions
    const defs = svg.append('defs')

    // Create gradients for each flow type
    const gradientColors = {
      feedstock: ['#3b82f6', '#60a5fa'],
      byproduct: ['#f97316', '#fb923c'],
      credits: ['#facc15', '#fde047'],
      reputation: ['#a855f7', '#c084fc'],
    }

    Object.entries(gradientColors).forEach(([key, [start, end]]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${key}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%')

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', start)
        .attr('stop-opacity', 0.8)

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', end)
        .attr('stop-opacity', 0.8)
    })

    // Position nodes in a circle
    loopNodes.forEach((node, i) => {
      const angle = (i / loopNodes.length) * 2 * Math.PI - Math.PI / 2
      node.x = centerX + radius * Math.cos(angle)
      node.y = centerY + radius * Math.sin(angle)
    })

    // Create flow paths
    const flowGroup = svg.append('g').attr('class', 'flows')

    loopFlows.forEach((flow, i) => {
      const source = loopNodes.find(n => n.id === flow.from)
      const target = loopNodes.find(n => n.id === flow.to)
      
      if (!source || !target) return

      // Create curved path
      const dx = target.x! - source.x!
      const dy = target.y! - source.y!
      const dr = Math.sqrt(dx * dx + dy * dy) * 0.7

      const path = flowGroup.append('path')
        .attr('d', `M${source.x},${source.y} A${dr},${dr} 0 0,1 ${target.x},${target.y}`)
        .attr('fill', 'none')
        .attr('stroke', flow.color || '#94a3b8')
        .attr('stroke-width', 2)
        .attr('opacity', 0.6)
        .attr('class', 'flow-animation')
        .style('stroke-dasharray', '10,5')

      // Animate the flow
      path.append('animate')
        .attr('attributeName', 'stroke-dashoffset')
        .attr('from', '0')
        .attr('to', '-15')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite')
    })

    // Create node groups
    const nodeGroup = svg.append('g').attr('class', 'nodes')

    const nodes = nodeGroup.selectAll('.node')
      .data(loopNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d.id)
        setActiveAgents(d.agents)
      })
      .on('mouseleave', () => {
        setHoveredNode(null)
        setActiveAgents([])
      })

    // Add node circles
    nodes.append('circle')
      .attr('r', 30)
      .attr('fill', d => {
        if (d.loopState === 'SRL') return 'var(--loop-srl)'
        if (d.loopState === 'CRL') return 'var(--loop-crl)'
        return 'var(--loop-unknown)'
      })
      .attr('fill-opacity', 0.2)
      .attr('stroke', d => {
        if (d.loopState === 'SRL') return 'var(--loop-srl)'
        if (d.loopState === 'CRL') return 'var(--loop-crl)'
        return 'var(--loop-unknown)'
      })
      .attr('stroke-width', 2)
      .transition()
      .duration(1000)
      .attr('fill-opacity', 0.3)

    // Add icons based on node type
    const iconMap: Record<string, string> = {
      feedstock_supplier: '🏭',
      collector: '🚚',
      processor: '⚙️',
      byproduct_market: '🛍️',
      carbon_ledger: '🌱',
      trust_score: '⭐',
      dashboard: '📊',
    }

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '20px')
      .text(d => iconMap[d.type] || '❓')

    // Add labels
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '50px')
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.8)
      .text(d => d.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))

    // Add pulsing animation to active nodes
    nodes.selectAll('circle')
      .filter((d: any) => d.agents.some((agent: string) => activeAgents.includes(agent)))
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '30;35;30')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite')

    // Show real transaction activity
    const showRealActivity = () => {
      realTimeFlows.forEach((flow, index) => {
        setTimeout(() => {
          const sourceNode = loopNodes.find(n => n.type === flow.fromType)
          const targetNode = loopNodes.find(n => n.type === flow.toType)
          
          if (sourceNode && targetNode) {
            // Create particle for real flow
            const particle = nodeGroup.append('circle')
              .attr('cx', sourceNode.x!)
              .attr('cy', sourceNode.y!)
              .attr('r', Math.min(15, Math.max(5, flow.volume / 50)))
              .attr('fill', 'var(--mythic-primary-500)')
              .attr('opacity', 0.8)

            // Animate particle along path
            particle.transition()
              .duration(2000)
              .ease(d3.easeCubicInOut)
              .attr('cx', targetNode.x!)
              .attr('cy', targetNode.y!)
              .transition()
              .duration(300)
              .attr('r', 30)
              .attr('opacity', 0)
              .remove()
            
            // Show volume text
            const volumeText = nodeGroup.append('text')
              .attr('x', sourceNode.x!)
              .attr('y', sourceNode.y! - 40)
              .attr('text-anchor', 'middle')
              .attr('font-size', '14px')
              .attr('fill', 'var(--mythic-primary-500)')
              .attr('font-weight', 'bold')
              .text(`${flow.volume} kg`)
              .attr('opacity', 0)
              
            volumeText.transition()
              .duration(300)
              .attr('opacity', 1)
              .transition()
              .delay(1700)
              .duration(300)
              .attr('opacity', 0)
              .remove()
          }
        }, index * 1000)
      })
    }

    // Show real activity on data change
    if (realTimeFlows.length > 0) {
      showRealActivity()
    }
    
    // Periodically replay recent transactions
    const activityInterval = setInterval(() => {
      if (realTimeFlows.length > 0) {
        showRealActivity()
      }
    }, 10000)

    return () => {
      clearInterval(activityInterval)
    }
  }, [activeAgents, realTimeFlows])

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-mythic-dark-50/50 to-mythic-dark-100/50 dark:from-mythic-dark-900/50 dark:to-mythic-dark-950/50 rounded-xl overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Agent Activity Panel */}
      {activeAgents.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-mythic-dark-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Active Agents</h3>
          <ul className="space-y-1">
            {activeAgents.map(agent => (
              <li key={agent} className="text-xs flex items-center">
                <div className="w-2 h-2 bg-mythic-secondary-500 rounded-full mr-2 animate-pulse" />
                {agent}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-mythic-dark-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-mythic-loop-srl rounded-full mr-1" />
              <span>SRL Loop</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-mythic-loop-crl rounded-full mr-1" />
              <span>CRL Loop</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-mythic-flow-feedstock rounded-full mr-1" />
              <span>Feedstock</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-mythic-flow-credits rounded-full mr-1" />
              <span>Credits</span>
            </div>
          </div>
          {realTimeFlows.length > 0 && (
            <div className="text-xs text-mythic-text-muted border-t pt-2">
              Live: {realTimeFlows.length} recent transactions
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
