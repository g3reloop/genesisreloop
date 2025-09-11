// Chain of Custody (CoC) Tracking Service
// Implements verifiable, immutable tracking for SRL assets

import { createHash } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { 
  CoCLogEntry, 
  ProcessState, 
  AssetDigitalTwin,
  SensorReading 
} from '@/types/srl-domain'

export class ChainOfCustodyService {
  // In production, this would be backed by blockchain or immutable ledger
  private entries: Map<string, CoCLogEntry> = new Map()
  private assets: Map<string, AssetDigitalTwin> = new Map()
  
  /**
   * Create initial entrustment log entry and digital twin
   */
  async createAssetEntrustment(
    entrustmentAgreementId: string,
    entrustorVOC: string,
    custodianVOC: string,
    evidenceData: any
  ): Promise<AssetDigitalTwin> {
    const assetId = uuidv4()
    const entryId = uuidv4()
    
    // Create initial CoC entry
    const entry: CoCLogEntry = {
      entryId,
      assetId,
      actorVOC: entrustorVOC,
      timestamp: new Date().toISOString(),
      processState: ProcessState.ENTRUSTED,
      evidenceHash: this.hashEvidence(evidenceData),
      notes: 'Initial entrustment'
    }
    
    // Store entry
    this.entries.set(entryId, entry)
    
    // Create digital twin
    const digitalTwin: AssetDigitalTwin = {
      assetId,
      entrustmentAgreementId,
      currentState: ProcessState.ENTRUSTED,
      currentCustodianId: custodianVOC,
      CoCHistory: [entryId]
    }
    
    this.assets.set(assetId, digitalTwin)
    
    // Emit event for real-time updates
    this.emitCoCEvent('asset_created', { assetId, entry })
    
    return digitalTwin
  }
  
