"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Calendar } from "../components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronDown, MapPin } from "lucide-react"
import { format } from "date-fns"

// Updated workspace categories as requested
const workspaceCategories = [
  "All Workspaces",
  "Art Gallery",
  "Coffee Shop",
  "Coworking Space",
  "Restaurant",
  "Garden",
  "Meeting Room",
  "Event Space",
  "Conference Room",
]

// Expanded list of locations
const locations = [
  "All Locations",
  "Nairobi CBD",
  "Westlands",
  "Kilimani",
  "Karen",
  "Parklands",
  "Gigiri",
  "Lavington",
  "Kileleshwa",
  "Upperhill",
  "Ngong Road",
  "Mombasa Road",
  "Thika Road",
  "Eastleigh",
  "South B",
  "South C",
  "Kitisuru",
  "Runda",
  "Muthaiga",
]

export function WorkspaceFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Workspaces")
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations")
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-3xl mx-auto">
      {/* Workspace Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between">
            <span className={cn("mr-2", selectedCategory === "All Workspaces" ? "text-muted-foreground" : "")}>
              {selectedCategory === "All Workspaces" ? "Workspace" : selectedCategory}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {workspaceCategories.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(category === selectedCategory && "font-medium bg-accent")}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Location Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between">
            <MapPin className="mr-2 h-4 w-4" />
            <span className={cn(selectedLocation === "All Locations" ? "text-muted-foreground" : "")}>
              {selectedLocation === "All Locations" ? "Where" : selectedLocation}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
          {locations.map((location) => (
            <DropdownMenuItem
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={cn(location === selectedLocation && "font-medium bg-accent")}
            >
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full sm:w-auto justify-between", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "When"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button className="w-full sm:w-auto">Search</Button>
    </div>
  )
}