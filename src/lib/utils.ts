import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd MMM yyyy')
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'dd MMM yyyy, HH:mm')
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function calculateCaffeineLevel(amount: number): {
  level: 'low' | 'moderate' | 'high' | 'excessive'
  color: string
  percentage: number
} {
  const maxSafe = 400 // mg per day (FDA recommendation)
  const percentage = Math.min((amount / maxSafe) * 100, 100)
  
  let level: 'low' | 'moderate' | 'high' | 'excessive'
  let color: string
  
  if (amount <= 100) {
    level = 'low'
    color = 'bg-green-500'
  } else if (amount <= 200) {
    level = 'moderate'
    color = 'bg-yellow-500'
  } else if (amount <= 400) {
    level = 'high'
    color = 'bg-orange-500'
  } else {
    level = 'excessive'
    color = 'bg-red-500'
  }
  
  return { level, color, percentage }
}

export function calculatePoints(amount: number): number {
  // 1 point for every 1000 IDR spent
  return Math.floor(amount / 1000)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  return phoneRegex.test(phone)
}

export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `ORD-${timestamp}-${random}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidVoucherCode(code: string): boolean {
  // Basic validation for voucher codes
  const codeRegex = /^[A-Z0-9]{4,20}$/
  return codeRegex.test(code)
}

export function calculateDiscount(
  amount: number,
  discountType: 'percentage' | 'fixed' | 'free_item',
  discountValue: number
): number {
  switch (discountType) {
    case 'percentage':
      return Math.floor(amount * (discountValue / 100))
    case 'fixed':
      return Math.min(discountValue, amount)
    case 'free_item':
      return 0 // Free item discount is handled differently
    default:
      return 0
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'kasir':
      return 'Kasir'
    case 'user':
      return 'Customer'
    default:
      return 'Unknown'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}