// Chain of Custody types and utilities for SRL (Short Renewable Loops)

export interface ChainOfCustodyRecord {
  id: string
  assetId: string
  timestamp: Date
  location: {
    lat: number
    lng: number
    address?: string
  }
  handler: {
    id: string
    name: string
    role: 'supplier' | 'collector' | 'processor' | 'buyer'
  }
  action: 'created' | 'collected' | 'transported' | 'processed' | 'delivered'
  quantity: number
  unit: 'kg' | 'liters'
  signature?: string
  metadata?: Record<string, any>
}

export interface Asset {
  id: string
  type: 'uco' | 'food-waste' | 'plastics' | 'organics'
  srlClassification: 'srl' | 'crl' // Short Renewable Loop vs Contaminated Renewable Loop
  status: 'pending' | 'in-transit' | 'processed' | 'completed'
  currentHandler: string
  quantity: number
  unit: 'kg' | 'liters'
  createdAt: Date
  updatedAt: Date
  chainOfCustody: ChainOfCustodyRecord[]
}

export function createChainOfCustodyRecord(
  assetId: string,
  handler: ChainOfCustodyRecord['handler'],
  action: ChainOfCustodyRecord['action'],
  location: ChainOfCustodyRecord['location'],
  quantity: number,
  unit: ChainOfCustodyRecord['unit']
): ChainOfCustodyRecord {
  return {
    id: `coc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    assetId,
    timestamp: new Date(),
    location,
    handler,
    action,
    quantity,
    unit
  }
}

export function validateChainOfCustody(records: ChainOfCustodyRecord[]): boolean {
  if (records.length === 0) return false
  
  // Check chronological order
  for (let i = 1; i < records.length; i++) {
    if (records[i].timestamp < records[i - 1].timestamp) {
      return false
    }
  }
  
  // Check first record is 'created'
  if (records[0].action !== 'created') return false
  
  // TODO: Add more validation rules
  
  return true
}

export function calculateTotalQuantity(records: ChainOfCustodyRecord[]): number {
  return records.reduce((total, record) => {
    if (record.action === 'created') {
      return total + record.quantity
    }
    return total
  }, 0)
}
