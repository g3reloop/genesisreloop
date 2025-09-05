'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { JsonRpcProvider } from 'ethers'
import { web3Service, Web3Service } from '@/lib/contracts/web3-service'

interface Web3ContextType {
  web3: Web3Service
  account: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const Web3Context = createContext<Web3ContextType | null>(null)

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if ethereum provider exists
    if (!window.ethereum) {
      console.warn('No Web3 wallet detected. Web3 features will be disabled.')
      return
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null)
      } else {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16))
      // Do not automatically reload - let the app handle chain changes gracefully
    }

    try {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        })
        .catch((err) => {
          console.warn('Failed to get accounts:', err)
        })

      // Get current chain
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          setChainId(parseInt(chainId, 16))
        })
        .catch((err) => {
          console.warn('Failed to get chain ID:', err)
        })
    } catch (error) {
      console.error('Error setting up Web3 listeners:', error)
    }

    return () => {
      if (window.ethereum) {
        try {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const address = await web3Service.connectWallet()
      setAccount(address)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    // Note: Can't actually disconnect from MetaMask programmatically
    // User must disconnect manually from their wallet
  }, [])

  const switchChain = useCallback(async (newChainId: number) => {
    try {
      await web3Service.switchNetwork(newChainId)
      setChainId(newChainId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network')
    }
  }, [])

  return (
    <Web3Context.Provider 
      value={{
        web3: web3Service,
        account,
        chainId,
        isConnecting,
        error,
        connect,
        disconnect,
        switchChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider')
  }
  return context
}

// Hook for escrow operations
export const useEscrow = () => {
  const { web3, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEscrow = useCallback(async (params: {
    beneficiary: string
    token: string
    tokenId: number
    amount: string
    assetType: 0 | 1 | 2
    deadline: number
    termsHash: string
  }) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { EscrowHelpers } = await import('@/lib/contracts')
      const result = await EscrowHelpers.createEscrow(web3, params)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create escrow')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  const depositToEscrow = useCallback(async (escrowId: string) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { EscrowHelpers } = await import('@/lib/contracts')
      const result = await EscrowHelpers.depositToEscrow(web3, escrowId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  const releaseEscrow = useCallback(async (escrowId: string) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { EscrowHelpers } = await import('@/lib/contracts')
      const result = await EscrowHelpers.releaseEscrow(web3, escrowId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to release')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  return {
    createEscrow,
    depositToEscrow,
    releaseEscrow,
    isLoading,
    error,
  }
}

// Hook for AMM operations
export const useAMM = (poolAddress: string) => {
  const { web3, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reserves, setReserves] = useState<{
    reserveA: string
    reserveB: string
    timestamp: number
  } | null>(null)

  // Fetch reserves
  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const { AMMHelpers } = await import('@/lib/contracts')
        const res = await AMMHelpers.getReserves(web3, poolAddress)
        setReserves(res)
      } catch (err) {
        console.error('Failed to fetch reserves:', err)
      }
    }

    if (poolAddress) {
      fetchReserves()
      const interval = setInterval(fetchReserves, 15000) // Update every 15s
      return () => clearInterval(interval)
    }
  }, [web3, poolAddress])

  const addLiquidity = useCallback(async (params: {
    amountA: string
    amountB: string
    minLpOut: string
  }) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { AMMHelpers } = await import('@/lib/contracts')
      const result = await AMMHelpers.addLiquidity(web3, poolAddress, {
        ...params,
        to: account,
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add liquidity')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account, poolAddress])

  const swap = useCallback(async (params: {
    tokenIn: string
    amountIn: string
    minOut: string
  }) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { AMMHelpers } = await import('@/lib/contracts')
      const result = await AMMHelpers.swap(web3, poolAddress, {
        ...params,
        to: account,
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to swap')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account, poolAddress])

  return {
    reserves,
    addLiquidity,
    swap,
    isLoading,
    error,
  }
}

// Hook for insurance operations
export const useInsurance = () => {
  const { web3, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getQuote = useCallback(async (batchId: string, riskHash: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { InsuranceHelpers } = await import('@/lib/contracts')
      const quote = await InsuranceHelpers.getQuote(web3, batchId, riskHash)
      return quote
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3])

  const bindPolicy = useCallback(async (params: {
    batchId: string
    premiumMax: string
    premium: string
  }) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { InsuranceHelpers } = await import('@/lib/contracts')
      const result = await InsuranceHelpers.bindPolicy(web3, {
        ...params,
        holder: account,
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bind policy')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  const submitClaim = useCallback(async (policyId: string, reasonHash: string) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { InsuranceHelpers } = await import('@/lib/contracts')
      const result = await InsuranceHelpers.submitClaim(web3, policyId, reasonHash)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  return {
    getQuote,
    bindPolicy,
    submitClaim,
    isLoading,
    error,
  }
}

// Hook for DAO parameters
export const useDAO = () => {
  const { web3, account } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getParam = useCallback(async (key: string) => {
    try {
      const { DAOHelpers } = await import('@/lib/contracts')
      return await DAOHelpers.getParam(web3, key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get parameter')
      throw err
    }
  }, [web3])

  const getAddress = useCallback(async (key: string) => {
    try {
      const { DAOHelpers } = await import('@/lib/contracts')
      return await DAOHelpers.getAddress(web3, key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get address')
      throw err
    }
  }, [web3])

  const setParam = useCallback(async (key: string, value: string) => {
    if (!account) throw new Error('Wallet not connected')
    
    setIsLoading(true)
    setError(null)

    try {
      const { DAOHelpers } = await import('@/lib/contracts')
      const result = await DAOHelpers.setParam(web3, key, value)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set parameter')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [web3, account])

  return {
    getParam,
    getAddress,
    setParam,
    isLoading,
    error,
  }
}

// Hook for transaction monitoring
export const useTransaction = () => {
  const [txHash, setTxHash] = useState<string | null>(null)
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | null>(null)
  const [confirmations, setConfirmations] = useState(0)

  const monitor = useCallback((hash: string) => {
    setTxHash(hash)
    setStatus('pending')
    setConfirmations(0)

    const checkStatus = async () => {
      try {
        const provider = new JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL_POLYGON || 'https://polygon-rpc.com'
        )
        
        const receipt = await provider.waitForTransaction(hash, 1)
        
        if (receipt && receipt.status === 1) {
          setStatus('success')
        } else {
          setStatus('failed')
        }

        // Monitor confirmations
        const checkConfirmations = async () => {
          const currentBlock = await provider.getBlockNumber()
          const confirms = currentBlock - (receipt?.blockNumber || 0)
          setConfirmations(confirms)
          
          if (confirms < 12) {
            setTimeout(checkConfirmations, 15000) // Check every 15s
          }
        }
        
        if (receipt) {
          checkConfirmations()
        }
      } catch (err) {
        setStatus('failed')
      }
    }

    checkStatus()
  }, [])

  return {
    txHash,
    status,
    confirmations,
    monitor,
  }
}
