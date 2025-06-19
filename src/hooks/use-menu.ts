'use client'

import { useState, useEffect } from 'react'
import { MenuItem, Database } from '@/lib/types'
import { 
  getMenuItems, 
  getCategories, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '@/lib/api'

type Category = Database['public']['Tables']['categories']['Row']

interface MenuState {
  items: MenuItem[]
  categories: Category[]
  loading: boolean
  error: string | null
}

export function useMenu() {
  const [state, setState] = useState<MenuState>({
    items: [],
    categories: [],
    loading: true,
    error: null,
  })

  const fetchMenuItems = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await getMenuItems()

      if (error) throw error

      setState(prev => ({
        ...prev,
        items: data || [],
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch menu items',
        loading: false,
      }))
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await getCategories()

      if (error) throw error

      setState(prev => ({
        ...prev,
        categories: data || [],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      }))
    }
  }

  const addMenuItem = async (menuItem: Database['public']['Tables']['menu_items']['Insert']) => {
    try {
      const { data, error } = await createMenuItem(menuItem)

      if (error) throw error

      setState(prev => ({
        ...prev,
        items: [...prev.items, data as MenuItem],
      }))

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create menu item'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { data: null, error: errorMessage }
    }
  }

  const editMenuItem = async (id: string, updates: Database['public']['Tables']['menu_items']['Update']) => {
    try {
      const { data, error } = await updateMenuItem(id, updates)

      if (error) throw error

      setState(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === id ? { ...item, ...data } : item
        ),
      }))

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update menu item'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { data: null, error: errorMessage }
    }
  }

  const removeMenuItem = async (id: string) => {
    try {
      const { error } = await deleteMenuItem(id)

      if (error) throw error

      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }))

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete menu item'
      setState(prev => ({ ...prev, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const getItemsByCategory = (categoryId: string) => {
    return state.items.filter(item => item.category_id === categoryId)
  }

  const searchItems = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return state.items.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getAvailableItems = () => {
    return state.items.filter(item => item.is_available)
  }

  const getCategoryName = (categoryId: string) => {
    const category = state.categories.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  // Group items by category
  const itemsByCategory = state.categories.reduce((acc, category) => {
    acc[category.id] = {
      category,
      items: getItemsByCategory(category.id),
    }
    return acc
  }, {} as Record<string, { category: Category; items: MenuItem[] }>)

  const refresh = () => {
    fetchMenuItems()
    fetchCategories()
  }

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  return {
    ...state,
    addMenuItem,
    editMenuItem,
    removeMenuItem,
    getItemsByCategory,
    searchItems,
    getAvailableItems,
    getCategoryName,
    itemsByCategory,
    refresh,
  }
}