"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Calendar,
  ChevronLeft,
  Clock,
  LogOut,
  MapPin,
  Settings,
  Share2,
  Ticket,
  User,
  Users,
  Building,
} from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock data for events
const EVENTS = [
  {
    id: "e1",
    title: "Tech Networking Mixer",
    description:
      "Connect with tech professionals from startups and established companies in a casual setting. This event is perfect for those looking to expand their professional network, find potential collaborators, or simply enjoy conversations with like-minded individuals in the tech industry.\n\nThe evening will include structured networking activities, a short panel discussion on current tech trends, and plenty of time for organic connections. Light refreshments and drinks will be provided.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-03-25",
    time: "18:00",
    endTime: "21:00",
    location: "Nairobi Garage, Westlands",
    address: "Mirage Towers, Chiromo Road, Westlands, Nairobi",
    category: "networking",
    attendees: 45,
    price: 500,
    featured: true,
    organizer: "Nairobi Tech Network",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "e2",
    title: "Creative Entrepreneurs Meetup",
    description:
      "A gathering for creative entrepreneurs to share ideas, challenges, and opportunities. Whether you're a designer, writer, photographer, or any other creative professional running your own business, this meetup is designed to help you connect with peers facing similar challenges.\n\nThe session will include short presentations from successful creative entrepreneurs, followed by breakout discussions on topics like pricing your creative work, finding clients, and balancing creativity with business demands.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-02",
    time: "17:30",
    endTime: "20:00",
    location: "The Alchemist, Westlands",
    address: "Parklands Road, Westlands, Nairobi",
    category: "workshop",
    attendees: 30,
    price: 0,
    featured: false,
    organizer: "Creative Minds Kenya",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "e3",
    title: "Startup Funding Workshop",
    description:
      "Learn about funding options for your startup from VCs and angel investors. This comprehensive workshop will cover everything from preparing your pitch deck to negotiating term sheets.\n\nExperienced investors and successfully funded founders will share their insights on what makes a startup attractive to investors, common pitfalls to avoid, and strategies for fundraising in the current economic climate. You'll also have the opportunity to network with potential investors and fellow entrepreneurs.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-10",
    time: "14:00",
    endTime: "17:30",
    location: "iHub, Kilimani",
    address: "Senteu Plaza, Kilimani, Nairobi",
    category: "workshop",
    attendees: 25,
    price: 1000,
    featured: true,
    organizer: "Startup Kenya",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "e4",
    title: "Digital Marketing Masterclass",
    description:
      "Comprehensive workshop on digital marketing strategies for small businesses. This hands-on masterclass will equip you with practical skills and knowledge to effectively market your business online.\n\nTopics covered include social media marketing, search engine optimization, content marketing, email campaigns, and digital advertising. You'll learn how to create a cohesive digital marketing strategy, measure your results, and optimize your campaigns for better ROI.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-15",
    time: "09:00",
    endTime: "16:00",
    location: "Movenpick Hotel, Westlands",
    address: "Mpaka Road, Westlands, Nairobi",
    category: "workshop",
    attendees: 50,
    price: 2500,
    featured: false,
    organizer: "Digital Marketing Kenya",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "e5",
    title: "Women in Tech Breakfast",
    description:
      "Networking breakfast for women in technology to connect and share experiences. This event provides a supportive environment for women working in various tech roles to build meaningful professional relationships.\n\nThe morning will feature a keynote speech from a prominent woman leader in tech, followed by facilitated networking and mentorship opportunities. Come prepared to share your experiences, challenges, and successes with a community of supportive peers.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-20",
    time: "07:30",
    endTime: "10:00",
    location: "Java House, Kilimani",
    address: "Lenana Road, Kilimani, Nairobi",
    category: "networking",
    attendees: 35,
    price: 800,
    featured: true,
    organizer: "Women in Tech Africa",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "e6",
    title: "Freelancers Meetup",
    description:
      "Casual gathering for freelancers to network and share tips on finding clients. Whether you're a seasoned freelancer or just starting out, this meetup offers valuable connections and practical advice.\n\nThe event will include lightning talks from successful freelancers, open discussions about common challenges, and plenty of time for networking. Topics will include finding quality clients, setting appropriate rates, managing your workflow, and maintaining work-life balance as a freelancer.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-25",
    time: "16:00",
    endTime: "19:00",
    location: "Kaldi Coffee, CBD",
    address: "Kimathi Street, CBD, Nairobi",
    category: "networking",
    attendees: 20,
    price: 0,
    featured: false,
    organizer: "Freelance Kenya",
    organizerLogo: "/placeholder.svg?height=100&width=100",
  },
]

// Mock data for attendees
const ATTENDEES = [
  { id: "u1", name: "Jane Doe", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 2, commonEvents: 1 },
  { id: "u2", name: "John Smith", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 1, commonEvents: 3 },
  {
    id: "u3",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    commonSpaces: 0,
    commonEvents: 2,
  },
  { id: "u4", name: "Bob Brown", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 3, commonEvents: 0 },
  { id: "u5", name: "Carol White", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 1, commonEvents: 1 },
  { id: "u6", name: "David Green", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 2, commonEvents: 2 },
  { id: "u7", name: "Eve Black", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 0, commonEvents: 1 },
  { id: "u8", name: "Frank Gray", avatar: "/placeholder.svg?height=100&width=100", commonSpaces: 1, commonEvents: 0 },
]

