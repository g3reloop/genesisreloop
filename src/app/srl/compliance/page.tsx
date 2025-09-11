'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { NuisanceEvent, ComplianceStatus, AlertRule } from '@/types/srl-domain'

// Mock IoT data generator for demo
const generateMockSensorData = () => ({
  odour: { 
    value: Math.random() * 50 + 10, 
    threshold: 45, 
    unit: 'ppm' as const 
  },
  noise: { 
    value: Math.random() * 20 + 60, 
    threshold: 75, 
    unit: 'dB' as const 
  },
  particulates: { 
    value: Math.random() * 30 + 5, 
    threshold: 25, 
    unit: 'mg/m3' as const 
  }
})

export default function OperationsComplianceDashboard() {
  const [facilityId] = useState('facility-001')
  const [complianceData, setComplianceData] = useState<ComplianceStatus>({
    facilityId,
    timestamp: new Date().toISOString(),
    nuisanceLevels: generateMockSensorData(),
    activeAlerts: [],
    openCases: [],
    complianceScore: 95
  })
  
  const [alerts, setAlerts] = useState<AlertRule[]>([])
  const [nuisanceEvents, setNuisanceEvents] = useState<NuisanceEvent[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulate real-time IoT data updates
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      const newData = generateMockSensorData()
      const timestamp = new Date().toISOString()
      
      // Check for threshold breaches
      const newAlerts: AlertRule[] = []
      const newEvents: NuisanceEvent[] = []
      
      if (newData.odour.value > newData.odour.threshold) {
        newAlerts.push({
          ruleId: `alert-${Date.now()}-odour`,
          name: 'Odour Threshold Breach',
          description: `Odour levels at ${newData.odour.value.toFixed(1)} ppm exceeded threshold`,
          condition: {
            type: 'threshold_breach',
            parameters: { sensor: 'odour', threshold: newData.odour.threshold }
          },
          action: {
            type: 'notify',
            recipients: ['ops-team', 'facility-manager'],
            message: 'Immediate action required to reduce odour emissions'
          }
        })
        
        newEvents.push({
          eventId: `event-${Date.now()}-odour`,
          facilityId,
          sensorId: 'odour-sensor-01',
          timestamp,
          dataType: 'odour_ppm',
          value: newData.odour.value,
          threshold: newData.odour.threshold,
          duration_seconds: 60
        })
      }
      
      if (newData.noise.value > newData.noise.threshold) {
        newAlerts.push({
          ruleId: `alert-${Date.now()}-noise`,
          name: 'Noise Level Exceedance',
          description: `Noise at ${newData.noise.value.toFixed(1)} dB exceeded community threshold`,
          condition: {
            type: 'threshold_breach',
            parameters: { sensor: 'noise', threshold: newData.noise.threshold }
          },
          action: {
            type: 'notify',
            recipients: ['ops-team'],
            message: 'Review equipment operation and implement noise reduction measures'
          }
        })
      }
      
      // Update state
      setComplianceData(prev => ({
        ...prev,
        timestamp,
        nuisanceLevels: newData,
        activeAlerts: [...newAlerts, ...prev.activeAlerts].slice(0, 10),
        complianceScore: Math.max(0, prev.complianceScore - newAlerts.length * 2)
      }))
      
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20))
      setNuisanceEvents(prev => [...newEvents, ...prev].slice(0, 50))
      
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [autoRefresh, facilityId])

  const getSensorStatus = (value: number, threshold: number) => {
    const ratio = value / threshold
    if (ratio < 0.7) return { color: 'text-green-400', bg: 'bg-green-500/20', status: 'Normal' }
    if (ratio < 0.9) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', status: 'Warning' }
    return { color: 'text-red-400', bg: 'bg-red-500/20', status: 'Critical' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-mythic-primary mb-2">
                Operations Compliance Dashboard
              </h1>
              <p className="text-white/70">
                Facility: <span className="font-mono text-mythic-secondary">{facilityId}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={autoRefresh ? 'primary' : 'ghost'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-sm"
              >
                {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
              </Button>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                complianceData.complianceScore >= 90 
                  ? 'bg-green-500/20 text-green-400' 
                  : complianceData.complianceScore >= 70
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                Compliance Score: {complianceData.complianceScore}%
              </div>
            </div>
          </div>

          {/* Real-time Sensor Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Odour Monitoring */}
            <div className="bg-black/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Odour Level</h3>
                  <p className="text-sm text-white/60">Electronic Nose Sensor</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  getSensorStatus(complianceData.nuisanceLevels.odour.value, complianceData.nuisanceLevels.odour.threshold).bg
                } ${getSensorStatus(complianceData.nuisanceLevels.odour.value, complianceData.nuisanceLevels.odour.threshold).color}`}>
                  {getSensorStatus(complianceData.nuisanceLevels.odour.value, complianceData.nuisanceLevels.odour.threshold).status}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-white">
                  {complianceData.nuisanceLevels.odour.value.toFixed(1)} 
                  <span className="text-lg font-normal text-white/60 ml-1">ppm</span>
                </div>
                <div className="text-sm text-white/60">
                  Threshold: {complianceData.nuisanceLevels.odour.threshold} ppm
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    complianceData.nuisanceLevels.odour.value > complianceData.nuisanceLevels.odour.threshold
                      ? 'bg-red-500'
                      : 'bg-mythic-primary'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (complianceData.nuisanceLevels.odour.value / complianceData.nuisanceLevels.odour.threshold) * 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Noise Monitoring */}
            <div className="bg-black/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-sm text-white/60">Sound Level Meter</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  getSensorStatus(complianceData.nuisanceLevels.noise.value, complianceData.nuisanceLevels.noise.threshold).bg
                } ${getSensorStatus(complianceData.nuisanceLevels.noise.value, complianceData.nuisanceLevels.noise.threshold).color}`}>
                  {getSensorStatus(complianceData.nuisanceLevels.noise.value, complianceData.nuisanceLevels.noise.threshold).status}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-white">
                  {complianceData.nuisanceLevels.noise.value.toFixed(1)} 
                  <span className="text-lg font-normal text-white/60 ml-1">dB</span>
                </div>
                <div className="text-sm text-white/60">
                  Threshold: {complianceData.nuisanceLevels.noise.threshold} dB
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    complianceData.nuisanceLevels.noise.value > complianceData.nuisanceLevels.noise.threshold
                      ? 'bg-red-500'
                      : 'bg-mythic-primary'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (complianceData.nuisanceLevels.noise.value / complianceData.nuisanceLevels.noise.threshold) * 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Particulate Monitoring */}
            <div className="bg-black/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Particulates</h3>
                  <p className="text-sm text-white/60">PM2.5/PM10 Sensor</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  getSensorStatus(complianceData.nuisanceLevels.particulates.value, complianceData.nuisanceLevels.particulates.threshold).bg
                } ${getSensorStatus(complianceData.nuisanceLevels.particulates.value, complianceData.nuisanceLevels.particulates.threshold).color}`}>
                  {getSensorStatus(complianceData.nuisanceLevels.particulates.value, complianceData.nuisanceLevels.particulates.threshold).status}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-white">
                  {complianceData.nuisanceLevels.particulates.value.toFixed(1)} 
                  <span className="text-lg font-normal text-white/60 ml-1">mg/m³</span>
                </div>
                <div className="text-sm text-white/60">
                  Threshold: {complianceData.nuisanceLevels.particulates.threshold} mg/m³
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    complianceData.nuisanceLevels.particulates.value > complianceData.nuisanceLevels.particulates.threshold
                      ? 'bg-red-500'
                      : 'bg-mythic-primary'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (complianceData.nuisanceLevels.particulates.value / complianceData.nuisanceLevels.particulates.threshold) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-black/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
              <span className="text-sm text-white/60">
                Last updated: {new Date(complianceData.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No active alerts - all systems operating within parameters
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div 
                    key={alert.ruleId} 
                    className="bg-white/5 rounded-lg p-4 border border-red-500/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-red-400">{alert.name}</h3>
                      <span className="text-xs text-white/60">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 mb-2">{alert.description}</p>
                    <p className="text-sm text-yellow-400">{alert.action.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nuisance Event History */}
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20">
          <h2 className="text-xl font-bold text-white mb-6">Nuisance Event History</h2>
          
          {nuisanceEvents.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No nuisance events recorded in the selected time range
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Value</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Threshold</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {nuisanceEvents.map((event) => (
                    <tr key={event.eventId} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm text-white/80">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="text-red-400 font-medium">
                          {event.dataType.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/80">
                        {event.value.toFixed(1)} {
                          event.dataType.includes('odour') ? 'ppm' :
                          event.dataType.includes('noise') ? 'dB' :
                          'mg/m³'
                        }
                      </td>
                      <td className="py-3 px-4 text-sm text-white/60">
                        {event.threshold}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/60">
                        {event.duration_seconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
