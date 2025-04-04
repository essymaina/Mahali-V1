"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import { type Profile } from "@/lib/supabaseTypes"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

// Define proper types for our authentication system
type User = {
  user_type: string
  id: string
  email: string
  firstName?: string
  lastName?: string
  businessName?: string
  type: "user" | "owner" | string
  name?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isPremium: boolean
  session: Session | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    businessName: string | null,
    userType: "user" | "owner",
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isPremium: false,
  session: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const router = useRouter()

  // Function to fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      // Check if user has premium status
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .single()

      setIsPremium(!!subscriptionData)

      return data
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      return null
    }
  }

  // Function to create or update user profile
  const upsertProfile = async (
    userId: string,
    firstName: string,
    lastName: string,
    businessName: string | null,
    userType: "user" | "owner",
  ): Promise<boolean> => {
    try {
      // Ensure we have a valid userId
      if (!userId) {
        console.error("Error upserting profile: Missing user ID")
        return false
      }

      // Create the profile data object
      const profileData = {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        user_type: userType,
        // Don't include created_at as it has a default value in the database
      }

      // Log the profile data for debugging
      console.log("Upserting profile with data:", profileData)

      const { error } = await supabase.from("profiles").upsert(profileData, {
        onConflict: "id",
        ignoreDuplicates: false,
      })

      if (error) {
        console.error("Error upserting profile:", error.message, error.details, error.hint)
        return false
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        console.error("Exception in upsertProfile:", error.message)
      } else {
        console.error("Unknown error in upsertProfile:", error)
      }
      return false
    }
  }

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      setSession(currentSession)

      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id)

        if (profile) {
          const userData: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            firstName: profile.first_name || undefined,
            lastName: profile.last_name || undefined,
            businessName: profile.business_name || undefined,
            type: profile.user_type || "user",
            name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || undefined,
            user_type: ""
          }

          setUser(userData)
        } else {
          // If no profile exists yet, just use the basic auth data
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            type: "user",
          })
        }
      } else {
        setUser(null)
        setIsPremium(false)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      setIsPremium(false)
    }
  }

  // Check for session on mount and set up auth listener
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // Get initial session
        await refreshUser()

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession)

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            if (newSession?.user) {
              const profile = await fetchUserProfile(newSession.user.id)

              if (profile) {
                const userData: User = {
                  id: newSession.user.id,
                  email: newSession.user.email || "",
                  firstName: profile.first_name || undefined,
                  lastName: profile.last_name || undefined,
                  businessName: profile.business_name || undefined,
                  type: profile.user_type || "user",
                  name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || undefined,
                  user_type: ""
                }

                setUser(userData)
              } else {
                setUser({
                  id: newSession.user.id,
                  email: newSession.user.email || "",
                  type: "user",
                })
              }
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            setIsPremium(false)
          }
        })

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // User data will be set by the auth state change listener
        return { success: true }
      }

      return { success: false, error: "Unknown error occurred" }
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    businessName: string | null,
    userType: "user" | "owner",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Register the user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            business_name: businessName,
            user_type: userType,
          },
        },
      })

      if (signUpError) {
        return { success: false, error: signUpError.message }
      }

      if (!data.user) {
        return { success: false, error: "Failed to create user account" }
      }

      // Create a profile record
      console.log("Creating profile for user:", data.user.id)
      const profileSuccess = await upsertProfile(data.user.id, firstName, lastName, businessName, userType)

      if (!profileSuccess) {
        console.warn("Profile creation failed, but auth account was created")
        return {
          success: true,
          error: "Account created but profile setup failed. You may need to update your profile later.",
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error("Unexpected signup error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setIsPremium(false)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isPremium,
        session,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
