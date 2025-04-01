"use client"

interface User {
  firstName: string;
  lastName: string;
  type: string;
}

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, LogOut, MapPin, Search, Settings, Star, User, Users } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"

// Mock data for events
const EVENTS = [
  {
    id: "e1",
    title: "Tech Networking Mixer",
    description: "Connect with tech professionals from startups and established companies in a casual setting.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-03-25",
    time: "18:00",
    location: "Nairobi Garage, Westlands",
    category: "networking",
    attendees: 45,
    price: 500,
    featured: true,
  },
  {
    id: "e2",
    title: "Creative Entrepreneurs Meetup",
    description: "A gathering for creative entrepreneurs to share ideas, challenges, and opportunities.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-02",
    time: "17:30",
    location: "The Alchemist, Westlands",
    category: "workshop",
    attendees: 30,
    price: 0,
    featured: false,
  },
  {
    id: "e3",
    title: "Startup Funding Workshop",
    description: "Learn about funding options for your startup from VCs and angel investors.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-10",
    time: "14:00",
    location: "iHub, Kilimani",
    category: "workshop",
    attendees: 25,
    price: 1000,
    featured: true,
  },
  {
    id: "e4",
    title: "Digital Marketing Masterclass",
    description: "Comprehensive workshop on digital marketing strategies for small businesses.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-15",
    time: "09:00",
    location: "Movenpick Hotel, Westlands",
    category: "workshop",
    attendees: 50,
    price: 2500,
    featured: false,
  },
  {
    id: "e5",
    title: "Women in Tech Breakfast",
    description: "Networking breakfast for women in technology to connect and share experiences.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-20",
    time: "07:30",
    location: "Java House, Kilimani",
    category: "networking",
    attendees: 35,
    price: 800,
    featured: true,
  },
  {
    id: "e6",
    title: "Freelancers Meetup",
    description: "Casual gathering for freelancers to network and share tips on finding clients.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2025-04-25",
    time: "16:00",
    location: "Kaldi Coffee, CBD",
    category: "networking",
    attendees: 20,
    price: 0,
    featured: false,
  },
]

export default function EventsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(EVENTS)
  const [activeCategory, setActiveCategory] = useState("all")

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

    // If not premium, show premium dialog
    if (!isPremiumUser) {
      setShowPremiumDialog(true)
    }

    setIsLoading(false)
  }, [router])

  useEffect(() => {
    // Filter events based on search query and category
    let filtered = [...EVENTS]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query),
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((event) => event.category === activeCategory)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, activeCategory])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const formatDate = (dateString?: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "Invalid date";
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  const formatTime = (timeString?: string): string => {
    if (!timeString || !/^\d{2}:\d{2}$/.test(timeString)) return "Invalid time";
    const [hours, minutes] = timeString.split(":");
    const hour = Number.parseInt(hours, 10);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

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
      {user?.firstName} {user?.lastName}
      {isPremium && (
        <Badge variant="outline" className="ml-2 bg-[#0a1f56]/10 text-[#0a1f56] border-[#0a1f56]/20">
          Premium
        </Badge>
      )}
    </p>
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

      {isPremium && (
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Exclusive Events</h1>
              <p className="text-gray-500">Connect with professionals and expand your network</p>
            </div>

            <div className="w-full md:w-auto flex items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="networking">Networking</TabsTrigger>
              <TabsTrigger value="workshop">Workshops</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  {event.featured && (
                    <div className="absolute top-0 right-0 m-2">
                      <Badge className="bg-[#0a1f56]">Featured</Badge>
                    </div>
                  )}
                  {event.price === 0 && (
                    <div className="absolute top-0 left-0 m-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Free
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {event.category}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {event.price > 0 ? (
                      <span className="font-bold">KSh {event.price}</span>
                    ) : (
                      <span className="font-medium text-green-600">Free Entry</span>
                    )}
                    <Button
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="bg-[#0a1f56] hover:bg-[#0a1f56]/90"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or check back later</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      )}

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Premium Feature</DialogTitle>
            <DialogDescription>The Events section is exclusively available to Premium members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#0a1f56]/10 p-2 rounded-full">
                <Star className="h-5 w-5 text-[#0a1f56] fill-yellow-500" />
              </div>
              <div>
                <h4 className="font-medium">Exclusive Networking Events</h4>
                <p className="text-sm text-gray-500">
                  Connect with professionals and expand your network at exclusive events.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-[#0a1f56]/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-[#0a1f56]" />
              </div>
              <div>
                <h4 className="font-medium">Professional Connections</h4>
                <p className="text-sm text-gray-500">
                  Discover common interests with other professionals and build meaningful connections.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              Not Now
            </Button>
            <Button className="bg-[#0a1f56] hover:bg-[#0a1f56]/90" onClick={() => router.push("/premium")}>
              Upgrade to Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

