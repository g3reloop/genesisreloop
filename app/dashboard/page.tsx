import dynamic from 'next/dynamic'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Dynamically import the dashboard content without SSR
const DashboardContent = dynamic(
  () => import('@/components/dashboard/DashboardContent'),
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
