'use client'

import { CaffeineTracker } from '@/components/dashboard/caffeine-tracker'
import { DailySummary } from '@/components/dashboard/daily-summary'
import { PointsDisplay } from '@/components/dashboard/points-display'
import { VoucherList } from '@/components/dashboard/voucher-list'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { LoadingPage } from '@/components/common/loading'
import { useDashboard } from '@/hooks/use-dashboard'
import { ErrorDisplay } from '@/components/common/error-boundary'

export default function DashboardPage() {
  const { loading, error } = useDashboard()

  if (loading) return <LoadingPage />
  if (error) return <ErrorDisplay error={error} />

  return (
    <ErrorBoundary>
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <CaffeineTracker />
            <PointsDisplay />
          </div>
          <div className="space-y-6">
            <DailySummary />
            <VoucherList />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}