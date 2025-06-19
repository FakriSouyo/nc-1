'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/components/auth/auth-provider'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart,
  Coffee,
  History,
  Home,
  Receipt,
  Settings,
  ShoppingBag,
  Ticket,
  Users,
} from 'lucide-react'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function Sidebar({ className, ...props }: SidebarNavProps) {
  const { user } = useAuthContext()
  const pathname = usePathname()

  const adminRoutes = [
    {
      href: '/admin',
      label: 'Overview',
      icon: Home,
    },
    {
      href: '/admin/menu',
      label: 'Menu',
      icon: Coffee,
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/vouchers',
      label: 'Vouchers',
      icon: Ticket,
    },
    {
      href: '/admin/headlines',
      label: 'Headlines',
      icon: ShoppingBag,
    },
    {
      href: '/admin/reports',
      label: 'Reports',
      icon: BarChart,
    },
  ]

  const kasirRoutes = [
    {
      href: '/kasir',
      label: 'New Order',
      icon: Receipt,
    },
    {
      href: '/kasir/orders',
      label: 'Orders',
      icon: History,
    },
  ]

  const userRoutes = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: Home,
    },
    {
      href: '/dashboard/history',
      label: 'History',
      icon: History,
    },
    {
      href: '/dashboard/vouchers',
      label: 'Vouchers',
      icon: Ticket,
    },
    {
      href: '/dashboard/shake',
      label: 'Shake',
      icon: Coffee,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: Settings,
    },
  ]

  const routes = user?.role === 'admin'
    ? adminRoutes
    : user?.role === 'kasir'
    ? kasirRoutes
    : userRoutes

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2',
              pathname === route.href
                ? 'bg-muted font-medium text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
