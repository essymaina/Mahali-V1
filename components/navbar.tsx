"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { useAuth } from "./auth-context"

export default function Navbar() {
  const {user, isLoading, logout} = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          MAHALI
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link href="/workspaces" className="text-sm font-medium hover:underline">
            Workspaces
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
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
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/bookings" className="w-full">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={ logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="md:hidden flex justify-center gap-4 sm:gap-6 py-2 border-t">
        <Link href="/workspaces" className="text-sm font-medium hover:underline">
          Workspaces
        </Link>
        <Link href="/about" className="text-sm font-medium hover:underline">
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline">
          Contact
        </Link>
      </div>
    </header>
  )
}