"use client"

import { type JSX, useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"
import { useAuth } from "../../components/auth-context"

// Define types
interface BookingUser {
  name: string
  email: string
  phone: string
}

interface Booking {
  id: string
  workspaceId: string
  workspaceName: string
  workspaceImage: string
  location: string
  date: string
  time: string
  table: string
  people: number
  price: number
  status: string
  user: BookingUser
}

// Mock data for bookings
const BOOKINGS: Booking[] = [
  {
    id: "b1",
    workspaceId: "ws1",
    workspaceName: "Coffee Corner",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Westlands",
    date: "2025-03-20",
    time: "09:00",
    table: "Window Seat",
    people: 1,
    price: 800,
    status: "confirmed",
    user: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+254 712 345 678",
    },
  },
  {
    id: "b2",
    workspaceId: "ws1",
    workspaceName: "Coffee Corner",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Westlands",
    date: "2025-03-21",
    time: "14:00",
    table: "Lounge Area",
    people: 3,
    price: 800,
    status: "confirmed",
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+254 723 456 789",
    },
  },
  {
    id: "b3",
    workspaceId: "ws2",
    workspaceName: "Creative Hub",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Kilimani",
    date: "2025-03-22",
    time: "10:00",
    table: "Private Room",
    people: 5,
    price: 1500,
    status: "confirmed",
    user: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+254 734 567 890",
    },
  },
  {
    id: "b4",
    workspaceId: "ws1",
    workspaceName: "Coffee Corner",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Westlands",
    date: "2025-03-15",
    time: "11:00",
    table: "Bar Seating",
    people: 2,
    price: 800,
    status: "completed",
    user: {
      name: "Bob Brown",
      email: "bob.brown@example.com",
      phone: "+254 745 678 901",
    },
  },
  {
    id: "b5",
    workspaceId: "ws2",
    workspaceName: "Creative Hub",
    workspaceImage: "/placeholder.svg?height=300&width=400",
    location: "Kilimani",
    date: "2025-03-10",
    time: "13:00",
    table: "Hot Desk",
    people: 1,
    price: 1500,
    status: "completed",
    user: {
      name: "Carol White",
      email: "carol.white@example.com",
      phone: "+254 756 789 012",
    },
  },
]

export function WorkspaceBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, you would fetch bookings from your API
    // For now, we'll use the mock data
    setBookings(BOOKINGS)
  }, [])

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
  }

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewBooking = (booking: Booking): void => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "confirmed")
  const pastBookings = bookings.filter((booking) => booking.status === "completed" || booking.status === "cancelled")

  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Manage bookings for your workspaces</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-32 h-32">
                          <Image
                            src={booking.workspaceImage || "/placeholder.svg"}
                            alt={booking.workspaceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.workspaceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Date & Time</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(booking.date)}
                              </p>
                              <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(booking.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Booking Details</p>
                              <p className="font-medium">{booking.table}</p>
                              <p className="font-medium">
                                {booking.people} {booking.people === 1 ? "Person" : "People"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Customer</p>
                              <p className="font-medium flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                {booking.user.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Payment</p>
                              <p className="text-lg font-bold">KSh {booking.price}</p>
                            </div>
                            <Button variant="outline" onClick={() => handleViewBooking(booking)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any upcoming bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
              <CardDescription>View history of completed bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-32 h-32">
                          <Image
                            src={booking.workspaceImage || "/placeholder.svg"}
                            alt={booking.workspaceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.workspaceName}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Date & Time</p>
                              <p className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(booking.date)}
                              </p>
                              <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(booking.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Booking Details</p>
                              <p className="font-medium">{booking.table}</p>
                              <p className="font-medium">
                                {booking.people} {booking.people === 1 ? "Person" : "People"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Customer</p>
                              <p className="font-medium flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                {booking.user.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Payment</p>
                              <p className="text-lg font-bold">KSh {booking.price}</p>
                            </div>
                            <Button variant="outline" onClick={() => handleViewBooking(booking)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any past bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        {selectedBooking && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Booking ID: {selectedBooking.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={selectedBooking.workspaceImage || "/placeholder.svg"}
                    alt={selectedBooking.workspaceName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedBooking.workspaceName}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedBooking.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(selectedBooking.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Table/Space</p>
                  <p className="font-medium">{selectedBooking.table}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">People</p>
                  <p className="font-medium">
                    {selectedBooking.people} {selectedBooking.people === 1 ? "Person" : "People"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p>{selectedBooking.user.name}</p>
                  </div>
                  <p className="text-sm">Email: {selectedBooking.user.email}</p>
                  <p className="text-sm">Phone: {selectedBooking.user.phone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Booking Amount</span>
                  <span>KSh {selectedBooking.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Platform Fee</span>
                  <span>KSh {Math.round(selectedBooking.price * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {selectedBooking.price + Math.round(selectedBooking.price * 0.1)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}