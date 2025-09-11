// Re-export everything from web3-service.ts
export { Web3Service, web3Service } from './web3-service'
export type { Web3Config } from './web3-service'

import { ethers, id, parseEther, formatEther } from 'ethers'
import { Web3Service } from './web3-service'

// Contract addresses
export const CONTRACTS = {
  EscrowVault: process.env.NEXT_PUBLIC_ESCROW_VAULT_ADDRESS || '',
  AMMPoolCarbonUSDC: process.env.NEXT_PUBLIC_AMM_POOL_CARBON_USDC_ADDRESS || '',
  AMMPoolUCOUSDC: process.env.NEXT_PUBLIC_AMM_POOL_UCO_USDC_ADDRESS || '',
  InsurancePolicy: process.env.NEXT_PUBLIC_INSURANCE_POLICY_ADDRESS || '',
  DAOParams: process.env.NEXT_PUBLIC_DAO_PARAMS_ADDRESS || '',
  CarbonToken: process.env.NEXT_PUBLIC_CARBON_TOKEN_ADDRESS || '',
  UCOToken: process.env.NEXT_PUBLIC_UCO_TOKEN_ADDRESS || '',
}

// Escrow helper functions
export const EscrowHelpers = {
  async createEscrow(
    web3Service: Web3Service,
    params: {
      beneficiary: string
      token: string
      tokenId: number
      amount: string
      assetType: 0 | 1 | 2
      deadline: number
      termsHash: string
    }
  ) {
    const escrow = await web3Service.getEscrowVault()
    const tx = await escrow.createEscrow(
      params.beneficiary,
      params.token,
      params.tokenId,
      params.assetType === 0 ? parseEther(params.amount) : params.amount,
      params.assetType,
      params.deadline,
      params.termsHash
    )
    
    const receipt = await tx.wait()
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = escrow.interface.parseLog(log)
        return parsed.name === 'EscrowCreated'
      } catch {
        return false
      }
    })
    
    return {
      escrowId: event ? escrow.interface.parseLog(event).args.escrowId.toString() : null,
      txHash: receipt.hash,
    }
  },

  async depositToEscrow(web3Service: Web3Service, escrowId: string) {
    const escrow = await web3Service.getEscrowVault()
    const tx = await escrow.deposit(escrowId)
    return tx.wait()
  },

  async releaseEscrow(web3Service: Web3Service, escrowId: string) {
    const escrow = await web3Service.getEscrowVault()
    const tx = await escrow.release(escrowId)
    return tx.wait()
  },
}

// AMM helper functions
export const AMMHelpers = {
  async addLiquidity(
    web3Service: Web3Service,
    poolAddress: string,
    params: {
      amountA: string
      amountB: string
      minLpOut: string
      to: string
    }
  ) {
    const pool = await web3Service.getAMMPool(poolAddress)
    const tx = await pool.addLiquidity(
      parseEther(params.amountA),
      parseEther(params.amountB),
      parseEther(params.minLpOut),
      params.to
    )
    
    return tx.wait()
  },

  async swap(
    web3Service: Web3Service,
    poolAddress: string,
    params: {
      tokenIn: string
      amountIn: string
      minOut: string
      to: string
    }
  ) {
    const pool = await web3Service.getAMMPool(poolAddress)
    const tx = await pool.swapExactTokens(
      params.tokenIn,
      parseEther(params.amountIn),
      parseEther(params.minOut),
      params.to
    )
    
    return tx.wait()
  },

  async getReserves(web3Service: Web3Service, poolAddress: string) {
    const pool = await web3Service.getAMMPool(poolAddress)
    const [reserveA, reserveB, timestamp] = await pool.getReserves()
    
    return {
      reserveA: formatEther(reserveA),
      reserveB: formatEther(reserveB),
      timestamp: Number(timestamp),
    }
  },
}

// Insurance helper functions
export const InsuranceHelpers = {
  async getQuote(
    web3Service: Web3Service,
    batchId: string,
    riskHash: string
  ) {
    const insurance = await web3Service.getInsurancePolicy()
    const quote = await insurance.quote(batchId, riskHash)
    
    return {
      batchId: quote.batchId,
      premium: formatEther(quote.premium),
      coverage: formatEther(quote.coverage),
      expiry: new Date(Number(quote.expiry) * 1000),
      riskHash: quote.riskHash,
    }
  },

  async bindPolicy(
    web3Service: Web3Service,
    params: {
      batchId: string
      premiumMax: string
      holder: string
      premium: string
    }
  ) {
    const insurance = await web3Service.getInsurancePolicy()
    const tx = await insurance.bindPolicy(
      params.batchId,
      parseEther(params.premiumMax),
      params.holder,
      { value: parseEther(params.premium) }
    )
    
    const receipt = await tx.wait()
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = insurance.interface.parseLog(log)
        return parsed.name === 'PolicyBound'
      } catch {
        return false
      }
    })
    
    return {
      policyId: event ? insurance.interface.parseLog(event).args.policyId.toString() : null,
      txHash: receipt.hash,
    }
  },

  async submitClaim(
    web3Service: Web3Service,
    policyId: string,
    reasonHash: string
  ) {
    const insurance = await web3Service.getInsurancePolicy()
    const tx = await insurance.submitClaim(policyId, reasonHash)
    return tx.wait()
  },
}

// DAO parameter helpers
export const DAOHelpers = {
  async getParam(web3Service: Web3Service, key: string): Promise<string> {
    const dao = await web3Service.getDAOParams()
    const value = await dao.getParam(id(key))
    return value.toString()
  },

  async getAddress(web3Service: Web3Service, key: string): Promise<string> {
    const dao = await web3Service.getDAOParams()
    const address = await dao.addresses(id(key))
    return address
  },

  async setParam(
    web3Service: Web3Service,
    key: string,
    value: string
  ) {
    const dao = await web3Service.getDAOParams()
    const tx = await dao.setParam(id(key), value)
    return tx.wait()
  },
}
