"use client"

import type React from 'react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, Wifi } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import Navbar from "../../../components/navbar"
import { useAuth } from "../../../components/auth-context"
import { PhotosUpload } from "../../../components/workspace/photos-upload"

// Define the Photo type
interface Photo {
  id: string
  url: string
  name: string
  type: string
  file: File
}

// Define the User type with user_type
interface WorkspaceUser {
  id: string
  email: string
  user_type: string
  firstName?: string
  lastName?: string
}

export default function ListWorkspacePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [wifiTested, setWifiTested] = useState(false)
  const [wifiSpeed, setWifiSpeed] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isTestRunning, setIsTestRunning] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [hasGenerator, setHasGenerator] = useState("no")
  const [seats, setSeats] = useState("")
  const [description, setDescription] = useState("")
  const [amenities, setAmenities] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [openingTime, setOpeningTime] = useState("")
  const [closingTime, setClosingTime] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Set email from user context if available
    if (user) {
      setEmail(user.email || "")
    }
  }, [user])

  const handleWifiTest = () => {
    
    const testWindow = window.open(
      `/wifi-speed-test?returnTo=${encodeURIComponent("/workspace/list")}`,
      "_blank",
      "width=600,height=700",
    )
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from our speed test
      if (event.data && event.data.type === "SPEED_TEST_RESULT") {
        const { downloadSpeed } = event.data

        // Update the state with the test results
        setWifiSpeed(downloadSpeed)
        setWifiTested(true)

        // Remove the event listener
        window.removeEventListener("message", handleMessage)
    
    }
  }

  window.addEventListener("message", handleMessage)

  // Return a cleanup function
  return () => {
    window.removeEventListener("message", handleMessage)
  }
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const workspaceData = {
        owner_id: user?.id,
        name,
        category,
        has_generator: hasGenerator === "yes",
        seats: Number.parseInt(seats),
        description,
        amenities,
        price: Number.parseInt(price),
        location,
        opening_time: openingTime,
        closing_time: closingTime,
        contact_email: email,
        wifi_speed: wifiSpeed,
        photos: photos.map((photo: Photo) => ({
          url: photo.url,
          type: photo.type,
        })),
      }

      // Submit to API
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit workspace")
      }

      // Show confirmation dialog with confetti
      setShowConfirmation(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (err) {
      console.error("Error submitting workspace:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/workspace/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
    )
  }

   // Type guard to check if user has user_type property
   const isWorkspaceUser = (user: any): user is WorkspaceUser => {
    return user && typeof user.user_type === "string"
  }

  if (!user || !isWorkspaceUser(user) || user.user_type !== "workspace") {
    router.push("/login")
    return null
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/workspace/dashboard")} className="p-0 h-auto">
            <span className="sr-only">Back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold">List Your Workspace</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 bg-white p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-2 border-solid"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category" className="border-2 border-solid">
                      <SelectValue placeholder="Select workspace category" />
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

                <div className="space-y-2">
                  <Label>Backup Generator Available?</Label>
                  <RadioGroup value={hasGenerator} onValueChange={setHasGenerator} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="generator-yes" />
                      <Label htmlFor="generator-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="generator-no" />
                      <Label htmlFor="generator-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats Available</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                    className="border-2 border-solid"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Workspace Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your workspace, its atmosphere, and what makes it special..."
                    className="min-h-[120px] border-2 border-solid"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Amenities & Pricing</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amenities">Meals/Snacks/Coffee Included</Label>
                  <Textarea
                    id="amenities"
                    placeholder="Describe what food and beverages are included with the workspace booking..."
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    required
                    className="border-2 border-solid"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Day (KSh)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="border-2 border-solid"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Location & Contact</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location in Nairobi</Label>
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger id="location" className="border-2 border-solid">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="westlands">Westlands</SelectItem>
                      <SelectItem value="kilimani">Kilimani</SelectItem>
                      <SelectItem value="karen">Karen</SelectItem>
                      <SelectItem value="cbd">CBD</SelectItem>
                      <SelectItem value="lavington">Lavington</SelectItem>
                      <SelectItem value="parklands">Parklands</SelectItem>
                      <SelectItem value="upperhill">Upperhill</SelectItem>
                      <SelectItem value="ngong-road">Ngong Road</SelectItem>
                      <SelectItem value="lower-kabete">Lower Kabete</SelectItem>
                      <SelectItem value="waiyaki-way">Waiyaki Way</SelectItem>
                      <SelectItem value="redhill">Redhill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <Select value={openingTime} onValueChange={setOpeningTime} required>
                      <SelectTrigger id="openingTime" className="border-2 border-solid">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <Select value={closingTime} onValueChange={setClosingTime} required>
                      <SelectTrigger id="closingTime" className="border-2 border-solid">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 border-solid"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-6 border rounded-lg">
              <PhotosUpload photos={photos} setPhotos={setPhotos} />
            </div>

            <div className="space-y-6 bg-white p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Internet Speed Test</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please test your workspace's WiFi speed to help users know what to expect. Click the button below to
                  run a speed test.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Button type="button" onClick={handleWifiTest} variant="outline" className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Test WiFi Speed
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>

                  {wifiTested && (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Speed test completed: {wifiSpeed} Mbps</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/workspace/dashboard")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0a1f56] hover:bg-[#0a1f56]/90"
                disabled={isSubmitting || !wifiTested || photos.length === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Listing"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Congratulations!</DialogTitle>
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
              <div className="text-lg font-medium mb-2">You have submitted your listing application on Mahali.</div>
              <div className="text-sm text-gray-500">
                We've sent a confirmation email to your address. Your application is now under review and you should
                expect a decision within 2-3 business days.
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={handleConfirmationClose} className="bg-[#0a1f56] hover:bg-[#0a1f56]/90">
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}