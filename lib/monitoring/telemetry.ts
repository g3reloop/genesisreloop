import { BaseAgent } from '@/agents/base-agent'

export interface Metric {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: Date
}

export interface Event {
  name: string
  properties?: Record<string, any>
  timestamp?: Date
}

export interface Span {
  name: string
  startTime: Date
  endTime?: Date
  tags?: Record<string, string>
  status?: 'ok' | 'error'
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  message?: string
  lastCheck: Date
  metadata?: Record<string, any>
}

/**
 * Telemetry service for monitoring and observability
 */
export class TelemetryService {
  private static instance: TelemetryService
  private metrics: Metric[] = []
  private events: Event[] = []
  private spans: Map<string, Span> = new Map()
  private healthChecks: Map<string, HealthCheck> = new Map()
  
  // In production, these would be sent to services like:
  // - Metrics: Prometheus, CloudWatch, DataDog
  // - Events: Segment, Amplitude, MixPanel  
  // - Traces: Jaeger, Zipkin, X-Ray
  // - Health: Custom dashboard, StatusPage

  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService()
    }
    return TelemetryService.instance
  }

  /**
   * Record a metric (counter, gauge, histogram)
   */
  recordMetric(metric: Metric): void {
    const enrichedMetric = {
      ...metric,
      timestamp: metric.timestamp || new Date()
    }
    this.metrics.push(enrichedMetric)
    
    // In production, send to metrics backend
    if (process.env.NODE_ENV === 'production') {
      this.sendToMetricsBackend(enrichedMetric)
    }
    
    console.log(`📊 Metric: ${metric.name}=${metric.value}`, metric.tags)
  }

  /**
   * Track an event
   */
  trackEvent(event: Event): void {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || new Date()
    }
    this.events.push(enrichedEvent)
    
    // In production, send to analytics backend
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsBackend(enrichedEvent)
    }
    
    console.log(`📋 Event: ${event.name}`, event.properties)
  }

  /**
   * Start a trace span
   */
  startSpan(name: string, tags?: Record<string, string>): string {
    const spanId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const span: Span = {
      name,
      startTime: new Date(),
      tags,
      status: 'ok'
    }
    this.spans.set(spanId, span)
    return spanId
  }

  /**
   * End a trace span
   */
  endSpan(spanId: string, status: 'ok' | 'error' = 'ok'): void {
    const span = this.spans.get(spanId)
    if (!span) return
    
    span.endTime = new Date()
    span.status = status
    
    const duration = span.endTime.getTime() - span.startTime.getTime()
    
    // Record span duration as a metric
    this.recordMetric({
      name: `span.duration.${span.name}`,
      value: duration,
      tags: { ...span.tags, status }
    })
    
    // In production, send to tracing backend
    if (process.env.NODE_ENV === 'production') {
      this.sendToTracingBackend(span)
    }
    
    console.log(`⏱️  Span: ${span.name} completed in ${duration}ms (${status})`)
  }

  /**
   * Record a health check result
   */
  recordHealthCheck(check: HealthCheck): void {
    this.healthChecks.set(check.service, check)
    
    // Alert on status changes
    const previousCheck = this.healthChecks.get(check.service)
    if (previousCheck && previousCheck.status !== check.status) {
      this.trackEvent({
        name: 'health_status_changed',
        properties: {
          service: check.service,
          from: previousCheck.status,
          to: check.status,
          message: check.message
        }
      })
    }
    
    console.log(`💓 Health: ${check.service} is ${check.status}`, check.message)
  }

  /**
   * Monitor agent performance
   */
  monitorAgent(agent: BaseAgent): void {
    const agentName = agent.constructor.name
    
    // Record agent metrics
    this.recordMetric({
      name: 'agent.queue_depth',
      value: 0, // In production, get from queue
      tags: { agent: agentName }
    })
    
    // Track agent lifecycle events
    this.trackEvent({
      name: 'agent.started',
      properties: { agent: agentName }
    })
  }

  /**
   * Get current system health
   */
  getSystemHealth(): { overall: string; services: HealthCheck[] } {
    const services = Array.from(this.healthChecks.values())
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
    const degradedCount = services.filter(s => s.status === 'degraded').length
    
    let overall = 'healthy'
    if (unhealthyCount > 0) overall = 'unhealthy'
    else if (degradedCount > 0) overall = 'degraded'
    
    return { overall, services }
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(minutes: number = 5): Metric[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.metrics.filter(m => m.timestamp! >= cutoff)
  }

  /**
   * Performance monitoring decorator
   */
  static measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const telemetry = TelemetryService.getInstance()
    
    descriptor.value = async function (...args: any[]) {
      const spanId = telemetry.startSpan(`${target.constructor.name}.${propertyKey}`)
      
      try {
        const result = await originalMethod.apply(this, args)
        telemetry.endSpan(spanId, 'ok')
        return result
      } catch (error) {
        telemetry.endSpan(spanId, 'error')
        telemetry.trackEvent({
          name: 'method.error',
          properties: {
            class: target.constructor.name,
            method: propertyKey,
            error: error.message
          }
        })
        throw error
      }
    }
    
    return descriptor
  }

  /**
   * Alert on threshold breaches
   */
  checkThresholds(): void {
    // CPU usage threshold
    const cpuMetrics = this.getRecentMetrics(1)
      .filter(m => m.name === 'system.cpu.usage')
    
    const avgCpu = cpuMetrics.reduce((sum, m) => sum + m.value, 0) / cpuMetrics.length
    if (avgCpu > 80) {
      this.trackEvent({
        name: 'alert.cpu_high',
        properties: { value: avgCpu, threshold: 80 }
      })
    }
    
    // Queue depth threshold
    const queueMetrics = this.getRecentMetrics(5)
      .filter(m => m.name.startsWith('agent.queue_depth'))
    
    queueMetrics.forEach(metric => {
      if (metric.value > 1000) {
        this.trackEvent({
          name: 'alert.queue_depth_high',
          properties: {
            agent: metric.tags?.agent,
            value: metric.value,
            threshold: 1000
          }
        })
      }
    })
  }

  // Mock backend integrations
  private sendToMetricsBackend(metric: Metric): void {
    // In production: send to Prometheus, CloudWatch, etc.
  }

  private sendToAnalyticsBackend(event: Event): void {
    // In production: send to Segment, Amplitude, etc.
  }

  private sendToTracingBackend(span: Span): void {
    // In production: send to Jaeger, Zipkin, etc.
  }
}

/**
 * Global telemetry instance
 */
export const telemetry = TelemetryService.getInstance()

/**
 * Express middleware for HTTP request monitoring
 */
export function httpMonitoring() {
  return (req: any, res: any, next: any) => {
    const spanId = telemetry.startSpan('http.request', {
      method: req.method,
      path: req.path
    })
    
    const startTime = Date.now()
    
    // Override res.end to capture response
    const originalEnd = res.end
    res.end = function(...args: any[]) {
      const duration = Date.now() - startTime
      
      telemetry.endSpan(spanId, res.statusCode >= 400 ? 'error' : 'ok')
      
      telemetry.recordMetric({
        name: 'http.request.duration',
        value: duration,
        tags: {
          method: req.method,
          path: req.path,
          status: res.statusCode.toString()
        }
      })
      
      telemetry.recordMetric({
        name: 'http.request.count',
        value: 1,
        tags: {
          method: req.method,
          path: req.path,
          status: res.statusCode.toString()
        }
      })
      
      originalEnd.apply(res, args)
    }
    
    next()
  }
}
