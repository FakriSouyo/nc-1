'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CaffeineTracker } from '@/components/dashboard/caffeine-tracker'
import { Coffee, Gift, Star, History, User, LogOut, Smartphone } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'
import Link from 'next/link'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { profile, signOut } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard()
      setDashboardData(data)
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="container mx-auto">
          <div className="text-center py-20">
            <Coffee className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
            <p>Loading your coffee dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div