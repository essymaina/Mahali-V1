"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-context"
import { Navbar } from "@/components/navbar"

// Define booking type
interface Booking {
  id: string
  workspaceName: string
  location: string
  date: string
  startTime: string
  endTime: string
  status: "upcoming" | "completed" | "cancelled"
  image: string
}

// Mock data for bookings - in a real app, you would fetch this from an API
const BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    workspaceName: "Nairobi Garage",
    location: "Westlands",
    date: "2025-04-15",
    startTime: "09:00",
    endTime: "17:00",
    status: "upcoming",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "booking-2",
    workspaceName: "iHub",
    location: "Kilimani",
    date: "2025-04-20",
    startTime: "10:00",
    endTime: "16:00",
    status: "upcoming",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "booking-3",
    workspaceName: "Workstyle",
    location: "Karen",
    date: "2025-03-28",
    startTime: "09:00",
    endTime: "18:00",
    status: "completed",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "booking-4",
    workspaceName: "The Mint Hub",
    location: "Lavington",
    date: "2025-03-15",
    startTime: "08:00",
    endTime: "14:00",
    status: "cancelled",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("upcoming")

  useEffect(() => {
    // Check if user is logged in
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const getFilteredBookings = (status: string) => {
    return BOOKINGS.filter((booking) => booking.status === status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {getFilteredBookings("upcoming").length > 0 ? (
                <div className="space-y-4">
                  {getFilteredBookings("upcoming").map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg overflow-hidden flex flex-col md:flex-row bg-white"
                    >
                      <div className="relative w-full md:w-48 h-32">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.workspaceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{booking.workspaceName}</h3>
                          <Badge className="w-fit bg-green-500">Upcoming</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/bookings/reschedule/${booking.id}`)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => router.push(`/bookings/cancel/${booking.id}`)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                  <p className="text-gray-500 mb-4">You don't have any upcoming workspace bookings</p>
                  <Button className="bg-[#0a1f56] hover:bg-[#0a1f56]/90" asChild>
                    <Link href="/">Find a Workspace</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {getFilteredBookings("completed").length > 0 ? (
                <div className="space-y-4">
                  {getFilteredBookings("completed").map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg overflow-hidden flex flex-col md:flex-row bg-white"
                    >
                      <div className="relative w-full md:w-48 h-32">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.workspaceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{booking.workspaceName}</h3>
                          <Badge className="w-fit bg-gray-500">Completed</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/bookings/review/${booking.id}`)}
                        >
                          Leave a Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No completed bookings</h3>
                  <p className="text-gray-500">You don't have any completed workspace bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {getFilteredBookings("cancelled").length > 0 ? (
                <div className="space-y-4">
                  {getFilteredBookings("cancelled").map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg overflow-hidden flex flex-col md:flex-row bg-white"
                    >
                      <div className="relative w-full md:w-48 h-32">
                        <Image
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.workspaceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{booking.workspaceName}</h3>
                          <Badge className="w-fit bg-red-500">Cancelled</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <Button
                          className="bg-[#0a1f56] hover:bg-[#0a1f56]/90"
                          size="sm"
                          onClick={() => router.push(`/workspace/${booking.id.replace("booking-", "")}`)}
                        >
                          Book Again
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No cancelled bookings</h3>
                  <p className="text-gray-500">You don't have any cancelled workspace bookings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}