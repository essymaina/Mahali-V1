"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Building, Calendar, ChevronLeft, LogOut, MapPin, Settings, Star, User } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

// Mock data for user profile
const USERS = [
  {
    id: "u1",
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Product designer and tech enthusiast. Love working from different spaces around Nairobi.",
    isPremium: true,
    workspaces: [
      {
        id: "1",
        name: "Nairobi Garage",
        location: "Westlands",
        image: "/placeholder.svg?height=300&width=400",
        lastVisited: "2025-03-10",
      },
      {
        id: "3",
        name: "The Alchemist",
        location: "Westlands",
        image: "/placeholder.svg?height=300&width=400",
        lastVisited: "2025-02-25",
      },
    ],
    events: [
      {
        id: "e1",
        title: "Tech Networking Mixer",
        location: "Nairobi Garage, Westlands",
        image: "/placeholder.svg?height=400&width=600",
        date: "2025-03-25",
      },
    ],
  },
  {
    id: "u2",
    name: "John Smith",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Software developer specializing in web applications. Coffee addict and workspace explorer.",
    isPremium: true,
    workspaces: [
      {
        id: "1",
        name: "Nairobi Garage",
        location: "Westlands",
        image: "/placeholder.svg?height=300&width=400",
        lastVisited: "2025-03-05",
      },
    ],
    events: [
      {
        id: "e1",
        title: "Tech Networking Mixer",
        location: "Nairobi Garage, Westlands",
        image: "/placeholder.svg?height=400&width=600",
        date: "2025-03-25",
      },
      {
        id: "e2",
        title: "Creative Entrepreneurs Meetup",
        location: "The Alchemist, Westlands",
        image: "/placeholder.svg?height=400&width=600",
        date: "2025-04-02",
      },
      {
        id: "e5",
        title: "Women in Tech Breakfast",
        location: "Java House, Kilimani",
        image: "/placeholder.svg?height=400&width=600",
        date: "2025-04-20",
      },
    ],
  },
]

export default function ProfilePage({ params }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
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

    // Check if user is premium
    const premiumStatus = localStorage.getItem("mahali-premium-status")
    const isPremiumUser = premiumStatus === "active"
    setIsPremium(isPremiumUser)

    // If not premium, redirect to premium page
    if (!isPremiumUser) {
      router.push("/premium")
      return
    }

    // Find profile by ID
    const foundProfile = USERS.find((u) => u.id === params.id)

    if (!foundProfile) {
      router.push("/events")
      return
    }

    setProfile(foundProfile)
    setIsLoading(false)
  }, [router, params.id])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center  options)
  }

  if (isLoading) {
    return (
      <div className=\"min-h-screen flex items-center justify-center">
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
        <Button variant="ghost" className="flex items-center gap-2 mb-6" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {profile.isPremium && (
                  <Badge variant="outline" className="bg-[#0a1f56]/10 text-[#0a1f56] border-[#0a1f56]/20 md:ml-2">
                    <Star className="h-3 w-3 fill-[#0a1f56] mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{profile.bio}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{profile.workspaces.length} workspaces in common</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{profile.events.length} events in common</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="workspaces">
            <TabsList className="mb-6">
              <TabsTrigger value="workspaces">Common Workspaces</TabsTrigger>
              <TabsTrigger value="events">Common Events</TabsTrigger>
            </TabsList>

            <TabsContent value="workspaces">
              {profile.workspaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.workspaces.map((workspace) => (
                    <div key={workspace.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                      <div className="relative w-full md:w-32 h-32">
                        <Image
                          src={workspace.image || "/placeholder.svg"}
                          alt={workspace.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg mb-1">{workspace.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {workspace.location}
                        </div>
                        <p className="text-sm text-gray-500">Last visited: {formatDate(workspace.lastVisited)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No common workspaces</h3>
                  <p className="text-gray-500">You and {profile.name} haven't visited the same workspaces yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events">
              {profile.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.events.map((event) => (
                    <div key={event.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                      <div className="relative w-full md:w-32 h-32">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No common events</h3>
                  <p className="text-gray-500">You and {profile.name} haven't attended the same events yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

