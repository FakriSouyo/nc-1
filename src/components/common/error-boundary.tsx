// components/common/error-boundary.tsx

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold">Oops! Terjadi Kesalahan.</h1>
          <p className="mb-4 text-muted-foreground">
            Maaf, sesuatu yang tidak terduga terjadi.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Coba lagi
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary