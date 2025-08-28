import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Smartphone, MapPin, Calendar, Bell, Package, Route, CheckCircle } from 'lucide-react'

export default function MobilePage() {
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
            Genesis Reloop Driver App
          </h1>
          <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
            Coming Soon: The mobile companion app for collection drivers and field operators
          </p>
          <div className="flex items-center justify-center gap-2 text-mythic-primary-500">
            <Smartphone className="h-8 w-8" />
            <span className="text-2xl font-semibold">Available Q2 2025</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-mythic-primary-500" />
                Optimized Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mythic-text-muted">
                AI-optimized collection routes that minimize fuel consumption and maximize efficiency. 
                Real-time traffic integration and dynamic route adjustments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-mythic-primary-500" />
                GPS Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mythic-text-muted">
                Real-time GPS tracking with geofenced collection points. Automatic arrival/departure 
                logging and proof of collection timestamps.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-mythic-primary-500" />
                Digital Manifests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mythic-text-muted">
                Paperless waste transfer notes and digital signatures. Automatic weight capture 
                integration and photo documentation of collections.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-mythic-primary-500" />
                Smart Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mythic-text-muted">
                Real-time alerts for new collection requests, route changes, and urgent pickups. 
                Push notifications for compliance reminders and vehicle maintenance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Compatibility */}
        <Card className="bg-mythic-dark-900 border-mythic-primary-500/30 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Platform Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="mb-4">
                  <img src="/ios-app-store-badge.svg" alt="iOS App Store" className="h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">iOS App</h3>
                <p className="text-mythic-text-muted">
                  Native iOS app optimized for iPhone and iPad. Requires iOS 14.0 or later.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4">
                  <img src="/google-play-badge.svg" alt="Google Play Store" className="h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Android App</h3>
                <p className="text-mythic-text-muted">
                  Native Android app with Material Design. Requires Android 7.0 (API 24) or later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="bg-gradient-to-br from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-2xl p-8 border border-mythic-primary-500/20">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Use the Genesis Reloop Driver App?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-mythic-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Earn More</h3>
                <p className="text-sm text-mythic-text-muted">
                  Optimized routes mean more collections per shift and higher earnings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-mythic-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Work Smarter</h3>
                <p className="text-sm text-mythic-text-muted">
                  AI-powered route optimization saves time and reduces fuel costs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-mythic-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Stay Compliant</h3>
                <p className="text-sm text-mythic-text-muted">
                  Automated compliance tracking and digital documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
          <p className="text-lg text-mythic-text-muted mb-8">
            Join the waitlist to get early access to the Genesis Reloop Driver App
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-mythic-dark-800 border border-mythic-primary-500/20 text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500"
            />
            <button className="px-6 py-3 rounded-lg bg-mythic-primary-500 text-black font-semibold hover:bg-mythic-primary-400 transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
