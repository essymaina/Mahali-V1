import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Get the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

// Define the createClient function
export const createClient = (cookieStore) => {
  const options = cookieStore
    ? {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    : {}

  return supabaseCreateClient(supabaseUrl, supabaseAnonKey, options)
}

// Create a default client for client-side usage
export const supabase = createClient()
