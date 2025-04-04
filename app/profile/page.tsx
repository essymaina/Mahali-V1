"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Name</p>
            <p className="text-lg">
              {user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          {user.businessName && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Business</p>
              <p className="text-lg">{user.businessName}</p>
            </div>
          )}
          {user.type && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Type</p>
              <p className="text-lg capitalize">{user.type}</p>
            </div>
          )}
          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}