"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building, Clock, Plus } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import  Navbar from "../../../components/navbar"
import { useAuth } from "../../../components/auth-context"
import { WorkspaceBookings } from "../../../components/workspace/bookings"

// Define workspace type
interface Workspace {
  id: string
  name: string
  location: string
  description: string
  status: string
  created_at: string
  [key: string]: any // For any other properties
}

// Define the User type with user_type
interface WorkspaceUser {
  id: string
  email: string
  user_type: string
  firstName?: string
  lastName?: string
}

export default function WorkspaceDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)

  useEffect(() => {
    // Fetch workspaces if user is logged in
    if (user && user.id) {
      fetchWorkspaces(user.id)
    }
  }, [user])

  const fetchWorkspaces = async (ownerId: string) => {
    try {
      setIsLoadingWorkspaces(true)
      const response = await fetch(`/api/workspaces?owner_id=${ownerId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setWorkspaces(data.workspaces || [])
      } else {
        console.error("Error fetching workspaces:", data.error)
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error)
    } finally {
      setIsLoadingWorkspaces(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  // Type guard to check if user has user_type property
  const isWorkspaceUser = (user: any): user is WorkspaceUser => {
    return user && typeof user.user_type === "string"
  }

  if (!user || !isWorkspaceUser(user) || user.user_type !== "workspace") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
          <Button onClick={() => router.push("/workspace/list")} className="bg-[#0a1f56] hover:bg-[#0a1f56]/90">
            <Plus className="mr-2 h-4 w-4" />
            List New Workspace
          </Button>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Your Workspace Listings</CardTitle>
                  <CardDescription>Manage your workspace listings and applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingWorkspaces ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
                    </div>
                  ) : workspaces.length > 0 ? (
                    <div className="space-y-4">
                      {workspaces.map((workspace) => (
                        <div key={workspace.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#0a1f56]/10 rounded-full flex items-center justify-center">
                                <Building className="h-5 w-5 text-[#0a1f56]" />
                              </div>
                              <div>
                                <h3 className="font-medium">{workspace.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {workspace.location.charAt(0).toUpperCase() + workspace.location.slice(1)}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                workspace.status === "approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : workspace.status === "pending"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-4">
                            {workspace.description.length > 150
                              ? workspace.description.substring(0, 150) + "..."
                              : workspace.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              <Clock className="inline-block h-4 w-4 mr-1" />
                              {workspace.status === "pending"
                                ? "Under review: 2-3 business days"
                                : `Listed on ${new Date(workspace.created_at).toLocaleDateString()}`}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/workspace/${workspace.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any workspace listings yet</p>
                      <Button onClick={() => router.push("/workspace/list")} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        List a New Workspace
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <WorkspaceBookings />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View performance metrics for your workspaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No analytics data available yet</p>
                    <p className="text-sm text-gray-500">
                      Analytics will be available once your workspace is approved and starts receiving bookings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}