"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, CreditCard, Phone, User } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for workspaces
const WORKSPACES = [
  {
    id: "1",
    name: "Nairobi Garage",
    category: "coworking-space",
    location: "westlands",
    price: 1500,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "A premium coworking space with high-speed internet, meeting rooms, and a vibrant community of professionals.",
    availability: "Available now",
    tables: ["Hot Desk", "Dedicated Desk", "Private Office", "Meeting Room", "Event Space"],
  },
  {
    id: "2",
    name: "Java House",
    category: "coffee-shop",
    location: "kilimani",
    price: 800,
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "A cozy coffee shop with comfortable seating, great coffee, and a quiet atmosphere perfect for focused work.",
    availability: "Available now",
    tables: ["Window Table", "Outdoor Table", "Booth", "Bar Seating", "Lounge Area"],
  },
  {
    id: "3",
    name: "The Alchemist",
    category: "restaurant",
    location: "westlands",
    price: 1200,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "A trendy restaurant with outdoor seating, good food, and a relaxed atmosphere for casual meetings and work sessions.",
    availability: "Limited availability",
    tables: ["Garden Table", "Indoor Table", "Bar Area", "Lounge Seating", "Private Booth"],
  },
  {
    id: "4",
    name: "Nairobi National Museum",
    category: "art-gallery",
    location: "cbd",
    price: 1000,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400",
    description: "A cultural space with art exhibitions, quiet corners for reflection, and a café for refreshments.",
    availability: "Available now",
    tables: ["Café Table", "Garden View", "Indoor Quiet Area", "Terrace Seating", "Library Space"],
  },
  {
    id: "5",
    name: "Karura Forest",
    category: "garden",
    location: "karen",
    price: 500,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
    description:
      "A serene natural environment with outdoor seating areas, walking trails, and a peaceful atmosphere for creative work.",
    availability: "Weather dependent",
    tables: ["River Café Table", "Picnic Area", "Bamboo Bench", "Forest Clearing", "Waterfall View"],
  },
  {
    id: "6",
    name: "iHub",
    category: "coworking-space",
    location: "kilimani",
    price: 1800,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
    description: "A tech-focused coworking space with events, networking opportunities, and a community of innovators.",
    availability: "Limited availability",
    tables: ["Hot Desk", "Dedicated Desk", "Meeting Pod", "Event Space", "Quiet Zone"],
  },
]

export default function PaymentPage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date") || ""

  const workspace = WORKSPACES.find((w) => w.id === params.id)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [table, setTable] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [people, setPeople] = useState("1")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 1500)
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white bg-[#0a1f56] px-4 py-2">MAHALI</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/events" className="font-medium">
              EVENTS
            </a>
            <a href="/bookings" className="font-medium">
              BOOKINGS
            </a>
            <a href="/" className="font-medium">
              HOME
            </a>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href="/events">EVENTS</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/bookings">BOOKINGS</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/">HOME</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" className="flex items-center gap-2 mb-6" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          Back to Workspace Details
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Complete your booking</h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="table">Select Table/Space</Label>
                      <Select value={table} onValueChange={setTable} required>
                        <SelectTrigger id="table">
                          <SelectValue placeholder="Choose a table or space" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspace.tables.map((tableOption, index) => (
                            <SelectItem key={index} value={tableOption.toLowerCase().replace(/\s+/g, "-")}>
                              {tableOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Arrival Time</Label>
                      <Select value={arrivalTime} onValueChange={setArrivalTime} required>
                        <SelectTrigger id="arrivalTime">
                          <SelectValue placeholder="Select your arrival time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="people">Number of People</Label>
                      <Select value={people} onValueChange={setPeople} required>
                        <SelectTrigger id="people">
                          <SelectValue placeholder="Select number of people" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Person</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                          <SelectItem value="4">4 People</SelectItem>
                          <SelectItem value="5">5 People</SelectItem>
                          <SelectItem value="6">6+ People</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <Tabs defaultValue="mpesa" value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="mpesa" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        M-Pesa
                      </TabsTrigger>
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="mpesa" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mpesaNumber">M-Pesa Phone Number</Label>
                        <Input
                          id="mpesaNumber"
                          placeholder="e.g. 07XX XXX XXX"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          required={paymentMethod === "mpesa"}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        You will receive an M-Pesa prompt on your phone to complete the payment.
                      </p>
                    </TabsContent>
                    <TabsContent value="card" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="XXX"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 border rounded-lg sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={workspace.image || "/placeholder.svg"}
                    alt={workspace.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{workspace.name}</h3>
                  <p className="text-sm text-gray-500">
                    {workspace.location.charAt(0).toUpperCase() + workspace.location.slice(1)}
                  </p>
                  <p className="text-sm mt-1">
                    {date === "today"
                      ? "Today"
                      : date === "tomorrow"
                        ? "Tomorrow"
                        : date === "this-week"
                          ? "This Week"
                          : date === "next-week"
                            ? "Next Week"
                            : date === "custom"
                              ? "Selected Date"
                              : "Flexible Date"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>KSh {workspace.price} x 1 day</span>
                  <span>KSh {workspace.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service fee</span>
                  <span>KSh {Math.round(workspace.price * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t mt-4">
                  <span>Total</span>
                  <span>KSh {workspace.price + Math.round(workspace.price * 0.1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Your Seat Has Been Booked!</DialogTitle>
            <DialogDescription className="text-center pt-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>A confirmation email with your QR code has been sent to your email address.</div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={handleConfirmationClose} className="bg-[#0a1f56] hover:bg-[#0a1f56]/90">
              Return to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

