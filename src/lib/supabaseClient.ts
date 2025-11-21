import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jmumjdejdhncycnxgkom.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdW1qZGVqZGhuY3ljbnhna29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDY0NzksImV4cCI6MjA3OTIyMjQ3OX0.Co1vLYDB8zFNT420HBc8Deqb7i9kzuznfRuIiYBwa14'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)