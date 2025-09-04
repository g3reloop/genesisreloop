'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { 
  Truck, 
  Shield, 
  MapPin, 
  Award, 
  Search, 
  Filter,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Thermometer,
  AlertTriangle,
  Package,
  Clock
} from 'lucide-react'

interface Carrier {
  id: string
  name: string
  logo?: string
  description: string
  capabilities: string[]
  certifications: string[]
  serviceAreas: string[]
  vehicleTypes: string[]
  specialties: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  stats: {
    fleetSize: number
    yearsInBusiness: number
    monthlyCapacity: string
  }
  rating: number
  verified: boolean
}

// Mock carrier data - in production this would come from database
const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'EcoTransport Ltd',
    description: 'Leading sustainable logistics provider specializing in temperature-controlled waste transport',
    capabilities: ['temperature_control', 'adr_certified', 'real_time_tracking', 'bulk_transport'],
    certifications: ['ISO 14001', 'FORS Gold', 'ADR License', 'WAMITAB', 'ISO 9001'],
    serviceAreas: ['UK', 'London', 'Southeast', 'Midlands'],
    vehicleTypes: ['Refrigerated trucks', 'Tankers', 'Compactors', 'Box trucks'],
    specialties: ['food_waste', 'uco', 'hazardous'],
    contact: {
      phone: '+44 20 7123 4567',
      email: 'contact@ecotransport.co.uk',
      website: 'www.ecotransport.co.uk'
    },
    stats: {
      fleetSize: 45,
      yearsInBusiness: 12,
      monthlyCapacity: '2,500 tonnes'
    },
    rating: 4.8,
    verified: true
  },
  {
    id: '2',
    name: 'Green Logistics Co',
    description: 'Carbon-neutral logistics with rail access for long-distance transport',
    capabilities: ['bulk_transport', 'rail_access', 'carbon_neutral', 'hazardous_waste'],
    certifications: ['ISO 9001', 'ISCC', 'Carbon Trust Standard', 'RHA Member'],
    serviceAreas: ['UK', 'EU', 'Scotland', 'North England'],
    vehicleTypes: ['Bulk carriers', 'Walking floor trailers', 'Rail containers'],
    specialties: ['bulk_liquid', 'industrial', 'agricultural'],
    contact: {
      phone: '+44 131 555 0123',
      email: 'info@greenlogistics.com',
      website: 'www.greenlogistics.com'
    },
    stats: {
      fleetSize: 65,
      yearsInBusiness: 18,
      monthlyCapacity: '5,000 tonnes'
    },
    rating: 4.6,
    verified: true
  },
  {
    id: '3',
    name: 'SafeWaste Carriers',
    description: 'Specialist hazardous waste transport with 24/7 emergency response',
    capabilities: ['hazardous_waste', 'adr_certified', '24_7_service', 'emergency_response'],
    certifications: ['ADR License', 'Hazardous Waste License', 'ISO 45001', 'CHAS'],
    serviceAreas: ['UK', 'Wales', 'Southwest'],
    vehicleTypes: ['ADR vehicles', 'Vacuum tankers', 'Secure containers'],
    specialties: ['hazardous', 'chemical', 'medical'],
    contact: {
      phone: '+44 29 2087 6543',
      email: 'ops@safewaste.co.uk',
      website: 'www.safewaste.co.uk'
    },
    stats: {
      fleetSize: 30,
      yearsInBusiness: 25,
      monthlyCapacity: '1,000 tonnes'
    },
    rating: 4.9,
    verified: true
  },
  {
    id: '4',
    name: 'Urban Collection Services',
    description: 'Micro-collection specialist with electric vehicles for city centers',
    capabilities: ['micro_collection', 'electric_vehicles', 'real_time_tracking', 'flexible_scheduling'],
    certifications: ['FORS Silver', 'Ultra Low Emission', 'ISO 14001'],
    serviceAreas: ['London', 'Birmingham', 'Manchester', 'Bristol'],
    vehicleTypes: ['Electric vans', 'Cargo bikes', 'Small trucks'],
    specialties: ['food_waste', 'uco', 'recyclables'],
    contact: {
      phone: '+44 20 7999 8888',
      email: 'hello@urbancollection.co.uk',
      website: 'www.urbancollection.co.uk'
    },
    stats: {
      fleetSize: 80,
      yearsInBusiness: 6,
      monthlyCapacity: '800 tonnes'
    },
    rating: 4.7,
    verified: true
  },
  {
    id: '5',
    name: 'Circular Transport Solutions',
    description: 'End-to-end circular economy logistics with processing partnerships',
    capabilities: ['bulk_transport', 'temperature_control', 'processing_partner', 'carbon_tracking'],
    certifications: ['ISO 14001', 'ISO 9001', 'ISCC EU', 'B Corp Certified'],
    serviceAreas: ['UK', 'Ireland', 'France', 'Netherlands'],
    vehicleTypes: ['Multi-compartment tankers', 'Temperature-controlled units', 'Flatbeds'],
    specialties: ['uco', 'biodiesel', 'glycerin'],
    contact: {
      phone: '+44 161 234 5678',
      email: 'enquiries@circulartransport.eu',
      website: 'www.circulartransport.eu'
    },
    stats: {
      fleetSize: 55,
      yearsInBusiness: 10,
      monthlyCapacity: '3,500 tonnes'
    },
    rating: 4.5,
    verified: true
  }
]

