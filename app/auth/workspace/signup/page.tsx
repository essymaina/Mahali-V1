"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building } from "lucide-react"

import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Separator } from "../../../../components/ui/separator"
import { Checkbox } from "../../../../components/ui/checkbox"

export default function WorkspaceSignupPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // In a real application, you would register with a backend
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful registration
      localStorage.setItem(
        "mahali-user-auth",
        JSON.stringify({
          email,
          businessName,
          contactName,
          phone,
          type: "workspace",
        }),
      )
      router.push("/workspace/dashboard")
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white bg-[#0a1f56] px-4 py-2">MAHALI</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 border rounded-lg shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-[#0a1f56]/10 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-[#0a1f56]" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Register as Workspace Owner</h1>

            {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person Name</Label>
                <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 XXX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#0a1f56] hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#0a1f56] hover:underline">
                    privacy policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/auth/workspace/login" className="text-[#0a1f56] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Looking to book a workspace?</p>
              <Button variant="outline" className="w-full" onClick={() => router.push("/auth/user/signup")}>
                Register as a user
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

