import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-gradient">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-mythic-dark-500 dark:text-mythic-dark-400 max-w-md mx-auto">
            The page you{`'`}re looking for doesn{`'`}t exist or has been moved to a different location.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-mythic-dark-500 dark:text-mythic-dark-400">
            Need help? <Link href="/support" className="text-mythic-primary-500 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