export default function CarriersPage() {
  return (
    <AuthGuard
      requiredRole={['supplier', 'processor', 'buyer', 'logistics', 'admin']}
      requireVerified={true}
      requireOnboarded={true}
    >
      <CarriersContent />
    </AuthGuard>
  )
}

function CarriersContent() {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers)
  const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>(mockCarriers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCapability, setFilterCapability] = useState<string>('all')
  const [filterArea, setFilterArea] = useState<string>('all')
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all')

  // Get unique values for filters
  const allCapabilities = Array.from(new Set(carriers.flatMap(c => c.capabilities)))
  const allAreas = Array.from(new Set(carriers.flatMap(c => c.serviceAreas)))
  const allSpecialties = Array.from(new Set(carriers.flatMap(c => c.specialties)))

  useEffect(() => {
    let filtered = [...carriers]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(carrier => 
        carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.certifications.some(cert => cert.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply capability filter
    if (filterCapability !== 'all') {
      filtered = filtered.filter(carrier => 
        carrier.capabilities.includes(filterCapability)
      )
    }

    // Apply area filter
    if (filterArea !== 'all') {
      filtered = filtered.filter(carrier => 
        carrier.serviceAreas.includes(filterArea)
      )
    }

    // Apply specialty filter
    if (filterSpecialty !== 'all') {
      filtered = filtered.filter(carrier => 
        carrier.specialties.includes(filterSpecialty)
      )
    }

    setFilteredCarriers(filtered)
  }, [searchTerm, filterCapability, filterArea, filterSpecialty, carriers])

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'temperature_control':
        return <Thermometer className="h-4 w-4" />
      case 'adr_certified':
      case 'hazardous_waste':
        return <AlertTriangle className="h-4 w-4" />
      case 'bulk_transport':
        return <Package className="h-4 w-4" />
      case '24_7_service':
        return <Clock className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const formatCapabilityName = (capability: string) => {
    return capability
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logistics Carriers</h1>
        <p className="text-muted-foreground mt-1">
          Find certified carriers for your waste transport needs
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Search carriers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Search by name, description, or certification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="capability">Capability</Label>
              <Select value={filterCapability} onValueChange={setFilterCapability}>
                <SelectTrigger id="capability">
                  <SelectValue placeholder="All capabilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All capabilities</SelectItem>
                  {allCapabilities.map(cap => (
                    <SelectItem key={cap} value={cap}>
                      {formatCapabilityName(cap)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="area">Service area</Label>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="All areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All areas</SelectItem>
                  {allAreas.map(area => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specialty">Material specialty</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All materials</SelectItem>
                  {allSpecialties.map(spec => (
                    <SelectItem key={spec} value={spec}>
                      {formatCapabilityName(spec)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredCarriers.length} of {carriers.length} carriers
          </div>
        </CardContent>
      </Card>

      {/* Carrier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCarriers.map(carrier => (
          <Card key={carrier.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {carrier.name}
                    {carrier.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{carrier.description}</p>
                </div>
                <Badge variant="secondary">
                  ⭐ {carrier.rating}/5.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{carrier.stats.fleetSize}</p>
                  <p className="text-xs text-muted-foreground">Fleet size</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{carrier.stats.yearsInBusiness}</p>
                  <p className="text-xs text-muted-foreground">Years in business</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{carrier.stats.monthlyCapacity}</p>
                  <p className="text-xs text-muted-foreground">Monthly capacity</p>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <p className="text-sm font-medium mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {carrier.capabilities.map(cap => (
                    <Badge key={cap} variant="outline" className="flex items-center gap-1">
                      {getCapabilityIcon(cap)}
                      {formatCapabilityName(cap)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {carrier.certifications.map(cert => (
                    <Badge key={cert} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Service areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {carrier.serviceAreas.map(area => (
                    <span key={area} className="text-sm text-muted-foreground">
                      {area}{carrier.serviceAreas.indexOf(area) < carrier.serviceAreas.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="pt-2 border-t space-y-2">
                {carrier.contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${carrier.contact.phone}`} className="hover:underline">
                      {carrier.contact.phone}
                    </a>
                  </div>
                )}
                {carrier.contact.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${carrier.contact.email}`} className="hover:underline">
                      {carrier.contact.email}
                    </a>
                  </div>
                )}
                {carrier.contact.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`https://${carrier.contact.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {carrier.contact.website}
                    </a>
                  </div>
                )}
              </div>

              <Button className="w-full">
                Contact Carrier
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCarriers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No carriers found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
