import { 
  ethers, 
  JsonRpcProvider, 
  BrowserProvider, 
  Contract, 
  parseEther as _parseEther, 
  formatEther as _formatEther, 
  parseUnits as _parseUnits, 
  formatUnits as _formatUnits,
  id as hashId 
} from 'ethers'

// Contract addresses from environment
export const CONTRACTS = {
  EscrowVault: process.env.NEXT_PUBLIC_ESCROW_VAULT_ADDRESS || '',
  AMMPoolCarbonUSDC: process.env.NEXT_PUBLIC_AMM_POOL_CARBON_USDC_ADDRESS || '',
  AMMPoolUCOUSDC: process.env.NEXT_PUBLIC_AMM_POOL_UCO_USDC_ADDRESS || '',
  InsurancePolicy: process.env.NEXT_PUBLIC_INSURANCE_POLICY_ADDRESS || '',
  DAOParams: process.env.NEXT_PUBLIC_DAO_PARAMS_ADDRESS || '',
  CarbonToken: process.env.NEXT_PUBLIC_CARBON_TOKEN_ADDRESS || '',
  UCOToken: process.env.NEXT_PUBLIC_UCO_TOKEN_ADDRESS || '',
}

// Chain configuration
export const CHAIN_CONFIG: Record<number, any> = {
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
  public provider: JsonRpcProvider | null = null
  public signer: ethers.Signer | null = null
  private chainId: number = 137 // Default to Polygon

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeProvider()
    }
  }

  private initializeProvider() {
    const config = CHAIN_CONFIG[this.chainId]
    if (config) {
      this.provider = new JsonRpcProvider(config.rpcUrl)
    }
  }

  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.')
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      
      this.signer = await provider.getSigner()
      const address = await this.signer.getAddress()
      
      // Check network
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== this.chainId) {
        await this.switchNetwork(this.chainId)
      }

      return address
    } catch (error: any) {
      if (error.code === -32002) {
        throw new Error('Wallet connection already pending. Please check your wallet.')
      } else if (error.code === 4001) {
        throw new Error('User rejected wallet connection.')
      }
      throw new Error(`Failed to connect wallet: ${error.message || error}`)
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
        if (!config) {
          throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        try {
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
        } catch (addError: any) {
          if (addError.code === 4001) {
            throw new Error('User rejected adding the network')
          }
          throw addError
        }
      } else if (switchError.code === 4001) {
        throw new Error('User rejected switching network')
      } else {
        throw switchError
      }
    }
  }

  // Contract instances
  getContract(address: string, abi: any, signerOrProvider?: ethers.Signer | ethers.Provider) {
    return new Contract(
      address,
      abi,
      signerOrProvider || this.provider!
    )
  }

  // Utility functions
  async getBlockNumber(): Promise<number> {
    if (!this.provider) throw new Error('Provider not initialized')
    return this.provider.getBlockNumber()
  }

  async getGasPrice(): Promise<bigint> {
    if (!this.provider) throw new Error('Provider not initialized')
    const feeData = await this.provider.getFeeData()
    return feeData.gasPrice || 0n
  }

  // Format utilities
  formatEther(value: bigint | string): string {
    return _formatEther(value)
  }

  parseEther(value: string): bigint {
    return _parseEther(value)
  }

  formatUnits(value: bigint | string, decimals: number): string {
    return _formatUnits(value, decimals)
  }

  parseUnits(value: string, decimals: number): bigint {
    return _parseUnits(value, decimals)
  }

  hashString(value: string): string {
    return hashId(value)
  }
}

// Export singleton instance
export const web3Service = new Web3Service()
