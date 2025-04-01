import { createClient } from "@/lib/supabaseClient"
import { cookies } from "next/headers"

export async function getUserSession() {
  try {
    // This can throw in middleware or client components
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check the actual structure of the response
    const { data, error } = await supabase.auth.getUser()

    // Debug output to see the actual structure
    console.log("Auth response:", JSON.stringify({ data, error }, null, 2))

    if (error) {
      console.error("Auth error:", error)
      return null
    }

    // Make sure we're accessing the user correctly
    if (!data || !data.user) {
      console.log("No user found in auth response")
      return null
    }

    return data.user
  } catch (error) {
    console.error("Error in getUserSession:", error)
    return null
  }
}