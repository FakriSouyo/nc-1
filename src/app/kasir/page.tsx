'use client'

import { useState } from 'react'
import { CustomerSearch } from '@/components/kasir/customer-search'
import { OrderForm } from '@/components/kasir/order-form'
import { PaymentProcess } from '@/components/kasir/payment-process'
import { Profile, MenuItem } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function KasirPage() {
  const [step, setStep] = useState<'customer' | 'order' | 'payment'>('customer')
  const [customer, setCustomer] = useState<Profile | null>(null)
  const [orderItems, setOrderItems] = useState<Array<{ menu_item: MenuItem; quantity: number }>>([])
  const router = useRouter()

  const handleCustomerSelect = (selectedCustomer: Profile) => {
    setCustomer(selectedCustomer)
    setStep('order')
  }

  const handleOrderSubmit = (items: Array<{ menu_item: MenuItem; quantity: number }>) => {
    setOrderItems(items)
    setStep('payment')
  }

  const handlePaymentSuccess = () => {
    router.push('/kasir/orders')
  }

  const handleBack = () => {
    if (step === 'payment') {
      setStep('order')
    } else if (step === 'order') {
      setStep('customer')
      setCustomer(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'customer' && (
        <CustomerSearch onSelect={handleCustomerSelect} />
      )}

      {step === 'order' && customer && (
        <OrderForm
          customer={customer}
          onSubmit={handleOrderSubmit}
        />
      )}

      {step === 'payment' && customer && (
        <PaymentProcess
          customer={customer}
          items={orderItems}
          onSuccess={handlePaymentSuccess}
          onCancel={handleBack}
        />
      )}
    </div>
  )
}
