'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface TourStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right'
  route?: string // Optional route to navigate to
  action?: () => void // Optional action to perform
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Genesis Reloop!',
    description: 'Let\'s take a quick tour to help you get started. You can skip this anytime or restart it from your profile.',
    target: '.site-logo',
    position: 'bottom'
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Trade waste batches and recycled products. All transactions are verified through our SRL (Stabilized Recursive Loop) protocol.',
    target: '[href="/marketplace"]',
    position: 'bottom'
  },
  {
    id: 'list-batches',
    title: 'List Your Batches',
    description: 'Click here to list your UCO or food waste batches. Set your price and let buyers find you.',
    target: '[data-test="list-srl-batches"]',
    position: 'left',
    route: '/marketplace'
  },
  {
    id: 'agents',
    title: 'AI Agents',
    description: 'Our AI agents help match suppliers with processors, optimize routes, and verify compliance. Click to chat with them!',
    target: '[href="/agents"]',
    position: 'bottom'
  },
  {
    id: 'girm',
    title: 'GIRM Credits',
    description: 'Genesis Impact & Regeneration Mechanism - earn credits for every verified batch you process.',
    target: '[href="/girm"]',
    position: 'bottom'
  },
  {
    id: 'wallet',
    title: 'Connect Your Wallet',
    description: 'Connect your wallet to participate in the DAO and receive payments for your batches.',
    target: '.btn-connect-wallet',
    position: 'left'
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'View your reputation score, transaction history, and manage your account settings.',
    target: '[href="/dashboard"]',
    position: 'bottom'
  }
]

interface TourGuideProps {
  onComplete?: () => void
  startTour?: boolean
}

export function TourGuide({ onComplete, startTour = false }: TourGuideProps) {
  const [isActive, setIsActive] = useState(startTour)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null)
  const router = useRouter()

  const currentTourStep = tourSteps[currentStep]

  useEffect(() => {
    // Check if user has completed tour before
    const tourCompleted = localStorage.getItem('genesis-tour-completed')
    if (!tourCompleted && startTour) {
      setIsActive(true)
    }
  }, [startTour])

  useEffect(() => {
    if (isActive && currentTourStep) {
      // Navigate to route if specified
      if (currentTourStep.route) {
        router.push(currentTourStep.route)
        // Wait for navigation
        setTimeout(updateHighlight, 500)
      } else {
        updateHighlight()
      }
    }
  }, [currentStep, isActive, currentTourStep])

  const updateHighlight = () => {
    if (!currentTourStep) return
    
    const targetElement = document.querySelector(currentTourStep.target)
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setHighlightBox(rect)
    }
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    setIsActive(false)
    setCurrentStep(0)
  }

  const completeTour = () => {
    localStorage.setItem('genesis-tour-completed', 'true')
    setIsActive(false)
    setCurrentStep(0)
    onComplete?.()
  }

  if (!isActive) return null

  const getTooltipPosition = () => {
    if (!highlightBox || !currentTourStep) return { top: '50%', left: '50%' }

    const tooltipWidth = 320
    const tooltipHeight = 200
    const padding = 20

    let top = 0
    let left = 0

    switch (currentTourStep.position) {
      case 'top':
        top = highlightBox.top - tooltipHeight - padding
        left = highlightBox.left + highlightBox.width / 2 - tooltipWidth / 2
        break
      case 'bottom':
        top = highlightBox.bottom + padding
        left = highlightBox.left + highlightBox.width / 2 - tooltipWidth / 2
        break
      case 'left':
        top = highlightBox.top + highlightBox.height / 2 - tooltipHeight / 2
        left = highlightBox.left - tooltipWidth - padding
        break
      case 'right':
        top = highlightBox.top + highlightBox.height / 2 - tooltipHeight / 2
        left = highlightBox.right + padding
        break
    }

    // Ensure tooltip stays within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding))
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding))

    return { top: `${top}px`, left: `${left}px` }
  }

  const tooltipPosition = getTooltipPosition()

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[9998]"
            onClick={skipTour}
          />

          {/* Highlight box */}
          {highlightBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9999] pointer-events-none"
              style={{
                top: highlightBox.top - 4,
                left: highlightBox.left - 4,
                width: highlightBox.width + 8,
                height: highlightBox.height + 8,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
                border: '2px solid #00C08B',
                borderRadius: '8px'
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[10000] bg-mythic-dark-900 border-2 border-mythic-primary-500/50 rounded-xl p-6 w-80 shadow-2xl"
            style={tooltipPosition}
          >
            {/* Close button */}
            <button
              onClick={skipTour}
              className="absolute top-4 right-4 text-mythic-text-muted hover:text-mythic-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-mythic-primary-500"
                      : index < currentStep
                      ? "w-2 bg-mythic-primary-500/50"
                      : "w-2 bg-mythic-dark-700"
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-mythic-text-primary mb-2">
              {currentTourStep?.title}
            </h3>
            <p className="text-mythic-text-muted mb-6">
              {currentTourStep?.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-mythic-text-muted"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-mythic-text-muted">
                {currentStep + 1} of {tourSteps.length}
              </span>

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-mythic-primary-500 hover:bg-mythic-primary-600 text-mythic-dark-900"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    Complete
                    <CheckCircle className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip option */}
            <button
              onClick={skipTour}
              className="w-full text-center text-xs text-mythic-text-muted hover:text-mythic-text-primary mt-4 transition-colors"
            >
              Skip tour
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook to trigger tour from anywhere
export function useTour() {
  const [showTour, setShowTour] = useState(false)

  const startTour = () => {
    setShowTour(true)
  }

  const resetTour = () => {
    localStorage.removeItem('genesis-tour-completed')
    setShowTour(true)
  }

  return { showTour, startTour, resetTour }
}
