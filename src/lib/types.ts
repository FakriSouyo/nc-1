export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'user' | 'admin' | 'kasir'
          points: number
          daily_caffeine: number
          shake_count_weekly: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'kasir'
          points?: number
          daily_caffeine?: number
          shake_count_weekly?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'kasir'
          points?: number
          daily_caffeine?: number
          shake_count_weekly?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          caffeine_content: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          caffeine_content?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          caffeine_content?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vouchers: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          discount_type: 'percentage' | 'fixed' | 'free_item'
          discount_value: number
          min_purchase: number
          max_usage: number | null
          current_usage: number
          valid_from: string
          valid_until: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          discount_type: 'percentage' | 'fixed' | 'free_item'
          discount_value?: number
          min_purchase?: number
          max_usage?: number | null
          current_usage?: number
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed' | 'free_item'
          discount_value?: number
          min_purchase?: number
          max_usage?: number | null
          current_usage?: number
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          created_at?: string
        }
      }
      user_vouchers: {
        Row: {
          id: string
          user_id: string
          voucher_id: string
          is_used: boolean
          used_at: string | null
          obtained_at: string
        }
        Insert: {
          id?: string
          user_id: string
          voucher_id: string
          is_used?: boolean
          used_at?: string | null
          obtained_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          voucher_id?: string
          is_used?: boolean
          used_at?: string | null
          obtained_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          kasir_id: string | null
          total_amount: number
          points_earned: number
          voucher_used: string | null
          payment_method: string
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          kasir_id?: string | null
          total_amount: number
          points_earned?: number
          voucher_used?: string | null
          payment_method: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          kasir_id?: string | null
          total_amount?: number
          points_earned?: number
          voucher_used?: string | null
          payment_method?: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      point_rewards: {
        Row: {
          id: string
          title: string
          description: string | null
          points_required: number
          reward_type: 'voucher' | 'free_item' | 'discount'
          reward_value: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          points_required: number
          reward_type: 'voucher' | 'free_item' | 'discount'
          reward_value: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          points_required?: number
          reward_type?: 'voucher' | 'free_item' | 'discount'
          reward_value?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      headlines: {
        Row: {
          id: string
          title: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Additional types for the application

export type MenuItem = Database['public']['Tables']['menu_items']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row']
}

export interface OrderWithItems {
  id: string
  user_id: string
  kasir_id: string | null
  total_amount: number
  points_earned: number
  voucher_used: string | null
  payment_method: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  completed_at: string | null
  order_items: Array<{
    id: string
    order_id: string
    menu_item_id: string
    quantity: number
    price: number
    created_at: string
    menu_item: Database['public']['Tables']['menu_items']['Row']
  }>
  user?: Database['public']['Tables']['profiles']['Row']
}

export type UserVoucherWithVoucher = Database['public']['Tables']['user_vouchers']['Row'] & {
  voucher: Database['public']['Tables']['vouchers']['Row']
}

export interface ShakeResult {
  success: boolean
  voucher?: Database['public']['Tables']['vouchers']['Row']
  message: string
  shake_count_remaining: number
}

export interface OrderItem {
  menu_item_id: string
  quantity: number
  price: number
}

export interface CreateOrderData {
  user_id: string
  items: OrderItem[]
  voucher_code?: string
  payment_method: string
}

export interface DashboardData {
  user: Database['public']['Tables']['profiles']['Row']
  daily_caffeine: number
  points: number
  vouchers: UserVoucherWithVoucher[]
  recent_orders: OrderWithItems[]
  headlines: Database['public']['Tables']['headlines']['Row'][]
}

export type UserRole = 'user' | 'admin' | 'kasir'