'use client'

import { Card } from '@/components/ui/card'
import { useDashboard } from '@/hooks/use-dashboard'
import { Award, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function PointsDisplay() {
  const { pointsInfo } = useDashboard()
  const router = useRouter()

  if (!pointsInfo) return null

  const { current } = pointsInfo

  // Define reward tiers
  const tiers = [
    { points: 100, name: 'Bronze', reward: 'Free drink voucher' },
    { points: 300, name: 'Silver', reward: '10% discount voucher' },
    { points: 500, name: 'Gold', reward: '15% discount voucher' },
    { points: 1000, name: 'Platinum', reward: '20% discount voucher' },
  ]

  // Find current tier and next tier
  const currentTier = tiers.reduce((prev, curr) => 
    current >= curr.points ? curr : prev
  , tiers[0])

  const nextTier = tiers.find(tier => tier.points > current) || tiers[tiers.length - 1]
  const pointsToNext = nextTier.points - current

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5" />
        <h3 className="font-semibold">Reward Points</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{current}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-primary">{currentTier.name}</p>
            <p className="text-sm text-muted-foreground">Current Tier</p>
          </div>
        </div>

        {current < tiers[tiers.length - 1].points && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm">
              {pointsToNext} points until {nextTier.name} tier
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/vouchers')}
          >
            <Gift className="w-4 h-4" />
            View Rewards
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-2 rounded-lg ${
                current >= tier.points
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              <div className="font-medium">{tier.name}</div>
              <div className="text-xs">{tier.points} points</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
