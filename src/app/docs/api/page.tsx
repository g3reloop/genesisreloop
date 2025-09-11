'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CopyBlock, dracula } from 'react-code-blocks'
import { 
  Code2, 
  Shield, 
  Zap, 
  Database,
  Route,
  Bot,
  Building2,
  Copy,
  Check
} from 'lucide-react'

const apiEndpoints = [
  {
    category: 'Authentication',
    icon: Shield,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        auth: false,
        request: {
          email: 'string',
          password: 'string',
          role: 'supplier | processor | buyer',
          business_name: 'string',
          business_type: 'string'
        },
        response: {
          user: { id: 'string', email: 'string' },
          session: { access_token: 'string' }
        }
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate and get access token',
        auth: false,
        request: {
          email: 'string',
          password: 'string'
        },
        response: {
          user: { id: 'string', email: 'string', role: 'string' },
          session: { access_token: 'string' }
        }
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout and invalidate session',
        auth: true,
        response: {
          success: true
        }
      }
    ]
  },
  {
    category: 'Verification',
    icon: Building2,
    endpoints: [
      {
        method: 'POST',
        path: '/api/verify-company',
        description: 'Verify UK company registration',
        auth: true,
        request: {
          companyNumber: 'string',
          emailDomain: 'string'
        },
        response: {
          isValid: 'boolean',
          score: 'number',
          company: {
            name: 'string',
            status: 'string',
            incorporationDate: 'string',
            sicCodes: 'string[]',
            registeredOffice: 'object'
          },
          emailMatch: 'boolean',
          verificationNotes: 'string[]'
        }
      }
    ]
  },
  {
    category: 'Route Optimization',
    icon: Route,
    endpoints: [
      {
        method: 'POST',
        path: '/api/optimize-route',
        description: 'Optimize multi-stop collection routes',
        auth: true,
        request: {
          stops: [
            {
              id: 'string',
              name: 'string',
              lat: 'number',
              lng: 'number',
              address: 'string',
              timeWindow: { start: 'HH:MM', end: 'HH:MM' },
              serviceDuration: 'number',
              demand: 'number'
            }
          ],
          constraints: {
            vehicleCapacity: 'number',
            maxDrivingTime: 'number',
            maxDistance: 'number',
            adrClass: 'string',
            temperatureControl: 'boolean'
          },
          materialType: 'string',
          region: 'string'
        },
        response: {
          route: {
            stops: 'RouteStop[]',
            totalDistance: 'number',
            totalTime: 'number',
            totalCO2: 'number',
            segments: 'RouteSegment[]',
            warnings: 'string[]'
          },
          carriers: 'CarrierSuggestion[]'
        }
      }
    ]
  },
  {
    category: 'AI Agents',
    icon: Bot,
    endpoints: [
      {
        method: 'POST',
        path: '/api/agents/feedstock-matcher/match',
        description: 'Match suppliers with processors based on criteria',
        auth: true,
        request: {
          supplierId: 'string',
          materialType: 'string',
          quantity: 'number',
          location: { lat: 'number', lng: 'number' },
          preferences: {
            maxDistance: 'number',
            priceRange: { min: 'number', max: 'number' }
          }
        },
        response: {
          matches: [
            {
              processorId: 'string',
              score: 'number',
              distance: 'number',
              estimatedPrice: 'number',
              reasons: 'string[]'
            }
          ]
        }
      },
      {
        method: 'POST',
        path: '/api/agents/chat',
        description: 'Chat with AI agent',
        auth: true,
        request: {
          agentType: 'string',
          messages: [
            {
              role: 'user | assistant',
              content: 'string'
            }
          ]
        },
        response: {
          message: 'string',
          usage: {
            prompt_tokens: 'number',
            completion_tokens: 'number',
            total_cost: 'number'
          }
        }
      }
    ]
  }
]

