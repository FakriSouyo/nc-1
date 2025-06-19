'use client'

import { useState, useEffect } from 'react'
import { DashboardData, ShakeResult } from '@/lib/types'
import { getDashboardData, shakeVoucher } from '@/lib/api'
import { useAuth } from './use-auth'

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  shaking: boolean
}

export function useDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
    shaking: false,
  })

  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setState({
        data: null,
        loading: false,
        error: 'Not authenticated',
        shaking: false,
      })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await getDashboardData()

      if (error) throw error

      setState({
        data,
        loading: false,
        error: null,
        shaking: false,
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        shaking: false,
      })
    }
  }

  const shake = async (): Promise<ShakeResult> => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: 'Not authenticated',
        shake_count_remaining: 0,
      }
    }

    setState(prev => ({ ...prev, shaking: true, error: null }))

    try {
      const result = await shakeVoucher()
      
      // Refresh dashboard data after successful shake
      if (result.success) {
        await fetchDashboardData()
      }

      setState(prev => ({ ...prev, shaking: false }))
      return result
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        shaking: false,
        error: error instanceof Error ? error.message : 'Shake failed'
      }))
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Shake failed',
        shake_count_remaining: 0,
      }
    }
  }

  const refresh = () => {
    fetchDashboardData()
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  // Calculate caffeine level info
  const caffeineInfo = state.data ? (() => {
    const amount = state.data.daily_caffeine
    const maxSafe = 400 // mg per day
    const percentage = Math.min((amount / maxSafe) * 100, 100)
    
    let level: 'low' | 'moderate' | 'high' | 'excessive'
    let color: string
    let message: string
    
    if (amount <= 100) {
      level = 'low'
      color = 'text-green-600'
      message = 'Rendah - Aman untuk konsumsi'
    } else if (amount <= 200) {
      level = 'moderate'
      color = 'text-yellow-600'
      message = 'Sedang - Masih aman'
    } else if (amount <= 400) {
      level = 'high'
      color = 'text-orange-600'
      message = 'Tinggi - Mendekati batas aman'
    } else {
      level = 'excessive'
      color = 'text-red-600'
      message = 'Berlebihan - Melebihi batas aman'
    }
    
    return { level, color, percentage, message, amount, maxSafe }
  })() : null

  // Calculate shake availability
  const shakeInfo = state.data ? (() => {
    const remaining = Math.max(0, 3 - (state.data?.user?.shake_count_weekly || 0))
    const canShake = remaining > 0
    
    return {
      remaining,
      canShake,
      used: state.data?.user?.shake_count_weekly || 0,
      total: 3,
    }
  })() : null

  // Points info
  const pointsInfo = state.data ? {
    current: state.data.points,
    // You can add more points-related calculations here
  } : null

  return {
    ...state,
    shake,
    refresh,
    caffeineInfo,
    shakeInfo,
    pointsInfo,
    user: state.data?.user || null,
    vouchers: state.data?.vouchers || [],
    recentOrders: state.data?.recent_orders || [],
    headlines: state.data?.headlines || [],
  }
}