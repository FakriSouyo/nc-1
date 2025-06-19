'use client'

import { useState, useEffect } from 'react'
import { OrderWithItems, CreateOrderData, MenuItem, Database } from '@/lib/types'
import { createOrder, getUserOrders } from '@/lib/api'
import { useAuth } from './use-auth'

// Define a type that includes all required menu item properties
type MenuItemType = Database['public']['Tables']['menu_items']['Row']

interface CartItem {
  menu_item: MenuItemType & { id: string; price: number; caffeine_content: number };
  quantity: number;
  subtotal: number;
}

interface OrdersState {
  orders: OrderWithItems[]
  cart: CartItem[]
  loading: boolean
  error: string | null
  submitting: boolean
}

interface UseOrdersReturn extends OrdersState {
  addToCart: (menuItem: MenuItemType, quantity?: number) => void
  updateCartItem: (menuItemId: string, quantity: number) => void
  removeFromCart: (menuItemId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  getTotalCaffeine: () => number
  submitOrder: (orderData: Omit<CreateOrderData, 'items'>) => Promise<{ data: any; error: string | null }>
  fetchUserOrders: () => Promise<void>
  getOrderTotal: (order: OrderWithItems) => number
  getOrderStatus: (status: string) => string
  getOrderItemCount: (order: OrderWithItems) => number
  getOrderByDateRange: (startDate: Date, endDate: Date) => OrderWithItems[]
  getRecentOrders: (limit?: number) => OrderWithItems[]
  getOrderById: (orderId: string) => OrderWithItems | undefined
  getOrdersByStatus: (status: string) => OrderWithItems[]
  getTotalSales: () => number
  getOrderCountByStatus: (status: string) => number
  getUserOrders: () => OrderWithItems[]
}

export function useOrders(): UseOrdersReturn {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<OrdersState>({
    orders: [],
    cart: [],
    loading: false,
    error: null,
    submitting: false,
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrders()
    }
  }, [isAuthenticated, user])

  const fetchUserOrders = async (): Promise<void> => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call the API to get user orders
      const response = await getUserOrders();
      
      // Type guard to check if response is an error
      if ('error' in response) {
        throw response.error || new Error('Unknown error occurred');
      }
      
      // Type guard to check if response has data
      if (!('data' in response) || !response.data) {
        throw new Error('No data returned from server');
      }

      setState(prev => ({
        ...prev,
        orders: Array.isArray(response.data) ? response.data : [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        loading: false,
      }))
    }
  }

  const addToCart = (menuItem: MenuItemType, quantity: number = 1) => {
    setState(prev => {
      const existingItem = prev.cart.find(item => item.menu_item.id === menuItem.id)
      
      if (existingItem) {
        // Update existing item
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.menu_item.id === menuItem.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * menuItem.price,
                }
              : item
          ),
        }
      } else {
        // Add new item
        return {
          ...prev,
          cart: [
            ...prev.cart,
            {
              menu_item: menuItem,
              quantity,
              subtotal: quantity * menuItem.price,
            },
          ],
        }
      }
    })
  }

  const updateCartItem = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId)
      return
    }

    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.menu_item.id === menuItemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.menu_item.price,
            }
          : item
      ),
    }))
  }

  const removeFromCart = (menuItemId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.menu_item.id !== menuItemId),
    }))
  }

  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [] }))
  }

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + item.subtotal, 0)
  }

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0)
  }

  const getTotalCaffeine = () => {
    return state.cart.reduce(
      (total, item) => total + (item.menu_item.caffeine_content * item.quantity),
      0
    )
  }

  const submitOrder = async (orderData: Omit<CreateOrderData, 'items'>) => {
    if (state.cart.length === 0) {
      return { data: null, error: 'Cart is empty' }
    }

    setState(prev => ({ ...prev, submitting: true, error: null }))

    try {
      const items = state.cart.map(item => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
        price: item.menu_item.price,
      }))

      const { data, error } = await createOrder({
        ...orderData,
        items,
      })

      if (error) throw error

      // Clear cart on successful order
      clearCart()
      
      // Refresh orders
      await fetchUserOrders()

      setState(prev => ({ ...prev, submitting: false }))
      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit order'
      setState(prev => ({ ...prev, error: errorMessage, submitting: false }))
      return { data: null, error: errorMessage }
    }
  }

  /**
   * Calculate the total amount of an order including all items
   */
  const getOrderTotal = (order: OrderWithItems): number => {
    if (!order.order_items) return 0;
    return order.order_items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Format order status for display
   */
  const getOrderStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Menunggu',
      'processing': 'Diproses',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan',
    }
    return statusMap[status.toLowerCase()] || status;
  }

  /**
   * Get total number of items in an order
   */
  const getOrderItemCount = (order: OrderWithItems): number => {
    if (!order.order_items) return 0;
    return order.order_items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Filter orders by date range
   */
  const getOrderByDateRange = (startDate: Date, endDate: Date): OrderWithItems[] => {
    return state.orders.filter(order => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  /**
   * Get most recent orders
   */
  const getRecentOrders = (limit: number = 5): OrderWithItems[] => {
    return [...state.orders]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Find order by ID
   */
  const getOrderById = (orderId: string): OrderWithItems | undefined => {
    return state.orders.find(order => order.id === orderId);
  }

  /**
   * Filter orders by status
   */
  const getOrdersByStatus = (status: string): OrderWithItems[] => {
    return state.orders.filter(order => 
      order.status && order.status.toLowerCase() === status.toLowerCase()
    );
  }

  /**
   * Calculate total sales amount
   */
  const getTotalSales = (): number => {
    return state.orders.reduce((total, order) => {
      return total + (order.total_amount || 0);
    }, 0);
  }

  /**
   * Get orders count by status
   */
  const getOrderCountByStatus = (status: string): number => {
    return getOrdersByStatus(status).length;
  }

  /**
   * Get orders for current user
   */
  const getUserOrders = (): OrderWithItems[] => {
    return user ? state.orders.filter(order => order.user_id === user.id) : [];
  }

  // Return all the functions and state
  return {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getTotalCaffeine,
    submitOrder,
    fetchUserOrders,
    getOrderTotal,
    getOrderStatus,
    getOrderItemCount,
    getOrderByDateRange,
    getRecentOrders,
    getOrderById,
    getOrdersByStatus,
    getTotalSales,
    getOrderCountByStatus,
    getUserOrders,
  };
}