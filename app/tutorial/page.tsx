'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  CheckCircle, 
  Recycle, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  BookOpen,
  Play,
  X
} from 'lucide-react'
import { toast } from 'sonner'

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Genesis Reloop',
    description: 'Transform waste into community wealth. This tutorial will guide you through the platform.',
    icon: <Recycle className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>Genesis Reloop creates circular economy loops that turn local waste into renewable energy and food.</p>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>Food waste becomes biogas and fertilizer</li>
          <li>Used cooking oil becomes biodiesel</li>
          <li>Heat cascades power vertical farms</li>
          <li>Communities earn from every loop</li>
        </ul>
      </div>
    )
  },
  {
    id: 'loops',
    title: 'Start a Loop',
    description: 'Plant a seed (xeromeme) and grow it into a stabilized recursive loop.',
    icon: <Recycle className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>Every loop starts with identifying waste sources and matching them to processing assets.</p>
        <div className="bg-mythic-dark-900/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Loop Creation Process:</h4>
          <ol className="space-y-1 list-decimal list-inside text-sm">
            <li>Register as a supplier with your waste volumes</li>
            <li>Get matched to nearby processors</li>
            <li>Agree on collection schedule and pricing</li>
            <li>Track materials through the loop</li>
            <li>Earn GIRM credits for participation</li>
          </ol>
        </div>
      </div>
    ),
    action: { label: 'Explore Loops', href: '/loops' }
  },
  {
    id: 'agents',
    title: 'AI Agents Help You',
    description: 'Specialized agents handle planning, verification, and routing automatically.',
    icon: <Users className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>Our AI agents work 24/7 to optimize your loops:</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-mythic-dark-900/50 p-3 rounded-lg">
            <h5 className="font-semibold text-sm text-mythic-primary-500">FeedstockMatcher</h5>
            <p className="text-xs text-mythic-text-muted">Matches waste to processors</p>
          </div>
          <div className="bg-mythic-dark-900/50 p-3 rounded-lg">
            <h5 className="font-semibold text-sm text-mythic-primary-500">RouteGen</h5>
            <p className="text-xs text-mythic-text-muted">Optimizes collection routes</p>
          </div>
          <div className="bg-mythic-dark-900/50 p-3 rounded-lg">
            <h5 className="font-semibold text-sm text-mythic-primary-500">CarbonVerifier</h5>
            <p className="text-xs text-mythic-text-muted">Calculates carbon savings</p>
          </div>
          <div className="bg-mythic-dark-900/50 p-3 rounded-lg">
            <h5 className="font-semibold text-sm text-mythic-primary-500">TraceBot</h5>
            <p className="text-xs text-mythic-text-muted">Tracks chain of custody</p>
          </div>
        </div>
      </div>
    ),
    action: { label: 'Meet the Agents', href: '/agents' }
  },
  {
    id: 'marketplace',
    title: 'Trade Products',
    description: 'Buy and sell loop outputs with transparent pricing and impact tracking.',
    icon: <ShoppingCart className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>The marketplace connects loop outputs to buyers:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-mythic-primary-500">•</span>
            <div>
              <strong>Primary Products:</strong> Biogas, biodiesel, biochar
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-mythic-primary-500">•</span>
            <div>
              <strong>Secondary Products:</strong> Digestate, glycerol, organic produce
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-mythic-primary-500">•</span>
            <div>
              <strong>GIRM Credits:</strong> Trade carbon savings and loop participation
            </div>
          </li>
        </ul>
      </div>
    ),
    action: { label: 'Visit Marketplace', href: '/marketplace' }
  },
  {
    id: 'monitor',
    title: 'Monitor Performance',
    description: 'Real-time dashboards show loop health, carbon savings, and earnings.',
    icon: <BarChart3 className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>Track everything in real-time:</p>
        <div className="bg-mythic-dark-900/50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Waste Diverted</span>
            <span className="text-mythic-primary-500 font-semibold">142 tonnes/day</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Carbon Saved</span>
            <span className="text-mythic-accent-300 font-semibold">892 tCO₂e/month</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Community Earnings</span>
            <span className="text-flow-credits font-semibold">£47,200/month</span>
          </div>
        </div>
      </div>
    ),
    action: { label: 'View Monitor', href: '/monitor', requiresAuth: true }
  },
  {
    id: 'docs',
    title: 'Learn More',
    description: 'Dive deep into protocols, methodology, and operational guides.',
    icon: <BookOpen className="h-8 w-8" />,
    content: (
      <div className="space-y-4">
        <p>Everything you need to know:</p>
        <ul className="space-y-2 text-sm">
          <li>• Technical specifications for each loop type</li>
          <li>• Compliance and regulatory guidance</li>
          <li>• Financial models and ROI calculations</li>
          <li>• Best practices from operational loops</li>
          <li>• API documentation for developers</li>
        </ul>
      </div>
    ),
    action: { label: 'Read Docs', href: '/docs' }
  }
]

