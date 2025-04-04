"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Calendar, ChevronLeft, Clock, MapPin } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Calendar as CalendarComponent } from "../../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { format } from "date-fns"
import Navbar  from "../../../components/navbar"
import { useAuth } from "../../../components/auth-context"

// Mock data for workspaces - in a real app, you would fetch this from an API
const WORKSPACES = [
  {
    id: "1",
    name: "Nairobi Garage",
    category: "coworking-space",
    location: "westlands",
    price: 1500,
    rating: 4.8,
    availability: "Available",
    images: ["/placeholder.svg?height=600&width=800"],
    description: "A modern coworking space in the heart of Westlands.",
    amenities: ["High-speed WiFi", "Meeting Rooms", "Coffee Bar", "24/7 Access"],
  },
  // Add more workspaces as needed
]

// Available time slots
const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "09:00 - 13:00" },
  { id: "afternoon", label: "Afternoon", time: "13:00 - 17:00" },
  { id: "full-day", label: "Full Day", time: "09:00 - 17:00" },
]

export default function CreateBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get("workspace") || ""
  const { user, isLoading } = useAuth()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState("full-day")

  const workspace = WORKSPACES.find((w) => w.id === workspaceId)

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Workspace not found</h2>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleBooking = async () => {
    // In a real app, you would call your API to create the booking
    try {
      // Mock API call
      const bookingData = {
        workspace_id: workspace.id,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time_slot: timeSlot,
        // Add other necessary data
      }

      console.log("Creating booking:", bookingData)

      // Redirect to payment page
      router.push(`/bookings/payment?workspace=${workspace.id}&date=${bookingData.date}&timeSlot=${timeSlot}`)
    } catch (error) {
      console.error("Error creating booking:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="flex items-center gap-2 mb-6" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Book Your Workspace</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>

                <div className="mb-6">
                  <Label className="mb-2 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="mb-2 block">Time Slot</Label>
                  <RadioGroup value={timeSlot} onValueChange={setTimeSlot}>
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot.id} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={slot.id} id={slot.id} />
                        <Label htmlFor={slot.id} className="flex-1">
                          <div className="flex justify-between">
                            <span>{slot.label}</span>
                            <span className="text-gray-500">{slot.time}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{date ? format(date, "PPP") : "Not selected"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time</span>
                    <span>{TIME_SLOTS.find((slot) => slot.id === timeSlot)?.time || "Not selected"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Workspace</span>
                    <span>{workspace.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Location</span>
                    <span>{workspace.location.charAt(0).toUpperCase() + workspace.location.slice(1)}</span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>KSh {workspace.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={workspace.images[0] || "/placeholder.svg"}
                    alt={workspace.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="font-semibold text-lg mb-2">{workspace.name}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{workspace.location.charAt(0).toUpperCase() + workspace.location.slice(1)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>9:00 AM - 5:00 PM</span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span>Price</span>
                    <span>KSh {workspace.price}/day</span>
                  </div>
                </div>

                <Button className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90" onClick={handleBooking} disabled={!date}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}