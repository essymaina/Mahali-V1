"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, Clock, LogOut, Plus, Settings, User } from "lucide-react"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import WorkspaceBookings from "./bookings"

export default function WorkspaceDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is a workspace owner
    const authData = localStorage.getItem("mahali-user-auth")

    if (!authData) {
      router.push("/auth/workspace/login")
      return
    }

    const userData = JSON.parse(authData)

    if (userData.type !== "workspace") {
      router.push("/auth/workspace/login")
      return
    }

    setUser(userData)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white bg-[#0a1f56] px-4 py-2">MAHALI</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2"
              onClick={() => router.push("/workspace/list")}
            >
              <Plus className="h-4 w-4" />
              List New Workspace
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.businessName || "Business Name"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/workspace/list">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>List New Workspace</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workspace/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
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
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0a1f56]/10 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-[#0a1f56]" />
                          </div>
                          <div>
                            <h3 className="font-medium">Application under review</h3>
                            <p className="text-sm text-muted-foreground">Submitted on March 17, 2025</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Your workspace listing application is currently under review. You will receive an email
                        notification once the review is complete.
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          <Clock className="inline-block h-4 w-4 mr-1" />
                          Expected review time: 2-3 business days
                        </p>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any approved workspace listings yet</p>
                      <Button onClick={() => router.push("/workspace/list")} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        List a New Workspace
                      </Button>
                    </div>
                  </div>
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

