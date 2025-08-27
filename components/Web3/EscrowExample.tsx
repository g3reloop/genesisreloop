'use client'

import { useState } from 'react'
import { useEscrow, useTransaction } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionStatus } from './WalletConnect'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Example component showing escrow creation
export const EscrowExample = () => {
  const { createEscrow, isLoading, error } = useEscrow()
  const { txHash, status, confirmations, monitor } = useTransaction()
  
  const [formData, setFormData] = useState({
    beneficiary: '',
    token: '',
    amount: '',
    assetType: '0' as '0' | '1' | '2',
    deadline: '',
    termsHash: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000)
      
      const result = await createEscrow({
        beneficiary: formData.beneficiary,
        token: formData.token,
        tokenId: 0, // For ERC20
        amount: formData.amount,
        assetType: parseInt(formData.assetType) as 0 | 1 | 2,
        deadline: deadlineTimestamp,
        termsHash: formData.termsHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
      })

      if (result.escrowId) {
        toast.success(`Escrow created! ID: ${result.escrowId}`)
        monitor(result.txHash)
        
        // Reset form
        setFormData({
          beneficiary: '',
          token: '',
          amount: '',
          assetType: '0',
          deadline: '',
          termsHash: '',
        })
      }
    } catch (err) {
      toast.error(error || 'Failed to create escrow')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Escrow</CardTitle>
        <CardDescription>
          Set up a new escrow for tokenized carbon credits or UCO oil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="beneficiary">Beneficiary Address</Label>
            <Input
              id="beneficiary"
              placeholder="0x..."
              value={formData.beneficiary}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, beneficiary: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">Token Address</Label>
            <Input
              id="token"
              placeholder="0x..."
              value={formData.token}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, token: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.0"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={formData.assetType}
                onValueChange={(value: string) => setFormData({ ...formData, assetType: value as '0' | '1' | '2' })}
              >
                <SelectTrigger id="assetType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">ERC20 Token</SelectItem>
                  <SelectItem value="1">ERC721 NFT</SelectItem>
                  <SelectItem value="2">ERC1155 Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termsHash">Terms Hash (Optional)</Label>
            <Input
              id="termsHash"
              placeholder="0x... (IPFS hash of terms)"
              value={formData.termsHash}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, termsHash: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Escrow...' : 'Create Escrow'}
          </Button>
        </form>

        {txHash && (
          <div className="mt-4">
            <TransactionStatus
              hash={txHash}
              status={status}
              confirmations={confirmations}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
