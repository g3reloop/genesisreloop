import Link from "next/link";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Truck, DollarSign, MapPin, Clock } from 'lucide-react'

export default function PartnerProposal() {
  return (
    <div className="min-h-screen bg-earth-obsidian">
      {/* Back Navigation */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link href="/" className="inline-flex items-center text-txt-ash hover:text-acc-cyan transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gen-radial opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-txt-snow mb-4">
              Join Genesis Reloop Network
            </h1>
            <p className="text-xl text-txt-ash max-w-3xl mx-auto">
              Partner with us to transform waste into value. Connect with our decentralized 
              marketplace for UCO collection and processing.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Supplier Benefits */}
            <Card className="bg-earth-midnight/50 border-acc-emerald/20 hover:border-acc-emerald/40 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-acc-emerald">For Suppliers</CardTitle>
                <CardDescription className="text-txt-ash">
                  Turn your waste oil into revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-acc-emerald mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Schedule Collections Instantly</h4>
                    <p className="text-sm text-txt-ash">No more phone calls - book pickups with one click</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-acc-emerald mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Get Paid for Your Waste</h4>
                    <p className="text-sm text-txt-ash">Competitive rebates for your used cooking oil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-acc-emerald mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Real-Time Tracking</h4>
                    <p className="text-sm text-txt-ash">Know exactly when your collection will arrive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-acc-emerald mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Digital Compliance</h4>
                    <p className="text-sm text-txt-ash">Automated WTN documentation for full compliance</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/supplier">
                    <Button className="w-full bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow">
                      Start as Supplier
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Driver Benefits */}
            <Card className="bg-earth-midnight/50 border-acc-cyan/20 hover:border-acc-cyan/40 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-acc-cyan">For Drivers</CardTitle>
                <CardDescription className="text-txt-ash">
                  Join our fair-pay collection network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-acc-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Find Profitable Routes</h4>
                    <p className="text-sm text-txt-ash">Access verified suppliers ready to pay for collection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-acc-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">AI-Optimized Routing</h4>
                    <p className="text-sm text-txt-ash">Maximize efficiency with intelligent route planning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-acc-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Instant Payments</h4>
                    <p className="text-sm text-txt-ash">Get paid immediately after each collection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-acc-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-txt-snow">Join the DAO</h4>
                    <p className="text-sm text-txt-ash">Participate in governance and earn GIRM rewards</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/driver">
                    <Button className="w-full bg-acc-cyan text-earth-obsidian hover:shadow-electric-glow">
                      Start as Driver
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-earth-midnight/30">
        <div className="mx-auto max-w-2xl px-6">
          <Card className="bg-earth-obsidian border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-txt-snow">Get Started</CardTitle>
              <CardDescription className="text-txt-ash">
                Tell us about your business and we'll help you join the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-txt-ash mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-txt-ash mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-txt-ash mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-txt-ash mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-txt-ash mb-2">
                    I'm interested in joining as
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="supplier">Supplier (Restaurant/Kitchen)</option>
                    <option value="driver">Driver/Collector</option>
                    <option value="processor">Processor</option>
                    <option value="buyer">Buyer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-txt-ash mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-earth-midnight border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20 resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                
                <Button type="submit" className="w-full bg-hi-violet text-txt-snow hover:shadow-electric-glow">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
