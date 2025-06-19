import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, Users, Gift, BarChart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">CoffeeShop</span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Your Coffee Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your caffeine, collect points, shake for vouchers, and enjoy the perfect coffee experience.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Coffee className="h-12 w-12 text-amber-600 mb-4" />
              <CardTitle>Caffeine Tracking</CardTitle>
              <CardDescription>
                Monitor your daily caffeine intake and stay healthy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Gift className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Shake for Vouchers</CardTitle>
              <CardDescription>
                Shake your phone 3 times per week to get amazing discounts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Points & Rewards</CardTitle>
              <CardDescription>
                Earn points with every purchase and redeem for rewards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>
                Keep track of your orders and coffee preferences
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Coffee Adventure?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of coffee lovers who are already tracking their caffeine and earning rewards.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Create Account Now</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Coffee Shop App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}