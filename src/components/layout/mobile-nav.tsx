'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useAuthContext } from '@/components/auth/auth-provider'
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

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const { user } = useAuthContext()

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <span className="font-bold">Coffee Shop</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground rounded-md px-4 py-2 hover:text-primary hover:bg-muted my-1',
                    pathname === route.href && 'text-primary bg-muted'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
