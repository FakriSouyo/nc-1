'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MenuItem, Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Loading } from '@/components/common/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaymentProcessProps {
  customer: Profile
  items: Array<{ menu_item: MenuItem; quantity: number }>
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentProcess({
  customer,
  items,
  onSuccess,
  onCancel,
}: PaymentProcessProps) {
  const [voucherCode, setVoucherCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [voucherLoading, setVoucherLoading] = useState(false)
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null)
  const supabase = createClient()

  const subtotal = items.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  )

  const checkVoucher = async () => {
    if (!voucherCode) return

    setVoucherLoading(true)
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucherCode)
        .eq('is_active', true)
        .single()

      if (error) throw error

      if (data) {
        // Check if voucher is valid
        const now = new Date()
        const validFrom = new Date(data.valid_from)
        const validUntil = new Date(data.valid_until)

        if (now < validFrom || now > validUntil) {
          toast.error('Voucher has expired')
          return
        }

        if (data.min_purchase > subtotal) {
          toast.error(`Minimum purchase amount: Rp ${data.min_purchase.toLocaleString('id-ID')}`)
          return
        }

        if (data.max_usage && data.current_usage >= data.max_usage) {
          toast.error('Voucher usage limit reached')
          return
        }

        setAppliedVoucher(data)
        toast.success('Voucher applied successfully')
      } else {
        toast.error('Invalid voucher code')
      }
    } catch (error) {
      toast.error('Failed to verify voucher')
    } finally {
      setVoucherLoading(false)
    }
  }

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0

    switch (appliedVoucher.discount_type) {
      case 'percentage':
        return Math.round((subtotal * appliedVoucher.discount_value) / 100)
      case 'fixed':
        return appliedVoucher.discount_value
      case 'free_item':
        // Implement free item logic if needed
        return 0
      default:
        return 0
    }
  }

  const total = subtotal - calculateDiscount()

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        user_id: customer.id,
        items: items.map(item => ({
          menu_item_id: item.menu_item.id,
          quantity: item.quantity,
          price: item.menu_item.price,
        })),
        voucher_code: appliedVoucher?.code,
        payment_method: paymentMethod,
      }

      // Create order in database
      const { error } = await supabase.rpc('create_order', orderData)

      if (error) throw error

      toast.success('Order completed successfully')
      onSuccess()
    } catch (error) {
      toast.error('Failed to process order')
      console.error('Order error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="space-y-2">
                {items.map(({ menu_item, quantity }) => (
                  <div key={menu_item.id} className="flex justify-between">
                    <span>
                      {quantity}x {menu_item.name}
                    </span>
                    <span>
                      Rp {(menu_item.price * quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter voucher code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                disabled={loading || !!appliedVoucher}
              />
              <Button
                variant="outline"
                onClick={checkVoucher}
                disabled={loading || !voucherCode || !!appliedVoucher}
              >
                {voucherLoading ? (
                  <Loading className="w-4 h-4" />
                ) : (
                  'Apply'
                )}
              </Button>
              {appliedVoucher && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAppliedVoucher(null)
                    setVoucherCode('')
                  }}
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Payment Method */}
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="debit">Debit Card</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
                <SelectItem value="transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            {/* Total Calculation */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- Rp {calculateDiscount().toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading || !paymentMethod}
          >
            {loading ? (
              <Loading className="w-4 h-4" />
            ) : (
              'Complete Order'
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
