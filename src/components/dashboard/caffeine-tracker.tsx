'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Coffee, AlertTriangle, CheckCircle } from 'lucide-react'

interface CaffeineTrackerProps {
  dailyCaffeine: number
  totalCaffeine: number
}

export function CaffeineTracker({ dailyCaffeine, totalCaffeine }: CaffeineTrackerProps) {
  const maxDailyCaffeine = 400 // mg
  const percentage = (dailyCaffeine / maxDailyCaffeine) * 100
  
  const getStatus = () => {
    if (percentage < 50) return { color: 'green', text: 'Safe', icon: CheckCircle }
    if (percentage < 80) return { color: 'yellow', text: 'Moderate', icon: Coffee }
    return { color: 'red', text: 'High', icon: AlertTriangle }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Caffeine Tracker
            </CardTitle>
            <CardDescription>Daily caffeine intake monitoring</CardDescription>
          </div>
          <Badge variant={status.color === 'green' ? 'default' : status.color === 'yellow' ? 'secondary' : 'destructive'}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Today: {dailyCaffeine}mg</span>
            <span className="text-sm text-muted-foreground">Limit: {maxDailyCaffeine}mg</span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
        </div>
        
        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Total consumed: {totalCaffeine}mg
          </div>
        </div>
      </CardContent>
    </Card>
  )
}