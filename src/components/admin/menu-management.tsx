'use client'

import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MenuItem } from '@/lib/types'
import { z } from 'zod'
import { useMenu } from '@/hooks/use-menu'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const formSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(1000, 'Price must be at least 1000'),
  caffeine_content: z.number().min(0, 'Caffeine content cannot be negative'),
  is_available: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export function MenuManagement() {
  const { items, categories, addMenuItem, editMenuItem, removeMenuItem, refresh } = useMenu()
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: '',
      name: '',
      description: '',
      price: 0,
      caffeine_content: 0,
      is_available: true,
    },
  })

  useEffect(() => {
    refresh()
  }, [refresh])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    try {
      if (editingId) {
        await editMenuItem(editingId, data)
        toast.success('Menu item updated successfully')
      } else {
        await addMenuItem(data)
        toast.success('Menu item created successfully')
      }
      
      reset()
      setEditingId(null)
      refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id)
    reset({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      caffeine_content: item.caffeine_content,
      is_available: item.is_available,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      await removeMenuItem(id)
      toast.success('Menu item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete menu item')
    }
  }

  const handleToggleAvailable = async (id: string, currentState: boolean) => {
    try {
      await editMenuItem(id, { is_available: !currentState })
      refresh()
    } catch (error) {
      toast.error('Failed to update menu item status')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Select
              value={watch('category_id')}
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Menu Item Name"
              {...register('name')}
              className="mb-2"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description (optional)"
              {...register('description')}
              className="mb-2"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Price"
              {...register('price', { valueAsNumber: true })}
              className="mb-2"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Caffeine Content (mg)"
              {...register('caffeine_content', { valueAsNumber: true })}
              className="mb-2"
            />
            {errors.caffeine_content && (
              <p className="text-sm text-red-500">{errors.caffeine_content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={watch('is_available')}
              onCheckedChange={(checked: boolean) => setValue('is_available', checked)}
            />
            <span>Available</span>
          </div>

          <Button type="submit" disabled={loading}>
            {editingId ? 'Update Menu Item' : 'Create Menu Item'}
          </Button>
          
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null)
                reset()
              }}
              className="ml-2"
            >
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Caffeine</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category?.name}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{item.caffeine_content} mg</TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_available}
                    onCheckedChange={() => handleToggleAvailable(item.id, item.is_available)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
