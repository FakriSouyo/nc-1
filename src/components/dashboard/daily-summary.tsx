'use client'

import { Card } from '@/components/ui/card'
import { useDashboard } from '@/hooks/use-dashboard'
import { Newspaper, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export function DailySummary() {
  const { recentOrders, headlines } = useDashboard()
  const router = useRouter()

  const todayOrders = recentOrders.filter(order => {
    const orderDate = new Date(order.created_at)
    const today = new Date()
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    )
  })

  const totalSpent = todayOrders.reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <Card className="p-4">
      <div className="space-y-6">
        {/* Today's Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h3 className="font-semibold">Today&apos;s Summary</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/history')}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="text-2xl font-bold">{todayOrders.length}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">
                Rp {totalSpent.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5" />
            <h3 className="font-semibold">Headlines</h3>
          </div>

          <div className="space-y-3">
            {headlines.length > 0 ? (
              headlines.map((headline) => (
                <div
                  key={headline.id}
                  className="p-3 bg-muted/50 rounded-lg space-y-1"
                >
                  <p className="font-medium">{headline.title}</p>
                  {headline.description && (
                    <p className="text-sm text-muted-foreground">
                      {headline.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(headline.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No headlines to display
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
