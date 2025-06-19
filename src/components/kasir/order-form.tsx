'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import { MenuItem, Profile } from '@/lib/types'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Loading } from '@/components/common/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderFormProps {
  customer: Profile
  onSubmit: (items: Array<{ menu_item: MenuItem; quantity: number }>) => void
}

export function OrderForm({ customer, onSubmit }: OrderFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [orderItems, setOrderItems] = useState<Array<{ menu_item: MenuItem; quantity: number }>>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Load menu items and categories
  useEffect(() => {
    async function loadData() {
      try {
        const [menuResult, categoryResult] = await Promise.all([
          supabase
            .from('menu_items')
            .select('*, category:categories(*)')
            .eq('is_available', true),
          supabase
            .from('categories')
            .select('*')
        ])

        if (menuResult.error) throw menuResult.error
        if (categoryResult.error) throw categoryResult.error

        setMenuItems(menuResult.data)
        setCategories(categoryResult.data)
      } catch (error) {
        console.error('Error loading menu:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems

  const addToOrder = (menuItem: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.menu_item.id === menuItem.id)
      if (existing) {
        return prev.map(item =>
          item.menu_item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { menu_item: menuItem, quantity: 1 }]
    })
  }

  const updateQuantity = (menuItemId: string, change: number) => {
    setOrderItems(prev => {
      return prev.map(item => {
        if (item.menu_item.id === menuItemId) {
          const newQuantity = Math.max(0, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  )

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <Loading text="Loading menu..." />
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Menu Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2">
            {filteredMenuItems.map(item => (
              <Button
                key={item.id}
                variant="outline"
                className="h-auto py-4 px-3 flex flex-col items-start text-left"
                onClick={() => addToOrder(item)}
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order Summary</h3>
            <p className="text-sm text-muted-foreground">
              Customer: {customer.full_name}
            </p>
          </div>

          <div className="space-y-2">
            {orderItems.map(({ menu_item, quantity }) => (
              <div
                key={menu_item.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{menu_item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Rp {menu_item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(menu_item.id, -1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 0
                      setOrderItems(prev =>
                        prev.map(item =>
                          item.menu_item.id === menu_item.id
                            ? { ...item, quantity: Math.max(0, newQuantity) }
                            : item
                        ).filter(item => item.quantity > 0)
                      )
                    }}
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(menu_item.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(menu_item.id, -quantity)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <Button
              className="w-full"
              disabled={orderItems.length === 0}
              onClick={() => onSubmit(orderItems)}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
