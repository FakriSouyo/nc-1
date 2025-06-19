'use client'

import { useAuthContext } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Coffee, History, Receipt, Settings } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuthContext()
  const router = useRouter()

  const getStartedPath = user?.role === 'admin'
    ? '/admin'
    : user?.role === 'kasir'
    ? '/kasir'
    : '/dashboard'

  const features = [
    {
      title: 'Order Management',
      description: 'Create and manage orders with our intuitive interface.',
      icon: Receipt,
      path: user?.role === 'kasir' ? '/kasir' : '/dashboard/history',
    },
    {
      title: 'Menu Selection',
      description: 'Browse our wide selection of coffee and beverages.',
      icon: Coffee,
      path: user?.role === 'admin' ? '/admin/menu' : '/dashboard',
    },
    {
      title: 'Order History',
      description: 'Track your past orders and preferences.',
      icon: History,
      path: user?.role === 'kasir' ? '/kasir/orders' : '/dashboard/history',
    },
    {
      title: 'Account Settings',
      description: 'Manage your profile and preferences.',
      icon: Settings,
      path: '/dashboard/profile',
    },
  ]

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome to Coffee Shop
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Your one-stop destination for delicious coffee and beverages.
          {!user && ' Sign in to start ordering and tracking your coffee journey.'}
        </p>
        <div className="space-x-4">
          {!user ? (
            <>
              <Button onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => router.push('/register')}>
                Register
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push(getStartedPath)}>
              Get Started
            </Button>
          )}
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="p-6 cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => user && router.push(feature.path)}
          >
            <feature.icon className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
