"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, User, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "src/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

// Define the expected shape of the user object
interface User {
  type: "workspace" | "user";
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export default function HomePage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem("mahali-user-auth");
    if (authData) {
      try {
        const userData: User = JSON.parse(authData);
        setUser(userData);
      } catch (err) {
        console.error("Failed to parse user data", err);
        localStorage.removeItem("mahali-user-auth");
      }
    }
  }, []);

  const handleSearch = () => {
    if (!category || !date) {
      setError("Please select a workspace category and date to continue");
      return;
    }
    setError("");
    const searchParams = new URLSearchParams({ category, location, date });
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("mahali-user-auth");
    setUser(null);
  };

  const handleLoginRedirect = () => {
    if (user?.type === "workspace") {
      router.push("/workspace/dashboard");
    } else {
      router.push("/auth/user/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white bg-[#0a1f56] dark:bg-[#1a2f66] px-4 py-2">MAHALI</h1>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/events" className="font-medium dark:text-gray-200">EVENTS</a>
            <a href="/bookings" className="font-medium dark:text-gray-200">BOOKINGS</a>
            <a href="/" className="font-medium dark:text-gray-200">HOME</a>
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="p-2">
                    <p className="font-medium">{user.type === "workspace" ? user.businessName : `${user.firstName} ${user.lastName}`}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(user.type === "workspace" ? "/workspace/dashboard" : "/bookings")}>
                    {user.type === "workspace" ? "Dashboard" : "My Bookings"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLoginRedirect}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button className="w-full h-12 bg-[#0a1f56] text-white" onClick={handleSearch}>
          <Search className="h-5 w-5" /> Search
        </Button>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bonne%20rentr%C3%A9e%20%C3%A0%20toutes%20et%20tous%20%21-O8ymC6gxGuLl6GLHvh9Y7JVQFk4Rcl.jpeg"
          alt="Workspace"
          width={1200}
          height={600}
          className="w-full h-auto rounded-lg"
          priority
        />
      </main>
    </div>
  );
}


