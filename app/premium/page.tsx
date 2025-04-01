"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, LogOut, Settings, Star, User } from "lucide-react"
import confetti from "canvas-confetti"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"

export default function PremiumPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

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
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth")
    router.push("/")
  }

  const handleUpgrade = async () => {
    setIsSubmitting(true)

    try {
      // In a real application, you would process payment and upgrade the user
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set premium status in local storage
      localStorage.setItem("mahali-premium-status", "active")

      // Show confirmation dialog with confetti
      setShowConfirmation(true)

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#0a1f56", "#FFA500"],
      })
    } catch (err) {
      console.error("Error upgrading to premium:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    router.push("/events")
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Upgrade to MAHALI Premium</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock exclusive access to networking events, connect with like-minded professionals, and elevate your
              workspace experience with premium benefits.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <RadioGroup
              value={billingCycle}
              onValueChange={setBillingCycle}
              className="flex bg-gray-100 p-1 rounded-full"
            >
              <div
                className="flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer"
                onClick={() => setBillingCycle("monthly")}
              >
                <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                <Label
                  htmlFor="monthly"
                  className={`cursor-pointer px-3 py-1.5 rounded-full ${billingCycle === "monthly" ? "bg-white shadow-sm font-medium" : ""}`}
                >
                  Monthly
                </Label>
              </div>
              <div
                className="flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer"
                onClick={() => setBillingCycle("annual")}
              >
                <RadioGroupItem value="annual" id="annual" className="sr-only" />
                <Label
                  htmlFor="annual"
                  className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center ${billingCycle === "annual" ? "bg-white shadow-sm font-medium" : ""}`}
                >
                  Annual
                  <Badge className="ml-2 bg-green-100 text-green-800 border-0">Save 20%</Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <CardDescription>Basic workspace booking</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Free</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Book workspaces across Nairobi</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>View workspace details and amenities</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Manage your bookings</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Access to exclusive networking events</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Connect with other professionals</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Priority booking for popular workspaces</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-[#0a1f56] relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <Badge className="bg-[#0a1f56]">Recommended</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Premium
                  <Star className="h-5 w-5 ml-2 text-yellow-500 fill-yellow-500" />
                </CardTitle>
                <CardDescription>Enhanced workspace experience</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{billingCycle === "monthly" ? "KSh 1,499" : "KSh 14,390"}</span>
                  <span className="text-gray-500 ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>All Standard features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Access to exclusive networking events</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Connect with other professionals</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Priority booking for popular workspaces</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>10% discount on all workspace bookings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Dedicated customer support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90"
                  onClick={handleUpgrade}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Welcome to Premium!</DialogTitle>
            <DialogDescription className="text-center pt-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#0a1f56]/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-[#0a1f56] fill-yellow-500" />
                </div>
              </div>
              <div className="text-lg font-medium mb-2">You're now a MAHALI Premium member!</div>
              <div className="text-sm text-gray-500">
                You now have access to exclusive events, networking opportunities, and premium benefits. Explore the
                Events section to get started.
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={handleConfirmationClose} className="bg-[#0a1f56] hover:bg-[#0a1f56]/90">
              Explore Events
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