  /**
   * Add a new Chain of Custody entry
   */
  async addCoCEntry(
    assetId: string,
    actorVOC: string,
    newState: ProcessState,
    evidenceData: any,
    geolocation?: { lat: number; lon: number },
    notes?: string
  ): Promise<CoCLogEntry> {
    const asset = this.assets.get(assetId)
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`)
    }
    
    // Validate state transition
    this.validateStateTransition(asset.currentState, newState)
    
    const entryId = uuidv4()
    const entry: CoCLogEntry = {
      entryId,
      assetId,
      actorVOC,
      timestamp: new Date().toISOString(),
      geolocation,
      processState: newState,
      notes,
      evidenceHash: this.hashEvidence(evidenceData)
    }
    
    // Store entry
    this.entries.set(entryId, entry)
    
    // Update digital twin
    asset.currentState = newState
    asset.CoCHistory.push(entryId)
    
    // Handle custody changes
    if (this.isCustodyTransfer(newState)) {
      asset.currentCustodianId = actorVOC
    }
    
    // Emit event
    this.emitCoCEvent('entry_added', { assetId, entry })
    
    // Check automated alerts
    await this.checkAlertRules(assetId, entry)
    
    return entry
  }
  
  /**
   * Get complete Chain of Custody for an asset
   */
  async getAssetCoC(assetId: string): Promise<{
    asset: AssetDigitalTwin
    entries: CoCLogEntry[]
  }> {
    const asset = this.assets.get(assetId)
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`)
    }
    
    const entries = asset.CoCHistory
      .map(id => this.entries.get(id))
      .filter((e): e is CoCLogEntry => e !== undefined)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    
    return { asset, entries }
  }
  
  /**
   * Verify integrity of the chain
   */
  async verifyChainIntegrity(assetId: string): Promise<{
    valid: boolean
    issues: string[]
  }> {
    const { asset, entries } = await this.getAssetCoC(assetId)
    const issues: string[] = []
    
    // Check for missing entries
    if (entries.length !== asset.CoCHistory.length) {
      issues.push('Missing entries in chain')
    }
    
    // Check chronological order
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].timestamp < entries[i-1].timestamp) {
        issues.push(`Entry ${entries[i].entryId} has invalid timestamp`)
      }
    }
    
    // Check state transitions
    let expectedState = ProcessState.ENTRUSTED
    for (const entry of entries) {
      if (entry.processState !== expectedState) {
        // Validate if transition is allowed
        try {
          this.validateStateTransition(expectedState, entry.processState)
          expectedState = entry.processState
        } catch {
          issues.push(`Invalid state transition at ${entry.entryId}`)
        }
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    }
  }
  
  /**
   * Add sensor data to evidence
   */
  async addSensorEvidence(
    assetId: string,
    sensorReadings: SensorReading[]
  ): Promise<string> {
    const evidenceId = uuidv4()
    const evidenceHash = this.hashEvidence({
      evidenceId,
      assetId,
      timestamp: new Date().toISOString(),
      sensorReadings
    })
    
    // In production, store to IPFS or similar
    console.log('Storing sensor evidence:', evidenceHash)
    
    return evidenceHash
  }
  
  /**
   * Search CoC entries by criteria
   */
  async searchEntries(criteria: {
    assetId?: string
    actorVOC?: string
    processState?: ProcessState
    dateFrom?: string
    dateTo?: string
  }): Promise<CoCLogEntry[]> {
    let results = Array.from(this.entries.values())
    
    if (criteria.assetId) {
      results = results.filter(e => e.assetId === criteria.assetId)
    }
    if (criteria.actorVOC) {
      results = results.filter(e => e.actorVOC === criteria.actorVOC)
    }
    if (criteria.processState) {
      results = results.filter(e => e.processState === criteria.processState)
    }
    if (criteria.dateFrom) {
      results = results.filter(e => e.timestamp >= criteria.dateFrom)
    }
    if (criteria.dateTo) {
      results = results.filter(e => e.timestamp <= criteria.dateTo)
    }
    
    return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }
  
  /**
   * Generate evidence hash
   */
  private hashEvidence(data: any): string {
    const json = JSON.stringify(data, Object.keys(data).sort())
    return createHash('sha256').update(json).digest('hex')
  }
  
  /**
   * Validate state transitions
   */
  private validateStateTransition(from: ProcessState, to: ProcessState): void {
    const validTransitions: Record<ProcessState, ProcessState[]> = {
      [ProcessState.ENTRUSTED]: [ProcessState.TRANSPORT_PICKUP],
      [ProcessState.TRANSPORT_PICKUP]: [ProcessState.RECEIVED_AT_FACILITY],
      [ProcessState.RECEIVED_AT_FACILITY]: [ProcessState.QA_VERIFIED],
      [ProcessState.QA_VERIFIED]: [ProcessState.SORTED],
      [ProcessState.SORTED]: [ProcessState.PROCESSING_START],
      [ProcessState.PROCESSING_START]: [ProcessState.DIGESTED, ProcessState.PROCESSED],
      [ProcessState.DIGESTED]: [ProcessState.OUTPUT_GENERATED],
      [ProcessState.PROCESSED]: [ProcessState.OUTPUT_GENERATED, ProcessState.DISPOSED],
      [ProcessState.OUTPUT_GENERATED]: [ProcessState.DISPOSED],
      [ProcessState.DISPOSED]: []
    }
    
    const allowed = validTransitions[from] || []
    if (!allowed.includes(to)) {
      throw new Error(`Invalid state transition from ${from} to ${to}`)
    }
  }
  
  /**
   * Check if state change involves custody transfer
   */
  private isCustodyTransfer(state: ProcessState): boolean {
    return [
      ProcessState.TRANSPORT_PICKUP,
      ProcessState.RECEIVED_AT_FACILITY
    ].includes(state)
  }
  
  /**
   * Check automated alert rules
   */
  private async checkAlertRules(assetId: string, entry: CoCLogEntry): Promise<void> {
    // Check for time-based alerts
    const asset = this.assets.get(assetId)
    if (!asset) return
    
    const lastEntry = asset.CoCHistory.length > 1 
      ? this.entries.get(asset.CoCHistory[asset.CoCHistory.length - 2])
      : null
      
    if (lastEntry) {
      const timeDiff = new Date(entry.timestamp).getTime() - new Date(lastEntry.timestamp).getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // Alert if too much time between states
      if (hoursDiff > 24 && lastEntry.processState === ProcessState.TRANSPORT_PICKUP) {
        this.emitCoCEvent('alert', {
          type: 'missing_entry',
          assetId,
          message: 'Transport taking longer than 24 hours'
        })
      }
    }
  }
  
  /**
   * Emit events for real-time updates
   */
  private emitCoCEvent(eventType: string, data: any): void {
    // In production, use WebSocket or SSE
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`coc:${eventType}`, { detail: data }))
    }
  }
  
  /**
   * Export chain for audit
   */
  async exportChainForAudit(assetId: string): Promise<{
    asset: AssetDigitalTwin
    entries: CoCLogEntry[]
    merkleRoot: string
  }> {
    const { asset, entries } = await this.getAssetCoC(assetId)
    
    // Calculate Merkle root for verification
    const hashes = entries.map(e => e.evidenceHash)
    const merkleRoot = this.calculateMerkleRoot(hashes)
    
    return {
      asset,
      entries,
      merkleRoot
    }
  }
  
  /**
   * Simple Merkle root calculation
   */
  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return ''
    if (hashes.length === 1) return hashes[0]
    
    const newLevel: string[] = []
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i]
      const right = hashes[i + 1] || left
      const combined = createHash('sha256')
        .update(left + right)
        .digest('hex')
      newLevel.push(combined)
    }
    
    return this.calculateMerkleRoot(newLevel)
  }
}

// Singleton instance
export const chainOfCustody = new ChainOfCustodyService()
