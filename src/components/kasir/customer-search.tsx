'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/lib/types'
import { useDebounce } from '@/hooks/use-debounce'
import { Loading } from '@/components/common/loading'

interface CustomerSearchProps {
  onSelect: (customer: Profile) => void
}

export function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const supabase = createClient()

  const searchCustomers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .eq('role', 'user')
        .limit(5)

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Error searching customers:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Effect to handle debounced search
  useEffect(() => {
    searchCustomers(debouncedQuery)
  }, [debouncedQuery])

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search customer by name, email, or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={() => setQuery('')}>
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="py-8">
              <Loading text="Searching..." />
            </div>
          ) : results.length > 0 ? (
            results.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelect(customer)}
              >
                <div>
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  {customer.phone && (
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  Select
                </Button>
              </div>
            ))
          ) : query ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => window.location.href = '/register'}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register New Customer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
