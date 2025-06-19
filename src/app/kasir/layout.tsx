'use client'

import { useAuthContext } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter } from 'next/navigation'
import { LoadingPage } from '@/components/common/loading'
import { Receipt, History } from 'lucide-react'

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isKasir, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  if (loading) return <LoadingPage />
  
  if (!isKasir) {
    router.push('/login')
    return null
  }

  const currentTab = pathname === '/kasir' ? 'new' : 'history'

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kasir</h1>
        <Tabs value={currentTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="new"
              onClick={() => router.push('/kasir')}
              className="flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              New Order
            </TabsTrigger>
            <TabsTrigger
              value="history"
              onClick={() => router.push('/kasir/orders')}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Order History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  )
}
