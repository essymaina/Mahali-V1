"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, ExternalLink, LogOut, Settings, User, Wifi } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import PhotosUpload from "./photos-upload"

export default function ListWorkspacePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [wifiTested, setWifiTested] = useState(false)
  const [wifiSpeed, setWifiSpeed] = useState(null)
  const [photos, setPhotos] = useState([])

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
    // Check if user is logged in and is a workspace owner
    const authData = localStorage.getItem("mahali-user-auth")

    if (!authData) {
      router.push("/auth/workspace/login")
      return
    }

    const userData = JSON.parse(authData)

    if (userData.type !== "workspace") {
      router.push("/auth/workspace/login")
      return
    }

    setUser(userData)
    setEmail(userData.email || "")
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const handleWifiTest = () => {
    // In a real application, this would redirect to Measurement Lab
    // For this demo, we'll simulate a WiFi test result
    window.open("https://speed.measurementlab.net", "_blank")

    // Simulate getting results back
    setTimeout(() => {
      const randomSpeed = Math.floor(Math.random() * 50) + 20 // Random speed between 20-70 Mbps
      setWifiSpeed(randomSpeed)
      setWifiTested(true)
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, you would submit to a backend
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.businessName || "Business Name"}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspace/dashboard">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/workspace/settings">
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
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
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

