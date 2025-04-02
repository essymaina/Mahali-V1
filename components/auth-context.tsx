"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define proper types for our authentication system
type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mahali-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    if (email === "user@example.com" && password === "password") {
      const newUser: User = {
        id: "1",
        name: "Demo User",
        email: "user@example.com",
      }
      setUser(newUser)
      try {
        localStorage.setItem("mahali-user", JSON.stringify(newUser))
      } catch (error) {
        console.error("Error saving user to localStorage:", error)
      }
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("mahali-user")
    } catch (error) {
      console.error("Error removing user from localStorage:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}