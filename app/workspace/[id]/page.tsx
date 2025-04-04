"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, MapPin, Star } from "lucide-react"
import { Button } from "../../../components/ui/button"
import Navbar  from "../../../components/navbar"

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
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    description:
      "A modern coworking space in the heart of Westlands with high-speed internet, meeting rooms, and a vibrant community of professionals. Perfect for freelancers and small teams looking for a productive environment.",
    amenities: [
      "High-speed WiFi",
      "Meeting Rooms",
      "Coffee Bar",
      "24/7 Access",
      "Printing Services",
      "Air Conditioning",
      "Parking",
    ],
  },
  // Add more workspaces as needed
]

export default function WorkspaceDetailPage({ params }: { params: { id: string } }) {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
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
            <div className="border rounded-lg p-6 sticky top-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">KSh {workspace.price}</span>
                <span className="text-gray-500">per day</span>
              </div>

              <Button
                className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white mb-4"
                onClick={() => router.push(`/bookings/create?workspace=${workspace.id}&date=${date}`)}
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