export default function TutorialPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showTutorial, setShowTutorial] = useState(true)

  useEffect(() => {
    // Check if user has completed tutorial before
    const completed = localStorage.getItem('tutorialCompleted')
    if (completed) {
      setShowTutorial(false)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps([...completedSteps, tutorialSteps[currentStep].id])
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'true')
    setShowTutorial(false)
    toast.success('Tutorial completed! Welcome to Genesis Reloop.')
    router.push('/')
  }

  const skipTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'skipped')
    setShowTutorial(false)
    router.push('/')
  }

  const restartTutorial = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setShowTutorial(true)
  }

  const step = tutorialSteps[currentStep]

  if (!showTutorial) {
    return (
      <div className="min-h-screen bg-black text-mythic-text-primary py-24 relative">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-4">
              Tutorial Completed
            </h1>
            <p className="text-xl text-mythic-text-muted mb-8">
              You've already completed the tutorial. Would you like to go through it again?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={restartTutorial}
                className="bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black"
              >
                <Play className="h-4 w-4 mr-2" />
                Restart Tutorial
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="border-mythic-primary-500/20 hover:bg-mythic-primary-500/10"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-mythic-text-primary py-24 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Getting Started</h1>
            <Button
              onClick={skipTutorial}
              variant="ghost"
              size="sm"
              className="text-mythic-text-muted hover:text-mythic-text-primary"
            >
              Skip Tutorial
              <X className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {tutorialSteps.map((tutStep, idx) => (
              <div key={tutStep.id} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    idx < currentStep
                      ? 'bg-mythic-primary-500'
                      : idx === currentStep
                      ? 'bg-mythic-accent-300'
                      : 'bg-mythic-dark-800'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-mythic-text-muted mt-2">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>

        {/* Tutorial Content */}
        <div className="bg-mythic-dark-900/50 rounded-2xl border border-mythic-primary-500/20 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="p-4 rounded-xl bg-mythic-primary-500/10 text-mythic-primary-500">
              {step.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-2">
                {step.title}
              </h2>
              <p className="text-lg text-mythic-text-muted mb-6">
                {step.description}
              </p>
              {step.content}
              {step.action && (
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      if (step.action?.requiresAuth) {
                        toast.info('This feature requires login')
                      }
                      router.push(step.action.href)
                    }}
                    className="bg-mythic-primary-500/20 hover:bg-mythic-primary-500/30 text-mythic-primary-500 border border-mythic-primary-500/40"
                  >
                    {step.action.label}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="border-mythic-primary-500/20 hover:bg-mythic-primary-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-mythic-primary-500 w-8'
                    : completedSteps.includes(tutorialSteps[idx].id)
                    ? 'bg-mythic-accent-300'
                    : 'bg-mythic-dark-700'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black"
          >
            {currentStep === tutorialSteps.length - 1 ? (
              <>
                Complete Tutorial
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
