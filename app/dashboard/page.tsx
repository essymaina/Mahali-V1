"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Building, Calendar, Plus, Users } from "lucide-react"
import Link from "next/link"

export default function OwnerDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in or not an owner
  useEffect(() => {
    if (!isLoading && (!user || user.type !== "owner")) {
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

  if (!user || user.type !== "owner") {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your workspaces and bookings</p>
        </div>
        <Button asChild>
          <Link href="/workspaces/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New Workspace
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Add your first workspace to start receiving bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No bookings yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No customers yet</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to set up your workspace business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
            <div>
              <h3 className="font-semibold">Add your first workspace</h3>
              <p className="text-sm text-muted-foreground">
                Create a detailed listing for your workspace with photos, amenities, and pricing.
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/workspaces/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Workspace
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
            <div>
              <h3 className="font-semibold">Set up your business profile</h3>
              <p className="text-sm text-muted-foreground">
                Complete your business profile to build trust with potential customers.
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/settings">Update Profile</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
            <div>
              <h3 className="font-semibold">Set up payment methods</h3>
              <p className="text-sm text-muted-foreground">Configure how you'll receive payments from bookings.</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/settings/payments">Set Up Payments</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}