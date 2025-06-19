'use client'

import { useState, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Headline } from '@/lib/types'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  is_active: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export function HeadlineManagement() {
  const [headlines, setHeadlines] = useState<Headline[]>([])
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
      title: '',
      description: '',
      is_active: true,
    },
  })

  const fetchHeadlines = async () => {
    try {
      const response = await fetch('/api/headlines')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setHeadlines(data)
    } catch (error) {
      toast.error('Failed to fetch headlines')
    }
  }

  useEffect(() => {
    fetchHeadlines()
  }, [])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    try {
      const response = await fetch('/api/headlines' + (editingId ? `/${editingId}` : ''), {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      toast.success(editingId ? 'Headline updated successfully' : 'Headline created successfully')
      reset()
      setEditingId(null)
      fetchHeadlines()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save headline')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (headline: Headline) => {
    setEditingId(headline.id)
    reset({
      title: headline.title,
      description: headline.description || '',
      is_active: headline.is_active,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this headline?')) return

    try {
      const response = await fetch(`/api/headlines/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      toast.success('Headline deleted successfully')
      fetchHeadlines()
    } catch (error) {
      toast.error('Failed to delete headline')
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/headlines/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentState }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      fetchHeadlines()
    } catch (error) {
      toast.error('Failed to update headline status')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Headline Title"
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

          <div className="flex items-center space-x-2">
            <Switch
              checked={watch('is_active')}
              onCheckedChange={(checked: boolean) => setValue('is_active', checked)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={loading}>
            {editingId ? 'Update Headline' : 'Create Headline'}
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
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headlines.map((headline) => (
              <TableRow key={headline.id}>
                <TableCell>{headline.title}</TableCell>
                <TableCell>{headline.description}</TableCell>
                <TableCell>
                  <Switch
                    checked={headline.is_active}
                    onCheckedChange={() => handleToggleActive(headline.id, headline.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(headline)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(headline.id)}
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
