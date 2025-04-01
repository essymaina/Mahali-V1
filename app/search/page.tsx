"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, MapPin, Search, Star, User } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

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
  },
]

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [date, setDate] = useState(searchParams.get("date") || "")
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([])

  useEffect(() => {
    // Filter workspaces based on search params
    let filtered = [...WORKSPACES]

    if (category) {
      filtered = filtered.filter((workspace) => workspace.category === category)
    }

    if (location) {
      filtered = filtered.filter((workspace) => workspace.location === location)
    }

    setFilteredWorkspaces(filtered)
  }, [category, location, date])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    if (date) params.set("date", date)

    router.push(`/search?${params.toString()}`)
  }

  const getCategoryLabel = (value) => {
    const categories = {
      "art-gallery": "Art Gallery",
      "coffee-shop": "Coffee Shop",
      "coworking-space": "Coworking Space",
      garden: "Garden",
      restaurant: "Restaurant",
    }
    return categories[value] || value
  }

  const getLocationLabel = (value) => {
    const locations = {
      westlands: "Westlands",
      kilimani: "Kilimani",
      karen: "Karen",
      cbd: "CBD",
      lavington: "Lavington",
      "ngong-road": "Ngong Road",
      "lower-kabete": "Lower Kabete",
      "waiyaki-way": "Waiyaki Way",
      redhill: "Redhill",
    }
    return locations[value] || value
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

      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <span className={cn(!category && "text-muted-foreground")}>
                      {category ? getCategoryLabel(category) : "Workspace"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="art-gallery">Art Gallery</SelectItem>
                  <SelectItem value="coffee-shop">Coffee Shop</SelectItem>
                  <SelectItem value="coworking-space">Coworking Space</SelectItem>
                  <SelectItem value="garden">Garden</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full border-2 border-solid">
                  <div className="flex items-center">
                    <span className={cn(!location && "text-muted-foreground")}>
                      {location ? getLocationLabel(location) : "Where?"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="westlands">Westlands</SelectItem>
                  <SelectItem value="kilimani">Kilimani</SelectItem>
                  <SelectItem value="karen">Karen</SelectItem>
                  <SelectItem value="cbd">CBD</SelectItem>
                  <SelectItem value="lavington">Lavington</SelectItem>
                  <SelectItem value="ngong-road">Ngong Road</SelectItem>
                  <SelectItem value="lower-kabete">Lower Kabete</SelectItem>
                  <SelectItem value="waiyaki-way">Waiyaki Way</SelectItem>
                  <SelectItem value="redhill">Redhill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <span className={cn(!date && "text-muted-foreground")}>{date || "When"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Button className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.push("/")}>
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h2 className="text-xl font-semibold">
            {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? "workspace" : "workspaces"} found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image src={workspace.image || "/placeholder.svg"} alt={workspace.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{workspace.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{workspace.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {getLocationLabel(workspace.location)}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-600">{workspace.availability}</span>
                  <span className="font-bold">KSh {workspace.price}/day</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workspace.description}</p>
                <Button
                  className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white"
                  onClick={() => router.push(`/booking/${workspace.id}?date=${date}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No workspaces found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
            <Button variant="outline" onClick={() => router.push("/")}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

