import dynamic from 'next/dynamic'

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Dynamically import the dashboard content to prevent SSR issues with auth
const DashboardContent = dynamic(
  () => import('@/components/dashboard/DashboardContent').catch(() => {
    // If the component doesn't exist, show a placeholder
    return {
      default: () => (
        <div className="flex items-center justify-center min-h-screen bg-mythic-obsidian">
          <div className="text-white">Dashboard is being set up...</div>
        </div>
      )
    }
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-mythic-obsidian">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }
)

export default function DashboardPage() {
  return <DashboardContent />
}
