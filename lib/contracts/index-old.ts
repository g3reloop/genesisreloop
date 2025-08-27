// Re-export Web3Service from web3-service.ts
export { Web3Service } from './web3-service'
export type { Web3Config } from './web3-service'

import { ethers, id } from 'ethers'
import { Web3Service } from './web3-service'
import EscrowVaultABI from './abis/EscrowVault.json'
import AMMPoolABI from './abis/AMMPool.json'
import InsurancePolicyABI from './abis/InsurancePolicy.json'
import DAOParamsABI from './abis/DAOParams.json'

// Contract addresses from environment
const CONTRACTS = {
  EscrowVault: process.env.NEXT_PUBLIC_ESCROW_VAULT_ADDRESS || '',
  AMMPoolCarbonUSDC: process.env.NEXT_PUBLIC_AMM_POOL_CARBON_USDC_ADDRESS || '',
  AMMPoolUCOUSDC: process.env.NEXT_PUBLIC_AMM_POOL_UCO_USDC_ADDRESS || '',
  InsurancePolicy: process.env.NEXT_PUBLIC_INSURANCE_POLICY_ADDRESS || '',
  DAOParams: process.env.NEXT_PUBLIC_DAO_PARAMS_ADDRESS || '',
  CarbonToken: process.env.NEXT_PUBLIC_CARBON_TOKEN_ADDRESS || '',
  UCOToken: process.env.NEXT_PUBLIC_UCO_TOKEN_ADDRESS || '',
}

