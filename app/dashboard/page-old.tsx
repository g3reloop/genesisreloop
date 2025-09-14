import dynamic from 'next/dynamic'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Dynamically import the entire dashboard to prevent SSR issues with auth
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
  
  const handleRestartTour = () => {
    localStorage.removeItem('genesis-tour-completed')
    localStorage.removeItem('genesis-first-login')
    toast.success('Tutorial will start on your next page refresh')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  
  // Load real data from Supabase
  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time subscription for updates
    const channel = supabase.channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => loadDashboardData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        () => loadDashboardData()
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])
  
  const loadDashboardData = async () => {
    if (!user) return
    
    try {
      // Get user's total waste collected
      const { data: wasteData } = await supabase
        .from('transactions')
        .select('quantity')
        .eq('seller_id', user.id)
        .eq('status', 'completed')
      
      const totalWaste = wasteData?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0
      
      // Get active batches (active listings)
      const { count: activeBatchesCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id)
        .eq('status', 'active')
      
      // Get total earnings
      const { data: earningsData } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('seller_id', user.id)
        .eq('status', 'completed')
      
      const totalEarnings = earningsData?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
      
      // Get carbon offset (from completed transactions)
      const { data: carbonData } = await supabase
        .from('carbon_credits')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'verified')
      
      const carbonOffset = carbonData?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0
      
      // Get pending transactions
      const { count: pendingCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id)
        .eq('status', 'pending')
      
      // Get verified suppliers count
      const { count: verifiedCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verified', true)
        .in('role', ['supplier', 'processor'])
      
      // Calculate monthly growth (compare this month to last month)
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      
      const { data: thisMonthData } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('seller_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', thisMonthStart.toISOString())
      
      const { data: lastMonthData } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('seller_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())
      
      const thisMonthTotal = thisMonthData?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
      const lastMonthTotal = lastMonthData?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
      const growth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0
      
      // Get recent activity
      const { data: recentTransactions } = await supabase
        .from('transactions')
        .select(`
          *,
          listings (
            title,
            category
          )
        `)
        .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3)
      
      const activities: RecentActivity[] = recentTransactions?.map(t => {
        if (t.type === 'sale') {
          return {
            id: t.id,
            type: 'sale',
            title: 'Marketplace Sale Completed',
            description: `${t.listings?.title || 'Item'} • ${new Date(t.created_at).toLocaleTimeString()}`,
            amount: `+£${t.total_amount?.toFixed(2) || '0.00'}`,
            timestamp: t.created_at,
            icon: ShoppingCart,
            iconColor: 'text-mythic-secondary-500',
            iconBg: 'bg-mythic-secondary-500/20'
          }
        } else {
          return {
            id: t.id,
            type: 'collection',
            title: `Batch #${t.id.slice(-8)} Collected`,
            description: `${t.quantity}kg ${t.listings?.category || 'waste'} • ${new Date(t.created_at).toLocaleTimeString()}`,
            amount: `+£${t.total_amount?.toFixed(2) || '0.00'}`,
            timestamp: t.created_at,
            icon: Truck,
            iconColor: 'text-mythic-primary-500',
            iconBg: 'bg-mythic-primary-500/20'
          }
        }
      }) || []
      
      // Calculate system efficiency (ratio of completed to total transactions)
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id)
      
      const efficiency = totalTransactions ? ((wasteData?.length || 0) / totalTransactions) * 100 : 0
      
      setMetrics({
        totalWasteCollected: totalWaste,
        activeBatches: activeBatchesCount || 0,
        totalEarnings,
        carbonOffset,
        pendingTransactions: pendingCount || 0,
        verifiedSuppliers: verifiedCount || 0,
        systemEfficiency: efficiency,
        monthlyGrowth: growth
      })
      
      setRecentActivity(activities)
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
      setLoading(false)
    }
  }

  const metricCards: MetricCard[] = [
    {
      title: 'Total Waste Collected',
      value: `${metrics.totalWasteCollected.toFixed(2)}`,
      unit: 'kg',
      change: metrics.totalWasteCollected > 0 ? '+' : '0%',
      icon: Recycle,
      color: 'text-mythic-primary-500'
    },
    {
      title: 'Active Batches',
      value: metrics.activeBatches,
      change: metrics.activeBatches > 0 ? 'Active' : 'None',
      icon: Package,
      color: 'text-mythic-secondary-500'
    },
    {
      title: 'Total Earnings',
      value: `£${metrics.totalEarnings.toFixed(2)}`,
      change: metrics.monthlyGrowth > 0 ? `+${metrics.monthlyGrowth.toFixed(1)}%` : '0%',
      icon: DollarSign,
      color: 'text-mythic-accent-500'
    },
    {
      title: 'Carbon Offset',
      value: `${metrics.carbonOffset.toFixed(2)}`,
      unit: 'tCO₂',
      change: metrics.carbonOffset > 0 ? 'Verified' : '0%',
      icon: Leaf,
      color: 'text-mythic-flow-credits'
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-2 sm:mb-4">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-mythic-text-muted text-sm sm:text-base lg:text-lg">
              Here's what's happening in your circular economy network today
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestartTour}
            className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Restart Tour</span>
            <span className="sm:hidden">Tour</span>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {metricCards.map((metric, index) => (
            <Card key={index} className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all hover:shadow-lg hover:shadow-mythic-primary-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-mythic-text-muted">
                  {metric.title}
                </CardTitle>
                <metric.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", metric.color)} />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-mythic-text-primary">
                  {metric.value}
                  {metric.unit && <span className="text-sm sm:text-base lg:text-lg text-mythic-text-muted ml-1">{metric.unit}</span>}
                </div>
                <p className="text-xs text-mythic-secondary-500 flex items-center mt-1 sm:mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="truncate">{metric.change}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                  <CardDescription className="text-sm">Your latest transactions and updates</CardDescription>
                </div>
                <Link href="/transactions" className="text-mythic-primary-500 hover:text-mythic-primary-400 text-sm font-medium flex items-center gap-1 self-start sm:self-auto">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-mythic-dark-700/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-mythic-dark-700 rounded-lg gap-3">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`p-1.5 sm:p-2 ${activity.iconBg} rounded-lg flex-shrink-0`}>
                          <activity.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${activity.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-mythic-text-primary truncate">{activity.title}</p>
                          <p className="text-xs text-mythic-text-muted">{activity.description}</p>
                        </div>
                      </div>
                      <span className={`${activity.iconColor} font-semibold text-sm sm:text-base self-end sm:self-auto`}>
                        {activity.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-mythic-text-muted text-sm">No recent activity</p>
                  <Link href="/marketplace" className="text-mythic-primary-500 text-sm hover:underline mt-2 inline-block">
                    Browse marketplace to get started
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/marketplace/create">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <Package className="h-4 w-4 mr-2" />
                  List New Batch
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <Activity className="h-4 w-4 mr-2" />
                  View AI Agents
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Loop Visualization */}
        <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Network Overview</CardTitle>
                <CardDescription>
                  Real-time visualization of the circular economy loops
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-mythic-secondary-500 animate-pulse" />
                <span className="text-sm font-medium text-mythic-text-muted">
                  System Efficiency: {metrics.systemEfficiency.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <LoopVisualization />
          </CardContent>
        </Card>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-accent-500">
                  {metrics.pendingTransactions}
                </span>
                <Package className="h-8 w-8 text-mythic-accent-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                Batches awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Network Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-primary-500">
                  {metrics.monthlyGrowth > 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                </span>
                <TrendingUp className="h-8 w-8 text-mythic-primary-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                This month vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verified Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-secondary-500">
                  {metrics.verifiedSuppliers}
                </span>
                <Users className="h-8 w-8 text-mythic-secondary-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                Active in your network
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
