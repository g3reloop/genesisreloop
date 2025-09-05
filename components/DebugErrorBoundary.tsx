'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  name: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class DebugErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[${this.props.name}] Error caught:`, error)
    console.error(`[${this.props.name}] Error info:`, errorInfo)
    console.error(`[${this.props.name}] Component stack:`, errorInfo.componentStack)
    
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <h3 className="text-red-500 font-bold mb-2">Error in {this.props.name}</h3>
          <pre className="text-xs text-red-400 overflow-auto">
            {this.state.error?.message}
          </pre>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-400">Stack trace</summary>
              <pre className="text-xs text-red-300 overflow-auto mt-2">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