// Chain configuration
const CHAIN_CONFIG = {
  137: {
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_POLYGON || 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  1: {
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_ETHEREUM || 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
}

export class Web3Service {
  private provider: JsonRpcProvider | null = null
  private signer: ethers.Signer | null = null
  private chainId: number = 137 // Default to Polygon

  constructor() {
    this.initializeProvider()
  }

  private initializeProvider() {
    const config = CHAIN_CONFIG[this.chainId]
    this.provider = new JsonRpcProvider(config.rpcUrl)
  }

  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Web3 wallet detected')
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      
      this.signer = provider.getSigner()
      const address = await this.signer.getAddress()
      
      // Check network
      const network = await provider.getNetwork()
      if (network.chainId !== this.chainId) {
        await this.switchNetwork(this.chainId)
      }

      return address
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error}`)
    }
  }

  async switchNetwork(chainId: number) {
    if (!window.ethereum) throw new Error('No Web3 wallet detected')

    const hexChainId = '0x' + chainId.toString(16)
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        const config = CHAIN_CONFIG[chainId]
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: hexChainId,
            chainName: config.name,
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: [config.blockExplorer],
            nativeCurrency: config.nativeCurrency,
          }],
        })
      } else {
        throw switchError
      }
    }
  }

  // Contract instances
  getEscrowVault(signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
    return new ethers.Contract(
      CONTRACTS.EscrowVault,
      EscrowVaultABI,
      signerOrProvider || this.provider!
    )
  }

  getAMMPool(poolAddress: string, signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
    return new ethers.Contract(
      poolAddress,
      AMMPoolABI,
      signerOrProvider || this.provider!
    )
  }

  getInsurancePolicy(signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
    return new ethers.Contract(
      CONTRACTS.InsurancePolicy,
      InsurancePolicyABI,
      signerOrProvider || this.provider!
    )
  }

  getDAOParams(signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
    return new ethers.Contract(
      CONTRACTS.DAOParams,
      DAOParamsABI,
      signerOrProvider || this.provider!
    )
  }

  // Utility functions
  async getBlockNumber(): Promise<number> {
    if (!this.provider) throw new Error('Provider not initialized')
    return this.provider.getBlockNumber()
  }

  async getGasPrice(): Promise<ethers.BigNumber> {
    if (!this.provider) throw new Error('Provider not initialized')
    return this.provider.getGasPrice()
  }

  async estimateGas(transaction: ethers.providers.TransactionRequest): Promise<ethers.BigNumber> {
    if (!this.provider) throw new Error('Provider not initialized')
    return this.provider.estimateGas(transaction)
  }

  // Format utilities
  formatEther(value: ethers.BigNumberish): string {
    return ethers.utils.formatEther(value)
  }

  parseEther(value: string): ethers.BigNumber {
    return ethers.utils.parseEther(value)
  }

  formatUnits(value: ethers.BigNumberish, decimals: number): string {
    return ethers.utils.formatUnits(value, decimals)
  }

  parseUnits(value: string, decimals: number): ethers.BigNumber {
    return ethers.utils.parseUnits(value, decimals)
  }
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
      assetType: 0 | 1 | 2 // ERC20 | ERC721 | ERC1155
      deadline: number
      termsHash: string
    }
  ) {
    const escrow = web3Service.getEscrowVault(web3Service.signer!)
    
    const tx = await escrow.createEscrow(
      params.beneficiary,
      params.token,
      params.tokenId,
      params.assetType === 0 ? web3Service.parseEther(params.amount) : params.amount,
      params.assetType,
      params.deadline,
      params.termsHash
    )
    
    const receipt = await tx.wait()
    const event = receipt.events?.find((e: any) => e.event === 'EscrowCreated')
    
    return {
      escrowId: event?.args?.escrowId.toString(),
      txHash: receipt.transactionHash,
    }
  },

  async depositToEscrow(web3Service: Web3Service, escrowId: string) {
    const escrow = web3Service.getEscrowVault(web3Service.signer!)
    const tx = await escrow.deposit(escrowId)
    return tx.wait()
  },

  async releaseEscrow(web3Service: Web3Service, escrowId: string) {
    const escrow = web3Service.getEscrowVault(web3Service.signer!)
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
    const pool = web3Service.getAMMPool(poolAddress, web3Service.signer!)
    
    const tx = await pool.addLiquidity(
      web3Service.parseEther(params.amountA),
      web3Service.parseEther(params.amountB),
      web3Service.parseEther(params.minLpOut),
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
    const pool = web3Service.getAMMPool(poolAddress, web3Service.signer!)
    
    const tx = await pool.swapExactTokens(
      params.tokenIn,
      web3Service.parseEther(params.amountIn),
      web3Service.parseEther(params.minOut),
      params.to
    )
    
    return tx.wait()
  },

  async getReserves(web3Service: Web3Service, poolAddress: string) {
    const pool = web3Service.getAMMPool(poolAddress)
    const [reserveA, reserveB, timestamp] = await pool.getReserves()
    
    return {
      reserveA: web3Service.formatEther(reserveA),
      reserveB: web3Service.formatEther(reserveB),
      timestamp: timestamp.toNumber(),
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
    const insurance = web3Service.getInsurancePolicy()
    const quote = await insurance.quote(batchId, riskHash)
    
    return {
      batchId: quote.batchId,
      premium: web3Service.formatEther(quote.premium),
      coverage: web3Service.formatEther(quote.coverage),
      expiry: new Date(quote.expiry.toNumber() * 1000),
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
    const insurance = web3Service.getInsurancePolicy(web3Service.signer!)
    
    const tx = await insurance.bindPolicy(
      params.batchId,
      web3Service.parseEther(params.premiumMax),
      params.holder,
      { value: web3Service.parseEther(params.premium) }
    )
    
    const receipt = await tx.wait()
    const event = receipt.events?.find((e: any) => e.event === 'PolicyBound')
    
    return {
      policyId: event?.args?.policyId.toString(),
      txHash: receipt.transactionHash,
    }
  },

  async submitClaim(
    web3Service: Web3Service,
    policyId: string,
    reasonHash: string
  ) {
    const insurance = web3Service.getInsurancePolicy(web3Service.signer!)
    const tx = await insurance.submitClaim(policyId, reasonHash)
    return tx.wait()
  },
}

// DAO parameter helpers
export const DAOHelpers = {
  async getParam(web3Service: Web3Service, key: string): Promise<string> {
    const dao = web3Service.getDAOParams()
    const value = await dao.getParam(ethers.utils.id(key))
    return value.toString()
  },

  async getAddress(web3Service: Web3Service, key: string): Promise<string> {
    const dao = web3Service.getDAOParams()
    return dao.getAddress(ethers.utils.id(key))
  },

  async setParam(
    web3Service: Web3Service,
    key: string,
    value: string
  ) {
    const dao = web3Service.getDAOParams(web3Service.signer!)
    const tx = await dao.setParam(ethers.utils.id(key), value)
    return tx.wait()
  },
}

// Export singleton instance
export const web3Service = new Web3Service()

// Export types
export type { Web3Service }

// Export constants
export { CONTRACTS, CHAIN_CONFIG }
