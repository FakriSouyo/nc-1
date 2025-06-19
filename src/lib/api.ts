import { createClient } from './supabase'
import {
  Database,
  MenuItem,
  OrderWithItems,
  UserVoucherWithVoucher,
  ShakeResult,
  CreateOrderData,
  DashboardData,
} from './types'

const supabase = createClient()

// Auth functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signUp(email: string, password: string, userData: {
  full_name: string
  phone: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

// Menu functions
export async function getMenuItems(): Promise<{ data: MenuItem[] | null, error: any }> {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_available', true)
    .order('name')
  
  return { data, error }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  return { data, error }
}

// Voucher functions
export async function getUserVouchers(userId: string): Promise<{ data: UserVoucherWithVoucher[] | null, error: any }> {
  const { data, error } = await supabase
    .from('user_vouchers')
    .select(`
      *,
      voucher:vouchers(*)
    `)
    .eq('user_id', userId)
    .eq('is_used', false)
    .order('obtained_at', { ascending: false })
  
  return { data, error }
}

// Shake voucher function
export async function shakeVoucher(): Promise<ShakeResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coffee-shop-api?action=shake-voucher`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to shake voucher')
    }

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to shake voucher',
      shake_count_remaining: 0,
    }
  }
}

// Order functions
export async function createOrder(orderData: CreateOrderData) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coffee-shop-api?action=process-order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    const result = await response.json()
    return result
  } catch (error) {
    throw error
  }
}

export async function getUserOrders(userId: string): Promise<{ data: OrderWithItems[] | null, error: any }> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        menu_item:menu_items(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Dashboard function
export async function getDashboardData(): Promise<{ data: DashboardData | null, error: any }> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coffee-shop-api?action=get-dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get dashboard data')
    }

    const result = await response.json()
    return { data: result.data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Admin functions
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'kasir') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export async function createMenuItem(menuItem: Database['public']['Tables']['menu_items']['Insert']) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(menuItem)
    .select()
    .single()
  
  return { data, error }
}

export async function updateMenuItem(id: string, updates: Database['public']['Tables']['menu_items']['Update']) {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
  
  return { error }
}

export async function createVoucher(voucher: Database['public']['Tables']['vouchers']['Insert']) {
  const { data, error } = await supabase
    .from('vouchers')
    .insert(voucher)
    .select()
    .single()
  
  return { data, error }
}

export async function getAllVouchers() {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function updateVoucher(id: string, updates: Database['public']['Tables']['vouchers']['Update']) {
  const { data, error } = await supabase
    .from('vouchers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function getHeadlines() {
  const { data, error } = await supabase
    .from('headlines')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getAllHeadlines() {
  const { data, error } = await supabase
    .from('headlines')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function createHeadline(headline: Database['public']['Tables']['headlines']['Insert']) {
  const { data, error } = await supabase
    .from('headlines')
    .insert(headline)
    .select()
    .single()
  
  return { data, error }
}

export async function updateHeadline(id: string, updates: Database['public']['Tables']['headlines']['Update']) {
  const { data, error } = await supabase
    .from('headlines')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function deleteHeadline(id: string) {
  const { error } = await supabase
    .from('headlines')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Point rewards functions
export async function getPointRewards() {
  const { data, error } = await supabase
    .from('point_rewards')
    .select('*')
    .eq('is_active', true)
    .order('points_required')
  
  return { data, error }
}

export async function redeemPointReward(rewardId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coffee-shop-api?action=redeem-points`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reward_id: rewardId }),
    })

    if (!response.ok) {
      throw new Error('Failed to redeem reward')
    }

    const result = await response.json()
    return result
  } catch (error) {
    throw error
  }
}

// Search functions
export async function searchUsers(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .limit(10)
  
  return { data, error }
}