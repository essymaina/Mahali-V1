"use client"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, MapPin, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for workspaces
const WORKSPACES = [
  {
    id: "1",
    name: "Nairobi Garage",
    category: "coworking-space",
    location: "westlands",
    price: 1500,
    rating: 4.8,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A premium coworking space with high-speed internet, meeting rooms, and a vibrant community of professionals. Located in the heart of Westlands, Nairobi Garage offers a range of workspace options from hot desks to private offices. The space is designed to foster collaboration and productivity with plenty of natural light, ergonomic furniture, and modern amenities. Members enjoy 24/7 access, high-speed internet, meeting room credits, and a community of like-minded professionals.",
    availability: "Available now",
    amenities: [
      "High-speed WiFi",
      "Meeting Rooms",
      "Coffee & Tea",
      "Printing Services",
      "24/7 Access",
      "Air Conditioning",
    ],
    tables: ["Hot Desk", "Dedicated Desk", "Private Office", "Meeting Room", "Event Space"],
  },
  {
    id: "2",
    name: "Java House",
    category: "coffee-shop",
    location: "kilimani",
    price: 800,
    rating: 4.5,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A cozy coffee shop with comfortable seating, great coffee, and a quiet atmosphere perfect for focused work. Java House Kilimani offers a relaxed environment with reliable WiFi and plenty of power outlets. The ambient noise level is perfect for those who prefer a bit of background buzz while working. Their menu features a variety of coffee drinks, teas, pastries, and light meals to keep you fueled throughout your work session.",
    availability: "Available now",
    amenities: ["Free WiFi", "Power Outlets", "Coffee & Snacks", "Air Conditioning", "Outdoor Seating"],
    tables: ["Window Table", "Outdoor Table", "Booth", "Bar Seating", "Lounge Area"],
  },
  {
    id: "3",
    name: "The Alchemist",
    category: "restaurant",
    location: "westlands",
    price: 1200,
    rating: 4.7,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A trendy restaurant with outdoor seating, good food, and a relaxed atmosphere for casual meetings and work sessions. The Alchemist is a creative hub that combines food, art, and work in one vibrant space. The outdoor garden area is particularly popular for those who enjoy working in the fresh air. The venue hosts regular events, markets, and performances, making it a dynamic environment for creative professionals.",
    availability: "Limited availability",
    amenities: ["WiFi", "Outdoor Seating", "Full Menu", "Bar Service", "Regular Events"],
    tables: ["Garden Table", "Indoor Table", "Bar Area", "Lounge Seating", "Private Booth"],
  },
  {
    id: "4",
    name: "Nairobi National Museum",
    category: "art-gallery",
    location: "cbd",
    price: 1000,
    rating: 4.6,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A cultural space with art exhibitions, quiet corners for reflection, and a café for refreshments. The Nairobi National Museum offers a unique working environment surrounded by Kenya's rich cultural and natural heritage. The museum's café provides a quiet space for focused work with views of the botanical gardens. Take inspiration breaks by exploring the exhibitions or walking through the nature trails.",
    availability: "Available now",
    amenities: ["WiFi in Café", "Cultural Exhibitions", "Nature Trails", "Café", "Gift Shop"],
    tables: ["Café Table", "Garden View", "Indoor Quiet Area", "Terrace Seating", "Library Space"],
  },
  {
    id: "5",
    name: "Karura Forest",
    category: "garden",
    location: "karen",
    price: 500,
    rating: 4.9,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A serene natural environment with outdoor seating areas, walking trails, and a peaceful atmosphere for creative work. Karura Forest offers a unique opportunity to work in nature with designated picnic areas that can serve as outdoor offices. The River Café within the forest provides refreshments and more formal seating. Take breaks by exploring the waterfall, caves, or simply enjoying the sounds of nature.",
    availability: "Weather dependent",
    amenities: ["Natural Setting", "Walking Trails", "River Café", "Picnic Areas", "Waterfall"],
    tables: ["River Café Table", "Picnic Area", "Bamboo Bench", "Forest Clearing", "Waterfall View"],
  },
  {
    id: "6",
    name: "iHub",
    category: "coworking-space",
    location: "kilimani",
    price: 1800,
    rating: 4.7,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A tech-focused coworking space with events, networking opportunities, and a community of innovators. iHub is Kenya's pioneer tech hub, offering a collaborative environment for startups, entrepreneurs, and tech enthusiasts. The space features open plan seating, private meeting rooms, and event spaces. Regular workshops, hackathons, and networking events provide opportunities to connect with Nairobi's tech ecosystem.",
    availability: "Limited availability",
    amenities: [
      "High-speed Internet",
      "Tech Events",
      "Meeting Rooms",
      "Startup Support",
      "Networking Opportunities",
      "24/7 Access",
    ],
    tables: ["Hot Desk", "Dedicated Desk", "Meeting Pod", "Event Space", "Quiet Zone"],
  },
]

export default function BookingDetailPage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date") || ""

  const workspace = WORKSPACES.find((w) => w.id === params.id)

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
          Back to Search Results
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-4">{workspace.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{workspace.rating}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{workspace.location.charAt(0).toUpperCase() + workspace.location.slice(1)}</span>
              </div>
              <div className="text-green-600 font-medium">{workspace.availability}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={workspace.images[0] || "/placeholder.svg"}
                  alt={workspace.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {workspace.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${workspace.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About this workspace</h2>
              <p className="text-gray-700 whitespace-pre-line">{workspace.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workspace.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0a1f56]"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">KSh {workspace.price}</span>
                <span className="text-gray-500">per day</span>
              </div>

              <Button
                className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white mb-4"
                onClick={() => router.push(`/booking/${workspace.id}/payment?date=${date}`)}
              >
                Book Now
              </Button>

              <div className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</div>

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
    </div>
  )
}

