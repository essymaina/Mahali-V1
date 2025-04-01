"use client"

import { type JSX, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Building, Calendar, ChevronRight, Clock, CreditCard, LogOut, MapPin, Settings, Star, User } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

// Define user type
interface User {
  firstName: string
  lastName: string
  email: string
  type: string
}

// Mock data for bookings
const PAST_BOOKINGS = [
  {
    id: "b1",
    workspaceId: "1",
    workspaceName: "Nairobi Garage",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Westlands",
    date: "2025-03-10",
    time: "09:00",
    table: "Hot Desk",
    people: 1,
    price: 1500,
    status: "completed",
  },
  {
    id: "b2",
    workspaceId: "3",
    workspaceName: "The Alchemist",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Westlands",
    date: "2025-02-25",
    time: "13:00",
    table: "Garden Table",
    people: 2,
    price: 1200,
    status: "completed",
  },
  {
    id: "b3",
    workspaceId: "2",
    workspaceName: "Java House",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Kilimani",
    date: "2025-02-15",
    time: "10:00",
    table: "Window Table",
    people: 1,
    price: 800,
    status: "completed",
  },
]

const UPCOMING_BOOKINGS = [
  {
    id: "b4",
    workspaceId: "5",
    workspaceName: "Karura Forest",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Karen",
    date: "2025-03-20",
    time: "11:00",
    table: "Picnic Area",
    people: 3,
    price: 500,
    status: "confirmed",
  },
]

const INCOMPLETE_BOOKINGS = [
  {
    id: "b5",
    workspaceId: "6",
    workspaceName: "iHub",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Kilimani",
    date: "2025-03-25",
    time: "09:00",
    table: "Hot Desk",
    people: 1,
    price: 1800,
    status: "pending_payment",
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem("mahali-user-auth")

    if (!authData) {
      router.push("/auth/user/login")
      return
    }

    const userData = JSON.parse(authData)

    if (userData.type !== "user") {
      router.push("/auth/user/login")
      return
    }

    setUser(userData)

    // Check if user is premium (mock implementation)
    const premiumStatus = localStorage.getItem("mahali-premium-status")
    setIsPremium(premiumStatus === "active")

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const formattedHour = hour % 12 || 12 // Convert 0 to 12 for midnight
    const period = hour >= 12 ? "PM" : "AM"
    return `${formattedHour}:${minutes} ${period}`
  }

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "completed":
        return <span className="badge badge-success">Completed</span>
      case "pending":
        return <span className="badge badge-warning">Pending</span>
      case "canceled":
        return <span className="badge badge-error">Canceled</span>
      default:
        return <span className="badge badge-info">Unknown</span>
        ;<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Confirmed
          </Badge>
        )
      case "pending_payment":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Payment Pending
          </Badge>
        )
    }
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

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="font-medium">
              EVENTS
            </Link>
            <Link href="/bookings" className="font-medium">
              BOOKINGS
            </Link>
            <Link href="/" className="font-medium">
              HOME
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                      {isPremium && (
                        <Badge variant="outline" className="ml-2 bg-[#0a1f56]/10 text-[#0a1f56] border-[#0a1f56]/20">
                          Premium
                        </Badge>
                      )}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user ? user.email : "No email available"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookings">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {!isPremium && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/premium" className="text-[#0a1f56] font-medium">
                        <Star className="mr-2 h-4 w-4 fill-[#0a1f56]" />
                        <span>Upgrade to Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/events">EVENTS</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bookings">BOOKINGS</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">HOME</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Bookings</h1>

          {!isPremium && (
            <Button
              onClick={() => router.push("/premium")}
              className="bg-gradient-to-r from-[#0a1f56] to-[#0a3f86] hover:from-[#0a1f56]/90 hover:to-[#0a3f86]/90 text-white"
            >
              <Star className="mr-2 h-4 w-4 fill-white" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {UPCOMING_BOOKINGS.length > 0 ? (
                UPCOMING_BOOKINGS.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48 md:h-auto">
                          <Image
                            src={booking.workspaceImage || "/placeholder.svg"}
                            alt={booking.workspaceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{booking.workspaceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(booking.date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(booking.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Table/Space</p>
                              <p className="font-medium">{booking.table}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">People</p>
                              <p className="font-medium">
                                {booking.people} {booking.people === 1 ? "Person" : "People"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total Paid</p>
                              <p className="text-lg font-bold">KSh {booking.price + Math.round(booking.price * 0.1)}</p>
                            </div>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => router.push(`/booking/${booking.workspaceId}`)}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500 mb-6">You don't have any upcoming workspace bookings</p>
                  <Button onClick={() => router.push("/")}>Find a Workspace</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="incomplete">
            <div className="grid gap-6">
              {INCOMPLETE_BOOKINGS.length > 0 ? (
                INCOMPLETE_BOOKINGS.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48 md:h-auto">
                          <Image
                            src={booking.workspaceImage || "/placeholder.svg"}
                            alt={booking.workspaceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{booking.workspaceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(booking.date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(booking.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Table/Space</p>
                              <p className="font-medium">{booking.table}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">People</p>
                              <p className="font-medium">
                                {booking.people} {booking.people === 1 ? "Person" : "People"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-lg font-bold">KSh {booking.price + Math.round(booking.price * 0.1)}</p>
                            </div>
                            <Button
                              className="flex items-center gap-2 bg-[#0a1f56] hover:bg-[#0a1f56]/90"
                              onClick={() => router.push(`/booking/${booking.workspaceId}/payment?date=custom`)}
                            >
                              <CreditCard className="h-4 w-4" />
                              Complete Payment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No incomplete bookings</h3>
                  <p className="text-gray-500 mb-6">You don't have any bookings waiting for payment</p>
                  <Button onClick={() => router.push("/")}>Find a Workspace</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid gap-6">
              {PAST_BOOKINGS.length > 0 ? (
                PAST_BOOKINGS.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48 md:h-auto">
                          <Image
                            src={booking.workspaceImage || "/placeholder.svg"}
                            alt={booking.workspaceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{booking.workspaceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(booking.date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(booking.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Table/Space</p>
                              <p className="font-medium">{booking.table}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">People</p>
                              <p className="font-medium">
                                {booking.people} {booking.people === 1 ? "Person" : "People"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Total Paid</p>
                              <p className="text-lg font-bold">KSh {booking.price + Math.round(booking.price * 0.1)}</p>
                            </div>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => router.push(`/booking/${booking.workspaceId}`)}
                            >
                              Book Again
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No past bookings</h3>
                  <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
                  <Button onClick={() => router.push("/")}>Find a Workspace</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