export default function EventDetailPage({ params }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [event, setEvent] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAttendee, setSelectedAttendee] = useState(null)
  const [showAttendeeProfile, setShowAttendeeProfile] = useState(false)

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

    // Check if user is premium
    const premiumStatus = localStorage.getItem("mahali-premium-status")
    const isPremiumUser = premiumStatus === "active"
    setIsPremium(isPremiumUser)

    // If not premium, redirect to premium page
    if (!isPremiumUser) {
      router.push("/premium")
      return
    }

    // Find event by ID
    const foundEvent = EVENTS.find((e) => e.id === params.id)

    if (!foundEvent) {
      router.push("/events")
      return
    }

    setEvent(foundEvent)
    setIsLoading(false)
  }, [router, params.id])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
  }

  const handleRegister = () => {
    setIsRegistering(true)

    // Simulate registration process
    setTimeout(() => {
      setIsRegistering(false)
      setShowConfirmation(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 1500)
  }

  const handleViewAttendee = (attendee) => {
    setSelectedAttendee(attendee)
    setShowAttendeeProfile(true)
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
                      {user.firstName} {user.lastName}
                      {isPremium && (
                        <Badge variant="outline" className="ml-2 bg-[#0a1f56]/10 text-[#0a1f56] border-[#0a1f56]/20">
                          Premium
                        </Badge>
                      )}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
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
        <Button variant="ghost" className="flex items-center gap-2 mb-6" onClick={() => router.push("/events")}>
          <ChevronLeft className="h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              {event.featured && (
                <div className="absolute top-0 right-0 m-4">
                  <Badge className="bg-[#0a1f56]">Featured</Badge>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="capitalize">
                {event.category}
              </Badge>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-6">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>
                  {formatTime(event.time)} - {formatTime(event.endTime)}
                </span>
              </div>
            </div>

            <Tabs defaultValue="about" className="mb-8">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="pt-4">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">About this event</h2>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Organizer</h2>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src={event.organizerLogo || "/placeholder.svg"}
                          alt={event.organizer}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{event.organizer}</p>
                        <p className="text-sm text-gray-500">Event Organizer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="pt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Event Location</h2>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-gray-500">{event.address}</p>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Map location"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendees" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Attendees</h2>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-5 w-5 mr-2" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ATTENDEES.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewAttendee(attendee)}
                      >
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback>
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-center">{attendee.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <div className="flex items-center mr-2">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{attendee.commonSpaces}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{attendee.commonEvents}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                {event.price > 0 ? (
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold">KSh {event.price}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-xl font-medium text-green-600">Free Entry</p>
                  </div>
                )}
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Premium Event
                </Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(event.time)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{event.attendees} attending</p>
                    <p className="text-sm text-gray-500">Join them at this event</p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 flex items-center justify-center gap-2"
                onClick={handleRegister}
                disabled={isRegistering}
              >
                <Ticket className="h-4 w-4" />
                {isRegistering ? "Processing..." : "Register for Event"}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Premium members get priority access to all events
              </p>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">You're Registered!</DialogTitle>
            <DialogDescription className="text-center pt-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-lg font-medium mb-2">You've successfully registered for {event.title}</div>
              <div className="text-sm text-gray-500">
                A confirmation email with event details has been sent to your email address. We look forward to seeing
                you there!
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setShowConfirmation(false)} className="bg-[#0a1f56] hover:bg-[#0a1f56]/90">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendeeProfile} onOpenChange={setShowAttendeeProfile}>
        {selectedAttendee && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={selectedAttendee.avatar} alt={selectedAttendee.name} />
                <AvatarFallback>
                  {selectedAttendee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mb-1">{selectedAttendee.name}</h3>
              <p className="text-gray-500 mb-4">Premium Member</p>

              <div className="w-full space-y-4">
                {selectedAttendee.commonSpaces > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Common Workspaces ({selectedAttendee.commonSpaces})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: selectedAttendee.commonSpaces }).map((_, i) => (
                        <div key={i} className="flex items-center p-2 bg-gray-50 rounded-md">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=100&width=100"
                              alt="Workspace"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{["Nairobi Garage", "The Alchemist", "Java House"][i % 3]}</p>
                            <p className="text-xs text-gray-500">
                              Last visited: {["March 10", "February 25", "January 15"][i % 3]}, 2025
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAttendee.commonEvents > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Common Events ({selectedAttendee.commonEvents})
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Array.from({ length: selectedAttendee.commonEvents }).map((_, i) => (
                        <div key={i} className="flex items-center p-2 bg-gray-50 rounded-md">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=100&width=100"
                              alt="Event"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {
                                ["Tech Networking Mixer", "Creative Entrepreneurs Meetup", "Women in Tech Breakfast"][
                                  i % 3
                                ]
                              }
                            </p>
                            <p className="text-xs text-gray-500">{["March 25", "April 2", "April 20"][i % 3]}, 2025</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAttendee.commonSpaces === 0 && selectedAttendee.commonEvents === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No common workspaces or events yet</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowAttendeeProfile(false)} variant="outline" className="w-full">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

