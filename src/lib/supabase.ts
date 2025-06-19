import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'

export const createClient = () => createClientComponentClient<Database>()

export const createServerClient = () => createServerComponentClient<Database>({ cookies })

// For use in API routes
export const createServiceClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseServiceKey,
  })
}