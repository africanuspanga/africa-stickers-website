import { createBrowserClient } from "@supabase/ssr"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[v0] Supabase environment variables not found. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
  )
}

// Create a fallback client or null if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null
