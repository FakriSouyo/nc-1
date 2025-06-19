'use client'

import { Card } from '@/components/ui/card'
import { useDashboard } from '@/hooks/use-dashboard'
import { Ticket, Gift, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function VoucherList() {
  const { vouchers, shakeInfo, shake, shaking } = useDashboard()
  const router = useRouter()

  const handleShake = async () => {
    try {
      const result = await shake()
      
      if (result.success) {
        toast.success(
          <div className="flex flex-col gap-1">
            <p>Congratulations! 🎉</p>
            <p className="text-sm">You got a new voucher!</p>
          </div>
        )
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to shake for voucher')
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        {/* Shake Feature */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <h3 className="font-semibold">Daily Shake</h3>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Shake {shakeInfo?.remaining} more times today for a chance to win vouchers!
            </p>
            <Button
              className="w-full"
              onClick={handleShake}
              disabled={!shakeInfo?.canShake || shaking}
            >
              {shaking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Shaking...
                </>
              ) : (
                'Shake for Voucher'
              )}
            </Button>
            <div className="flex justify-center gap-2">
              {Array.from({ length: shakeInfo?.total || 0 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < (shakeInfo?.used || 0)
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Vouchers List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <h3 className="font-semibold">My Vouchers</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/vouchers')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {vouchers.length > 0 ? (
              vouchers.map(({ voucher, is_used }) => (
                <div
                  key={voucher.id}
                  className={`p-3 rounded-lg border ${
                    is_used ? 'bg-muted' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{voucher.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {voucher.description}
                      </p>
                    </div>
                    {is_used && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Used
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <code className="text-xs bg-muted-foreground/10 px-2 py-1 rounded">
                      {voucher.code}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Valid until{' '}
                      {new Date(voucher.valid_until).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No vouchers available
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
