import { useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Wallet, Copy, ExternalLink, LogOut, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  80001: 'Mumbai',
  31337: 'Localhost',
}

export const WalletConnect = () => {
  const { account, chainId, isConnecting, error, connect, disconnect, switchChain } = useWeb3()
  const [isOpen, setIsOpen] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      toast.success('Address copied to clipboard')
    }
  }

  const openExplorer = () => {
    if (account && chainId) {
      const baseUrl = chainId === 1 
        ? 'https://etherscan.io' 
        : chainId === 137 
        ? 'https://polygonscan.com'
        : 'https://mumbai.polygonscan.com'
      window.open(`${baseUrl}/address/${account}`, '_blank')
    }
  }

  if (!account) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        variant="default"
        className="btn-connect-wallet gap-2 whitespace-nowrap"
        data-test="connect-wallet"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="font-mono text-ellipsis overflow-hidden">{formatAddress(account)}</span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Connected</span>
            <Badge variant="secondary" className="text-xs">
              {chainId && CHAIN_NAMES[chainId] || 'Unknown'}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Network
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => switchChain(1)} 
          disabled={chainId === 1}
          className="cursor-pointer"
        >
          Ethereum Mainnet
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => switchChain(137)} 
          disabled={chainId === 137}
          className="cursor-pointer"
        >
          Polygon
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={disconnect} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Transaction status component
export const TransactionStatus = ({ 
  hash, 
  status, 
  confirmations 
}: { 
  hash: string | null
  status: 'pending' | 'success' | 'failed' | null
  confirmations: number 
}) => {
  const { chainId } = useWeb3()

  if (!hash || !status) return null

  const getExplorerUrl = () => {
    const baseUrl = chainId === 1 
      ? 'https://etherscan.io' 
      : chainId === 137 
      ? 'https://polygonscan.com'
      : 'https://mumbai.polygonscan.com'
    return `${baseUrl}/tx/${hash}`
  }

  return (
    <div className={`
      rounded-lg border p-4 
      ${status === 'pending' ? 'border-yellow-500 bg-yellow-50' : ''}
      ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
      ${status === 'failed' ? 'border-red-500 bg-red-50' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Transaction {status === 'pending' ? 'Pending' : status === 'success' ? 'Confirmed' : 'Failed'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {status === 'success' && confirmations > 0 && (
              <span>{confirmations} confirmation{confirmations !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(getExplorerUrl(), '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
