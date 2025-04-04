"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu"
import { Building, LogOut, Plus, User } from "lucide-react"
import { useAuth } from "./auth-context"
import { Badge } from "../components/ui/badge"

//Define the User type
interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  user_type?: string
  isPremium?: boolean
}

export default function Navbar() {
  const { user, isLoading, logout, isPremium } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          MAHALI
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link href="/bookings" className="text-sm font-medium hover:underline">
            My Bookings
          </Link>
          <Link href="/events" className="text-sm font-medium hover:underline">
            Events
          </Link>
          {user?.type === "owner" && (
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
          )}
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <span className="h-5 w-5 rounded-full bg-muted animate-pulse"></span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {(user as UserProfile).firstName} {(user as UserProfile).lastName}
                      {isPremium && (
                        <Badge variant="outline" className="ml-2 bg-[#0a1f56]/10 text-[#0a1f56] border-[#0a1f56]/20">
                          Premium
                        </Badge>
                      )}
                      {user.type === "owner" && (
                        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                          <Building className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    My Settings
                  </Link>
                </DropdownMenuItem>
                {user.type === "owner" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="w-full">
                        Owner Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/workspaces/new" className="w-full flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Workspace
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="md:hidden flex justify-center gap-4 sm:gap-6 py-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/events">Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/bookings">My Bookings</Link>
            </DropdownMenuItem>
            {user?.type === "owner" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">My Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">My Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
