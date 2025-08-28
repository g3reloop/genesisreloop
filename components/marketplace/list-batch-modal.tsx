'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Info, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface ListBatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ListBatchModal({ isOpen, onClose }: ListBatchModalProps) {
  const [formData, setFormData] = useState({
    batchType: '',
    quantity: '',
    fatContent: '',
    location: '',
    price: '',
    description: '',
    collectionDate: '',
    certificateFile: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.batchType || !formData.quantity || !formData.location || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate API call
    toast.loading('Creating batch listing...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Batch successfully listed! GIRM proof pending verification.')
      onClose()
      
      // Reset form
      setFormData({
        batchType: '',
        quantity: '',
        fatContent: '',
        location: '',
        price: '',
        description: '',
        collectionDate: '',
        certificateFile: null
      })
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] max-h-[80vh] overflow-y-auto bg-mythic-dark-900 rounded-2xl shadow-2xl border-2 border-mythic-primary-500/20 z-[101]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-mythic-dark-900 p-6 border-b border-mythic-primary-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-mythic-text-primary">List SRL Batch</h2>
                  <p className="text-sm text-mythic-text-muted mt-1">
                    Create a new batch listing for the marketplace
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-mythic-dark-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-mythic-text-muted" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Batch Type */}
              <div className="space-y-2">
                <Label htmlFor="batchType" className="text-mythic-text-primary">
                  Batch Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.batchType}
                  onValueChange={(value) => setFormData({ ...formData, batchType: value })}
                >
                  <SelectTrigger className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary">
                    <SelectValue placeholder="Select batch type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UCO">Used Cooking Oil (UCO)</SelectItem>
                    <SelectItem value="FOOD_WASTE">Food Waste</SelectItem>
                    <SelectItem value="ORGANIC_WASTE">Organic Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and Fat Content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-mythic-text-primary">
                    Quantity (kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary placeholder:text-mythic-text-muted"
                  />
                </div>

                {formData.batchType === 'UCO' && (
                  <div className="space-y-2">
                    <Label htmlFor="fatContent" className="text-mythic-text-primary">
                      Fat Content (%)
                    </Label>
                    <Input
                      id="fatContent"
                      name="fatContent"
                      type="number"
                      value={formData.fatContent}
                      onChange={handleInputChange}
                      placeholder="e.g., 85"
                      className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary placeholder:text-mythic-text-muted"
                    />
                  </div>
                )}
              </div>

              {/* Location and Collection Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-mythic-text-primary">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., London"
                    className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary placeholder:text-mythic-text-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectionDate" className="text-mythic-text-primary">
                    Collection Date
                  </Label>
                  <Input
                    id="collectionDate"
                    name="collectionDate"
                    type="date"
                    value={formData.collectionDate}
                    onChange={handleInputChange}
                    className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-mythic-text-primary">
                  Price per kg (£) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.65"
                  className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary placeholder:text-mythic-text-muted"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-mythic-text-primary">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about your batch..."
                  rows={4}
                  className="bg-mythic-dark-800 border-mythic-primary-500/20 text-mythic-text-primary placeholder:text-mythic-text-muted resize-none"
                />
              </div>

              {/* Certificate Upload */}
              <div className="space-y-2">
                <Label htmlFor="certificate" className="text-mythic-text-primary">
                  Quality Certificate
                </Label>
                <div className="border-2 border-dashed border-mythic-primary-500/20 rounded-lg p-6 text-center hover:border-mythic-primary-500/40 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-mythic-text-muted mx-auto mb-2" />
                  <p className="text-sm text-mythic-text-muted">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-mythic-text-muted mt-1">
                    PDF, JPG or PNG (max 5MB)
                  </p>
                  <input
                    type="file"
                    id="certificate"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({ ...formData, certificateFile: file })
                      }
                    }}
                  />
                </div>
                {formData.certificateFile && (
                  <p className="text-sm text-mythic-primary-500">
                    ✓ {formData.certificateFile.name}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-mythic-primary-500/10 border border-mythic-primary-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-mythic-text-muted">
                    <p className="mb-1">
                      <strong className="text-mythic-text-primary">SRL Verification:</strong> Your batch will be verified by our AI agents and assigned a GIRM proof upon successful validation.
                    </p>
                    <p>
                      Listing fee: <span className="text-mythic-primary-500 font-semibold">0.5% of transaction value</span> (paid on successful sale)
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-mythic-primary-500 hover:bg-mythic-primary-600 text-mythic-dark-900"
                >
                  <Package className="h-4 w-4 mr-2" />
                  List Batch
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
