import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type FormField = {
  id: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'radio' | 'checkbox'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}
