'use client'

import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { useDashboard } from '@/hooks/use-dashboard'
import { Coffee } from 'lucide-react'

export function CaffeineTracker() {
  const { caffeineInfo } = useDashboard()

  if (!caffeineInfo) return null

  const { percentage, color, message, amount, maxSafe } = caffeineInfo

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="w-5 h-5" />
        <h3 className="font-semibold">Caffeine Tracker</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Daily Intake</span>
          <span className={`font-medium ${color}`}>
            {amount}mg / {maxSafe}mg
          </span>
        </div>

        <Progress value={percentage} className="h-2" />

        <p className={`text-sm ${color}`}>{message}</p>

        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <div className="font-medium text-green-600 dark:text-green-400">Safe</div>
            <div className="text-xs text-muted-foreground">0-100mg</div>
          </div>
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
            <div className="font-medium text-yellow-600 dark:text-yellow-400">Moderate</div>
            <div className="text-xs text-muted-foreground">101-200mg</div>
          </div>
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
            <div className="font-medium text-orange-600 dark:text-orange-400">High</div>
            <div className="text-xs text-muted-foreground">201-400mg</div>
          </div>
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
            <div className="font-medium text-red-600 dark:text-red-400">Excess</div>
            <div className="text-xs text-muted-foreground">{'>'}400mg</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
