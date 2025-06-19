'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuthContext } from './auth-provider'
import { registerSchema, type RegisterForm } from '@/lib/validations'
import { toast } from 'sonner'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      phone: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: data.full_name,
        phone: data.phone,
      })
      
      if (error) throw error

      toast.success('Registration successful! Please check your email to verify your account.')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="mb-2"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="mb-2"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Full Name"
            {...register('full_name')}
            className="mb-2"
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            {...register('phone')}
            className="mb-2"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
        </p>
      </form>
    </Card>
  )
}
