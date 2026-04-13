// Supabase client for auth and Q&A features
import { createClient } from '@supabase/supabase-js'

// These are public/anon keys — safe to expose client-side
const supabaseUrl = 'https://kumzipqoicfgskrmzayc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bXppcHFvaWNmZ3Nrcm16YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMTM4NzgsImV4cCI6MjA5MTY4OTg3OH0.FfMNj-VYdpjfAezUyHPJZPxnMzGSJQg8uqsHFt0wFTU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Q&A data
export interface Question {
  id: string
  blog_slug: string
  user_id: string
  user_name: string
  user_avatar: string | null
  question_text: string
  created_at: string
  is_pinned: boolean
  upvotes: number
  answers?: Answer[]
}

export interface Answer {
  id: string
  question_id: string
  user_id: string
  user_name: string
  user_avatar: string | null
  answer_text: string
  created_at: string
  is_accepted: boolean
  upvotes: number
}