export default function APIDocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'POST': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'PUT': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-mythic-primary to-mythic-accent bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-mythic-text-muted mt-2">
            Complete reference for the Genesis Reloop REST API
          </p>
        </div>

        {/* Quick Info */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-mythic-primary" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-mythic-text-primary mb-2">Base URL</h3>
              <code className="bg-mythic-dark-800 px-3 py-1 rounded text-mythic-primary">
                {process.env.NEXT_PUBLIC_BASE_URL || 'https://api.genesisreloop.com'}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-mythic-text-primary mb-2">Authentication</h3>
              <p className="text-sm text-mythic-text-muted mb-2">
                Most endpoints require authentication. Include the access token in the Authorization header:
              </p>
              <code className="bg-mythic-dark-800 px-3 py-1 rounded text-sm text-mythic-accent-300">
                Authorization: Bearer YOUR_ACCESS_TOKEN
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-mythic-text-primary mb-2">Rate Limiting</h3>
              <p className="text-sm text-mythic-text-muted">
                API requests are limited to 100 requests per minute per authenticated user.
                Rate limit headers are included in all responses.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        {apiEndpoints.map((category) => (
          <div key={category.category} className="mb-12">
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 flex items-center gap-2">
              <category.icon className="h-6 w-6 text-mythic-primary" />
              {category.category}
            </h2>
            
            <div className="space-y-6">
              {category.endpoints.map((endpoint, index) => (
                <Card key={index} className="bg-mythic-dark-900/50 border-mythic-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-mythic-text-primary font-mono">
                          {endpoint.path}
                        </code>
                      </div>
                      {endpoint.auth && (
                        <Badge variant="outline" className="border-mythic-primary/50">
                          <Shield className="h-3 w-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {endpoint.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="request" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="example">Example</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="request" className="mt-4">
                        {endpoint.request ? (
                          <div className="relative">
                            <CopyBlock
                              text={JSON.stringify(endpoint.request, null, 2)}
                              language="json"
                              theme={dracula}
                              showLineNumbers={false}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(
                                JSON.stringify(endpoint.request, null, 2),
                                `req-${index}`
                              )}
                            >
                              {copiedCode === `req-${index}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-mythic-text-muted">No request body required</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="response" className="mt-4">
                        <div className="relative">
                          <CopyBlock
                            text={JSON.stringify(endpoint.response, null, 2)}
                            language="json"
                            theme={dracula}
                            showLineNumbers={false}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(
                              JSON.stringify(endpoint.response, null, 2),
                              `res-${index}`
                            )}
                          >
                            {copiedCode === `res-${index}` ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="example" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-mythic-text-primary mb-2">
                              cURL Example
                            </h4>
                            <div className="relative">
                              <CopyBlock
                                text={`curl -X ${endpoint.method} \\
  ${process.env.NEXT_PUBLIC_BASE_URL || 'https://api.genesisreloop.com'}${endpoint.path} \\
  ${endpoint.auth ? '-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\' : ''}
  -H "Content-Type: application/json" \\
  ${endpoint.request ? `-d '${JSON.stringify(endpoint.request, null, 2)}'` : ''}`}
                                language="bash"
                                theme={dracula}
                                showLineNumbers={false}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(
                                  `curl -X ${endpoint.method} ${process.env.NEXT_PUBLIC_BASE_URL || 'https://api.genesisreloop.com'}${endpoint.path} ${endpoint.auth ? '-H "Authorization: Bearer YOUR_ACCESS_TOKEN"' : ''} -H "Content-Type: application/json" ${endpoint.request ? `-d '${JSON.stringify(endpoint.request, null, 2)}'` : ''}`,
                                  `curl-${index}`
                                )}
                              >
                                {copiedCode === `curl-${index}` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Error Responses */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
          <CardHeader>
            <CardTitle>Error Responses</CardTitle>
            <CardDescription>
              All endpoints return consistent error responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-2">Error Format</h4>
                <CopyBlock
                  text={JSON.stringify({
                    error: {
                      code: 'ERROR_CODE',
                      message: 'Human-readable error message',
                      details: {}
                    }
                  }, null, 2)}
                  language="json"
                  theme={dracula}
                  showLineNumbers={false}
                />
              </div>

              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-2">Common Error Codes</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">401</Badge>
                    <span className="text-sm text-mythic-text-muted">Unauthorized - Invalid or missing token</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">403</Badge>
                    <span className="text-sm text-mythic-text-muted">Forbidden - Insufficient permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">404</Badge>
                    <span className="text-sm text-mythic-text-muted">Not Found - Resource doesn't exist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">429</Badge>
                    <span className="text-sm text-mythic-text-muted">Too Many Requests - Rate limit exceeded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">500</Badge>
                    <span className="text-sm text-mythic-text-muted">Internal Server Error</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
