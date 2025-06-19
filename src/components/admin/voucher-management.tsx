'use client'

import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Voucher } from '@/lib/types'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const formSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{4,20}$/, 'Code must be 4-20 uppercase letters/numbers'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed', 'free_item']),
  discount_value: z.number().min(0, 'Discount value cannot be negative'),
  min_purchase: z.number().min(0, 'Minimum purchase cannot be negative'),
  max_usage: z.number().nullable(),
  valid_from: z.string(),
  valid_until: z.string(),
  is_active: z.boolean(),
}).refine(
  (data) => new Date(data.valid_until) > new Date(data.valid_from),
  {
    message: 'End date must be after start date',
    path: ['valid_until'],
  }
).refine(
  (data) => {
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      return false
    }
    return true
  },
  {
    message: 'Percentage discount cannot be more than 100%',
    path: ['discount_value'],
  }
)

type FormData = z.infer<typeof formSchema>

export function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
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
      code: '',
      title: '',
      description: '',
      discount_type: 'fixed',
      discount_value: 0,
      min_purchase: 0,
      max_usage: null,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
    },
  })

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/vouchers')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setVouchers(data)
    } catch (error) {
      toast.error('Failed to fetch vouchers')
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    try {
      const response = await fetch('/api/vouchers' + (editingId ? `/${editingId}` : ''), {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      toast.success(editingId ? 'Voucher updated successfully' : 'Voucher created successfully')
      reset()
      setEditingId(null)
      fetchVouchers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save voucher')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (voucher: Voucher) => {
    setEditingId(voucher.id)
    reset({
      code: voucher.code,
      title: voucher.title,
      description: voucher.description || '',
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      min_purchase: voucher.min_purchase,
      max_usage: voucher.max_usage,
      valid_from: new Date(voucher.valid_from).toISOString().split('T')[0],
      valid_until: new Date(voucher.valid_until).toISOString().split('T')[0],
      is_active: voucher.is_active,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return

    try {
      const response = await fetch(`/api/vouchers/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      toast.success('Voucher deleted successfully')
      fetchVouchers()
    } catch (error) {
      toast.error('Failed to delete voucher')
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/vouchers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentState }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      fetchVouchers()
    } catch (error) {
      toast.error('Failed to update voucher status')
    }
  }

  const formatDiscount = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`
      case 'fixed':
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(value)
      case 'free_item':
        return 'Free Item'
      default:
        return value.toString()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Voucher Code"
              {...register('code')}
              className="mb-2"
              disabled={!!editingId}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Voucher Title"
              {...register('title')}
              className="mb-2"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
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
            <Select
              value={watch('discount_type')}
              onValueChange={(value: 'percentage' | 'fixed' | 'free_item') => setValue('discount_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="free_item">Free Item</SelectItem>
              </SelectContent>
            </Select>
            {errors.discount_type && (
              <p className="text-sm text-red-500">{errors.discount_type.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Discount Value"
              {...register('discount_value', { valueAsNumber: true })}
              className="mb-2"
            />
            {errors.discount_value && (
              <p className="text-sm text-red-500">{errors.discount_value.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Minimum Purchase"
              {...register('min_purchase', { valueAsNumber: true })}
              className="mb-2"
            />
            {errors.min_purchase && (
              <p className="text-sm text-red-500">{errors.min_purchase.message}</p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Maximum Usage (optional)"
              {...register('max_usage', { valueAsNumber: true })}
              className="mb-2"
            />
            {errors.max_usage && (
              <p className="text-sm text-red-500">{errors.max_usage.message}</p>
            )}
          </div>

          <div>
            <Input
              type="date"
              {...register('valid_from')}
              className="mb-2"
            />
            {errors.valid_from && (
              <p className="text-sm text-red-500">{errors.valid_from.message}</p>
            )}
          </div>

          <div>
            <Input
              type="date"
              {...register('valid_until')}
              className="mb-2"
            />
            {errors.valid_until && (
              <p className="text-sm text-red-500">{errors.valid_until.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={watch('is_active')}
              onCheckedChange={(checked: boolean) => setValue('is_active', checked)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={loading}>
            {editingId ? 'Update Voucher' : 'Create Voucher'}
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
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.title}</TableCell>
                <TableCell>{formatDiscount(voucher.discount_type, voucher.discount_value)}</TableCell>
                <TableCell>{new Date(voucher.valid_until).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch
                    checked={voucher.is_active}
                    onCheckedChange={() => handleToggleActive(voucher.id, voucher.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(voucher)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(voucher.id)}
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
