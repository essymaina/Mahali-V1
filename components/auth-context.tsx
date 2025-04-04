"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from "next/navigation"

// Define our own Session type since we can't import from next-auth
interface Session {
  user?: {
    name?: string
    email?: string
    image?: string
    id?: string
  }
  expires: string
}

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: string
}

interface AuthContextProps {
  user: User | null
  session: Session | null
  loading: boolean
  isLoading: boolean // Added to match expected interface
  logout: () => Promise<void> // Added to match expected interface
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  isLoading: true, // Added to match expected interface
  logout: async () => {}, // Added to match expected interface
  refreshUser: async () => {},
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  // Mock session data for development
  useEffect(() => {
    // This simulates getting session data
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        id: "user_123",
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
    setSession(mockSession)
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      if (session?.user?.email) {
        // In a real app, you would fetch user data from your API
        // For now, we'll create a mock user based on the session
        const userData: User = {
          id: session.user.id || "user_123",
          name: session.user.name || "Test User",
          email: session.user.email,
          image: session.user.image,
          role: "user", // Default role
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const refreshUser = useCallback(async () => {
    setLoading(true)
    await fetchUser()
  }, [fetchUser])

  // Add logout function to match expected interface
  const logout = async () => {
    try {
      // In a real app with NextAuth, you would call signOut()
      // For now, we'll just clear the user state
      setUser(null)
      setSession(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading, // Map loading to isLoading
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)