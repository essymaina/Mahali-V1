"use client"

import { useState, useEffect } from "react"
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

interface WorkspaceFilterProps {
  onFilterChange?: (filter: {
    category?: string
    location?: string
    date?: Date
  }) => void
  selectedCategory?: string
  selectedLocation?: string
  selectedDate?: Date
}

export function WorkspaceFilter({
  onFilterChange,
  selectedCategory = "All Workspaces",
  selectedLocation = "All Locations",
  selectedDate,
}: WorkspaceFilterProps) {
  const [category, setCategory] = useState<string>(selectedCategory)
  const [location, setLocation] = useState<string>(selectedLocation)
  const [date, setDate] = useState<Date | undefined>(selectedDate)

  useEffect(() => {
    setCategory(selectedCategory)
    setLocation(selectedLocation)
    setDate(selectedDate)
  }, [selectedCategory, selectedLocation, selectedDate])

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    onFilterChange?.({ category: newCategory })
  }

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    onFilterChange?.({ location: newLocation })
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    onFilterChange?.({ date: newDate })
  }

  const handleSearch = () => {
    onFilterChange?.({
      category,
      location,
      date,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-3xl mx-auto">
      {/* Workspace Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between">
            <span className={cn("mr-2", category === "All Workspaces" ? "text-muted-foreground" : "")}>
              {category === "All Workspaces" ? "Workspace" : category}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {workspaceCategories.map((cat) => (
            <DropdownMenuItem
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(cat === category && "font-medium bg-accent")}
            >
              {cat}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Location Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-between">
            <MapPin className="mr-2 h-4 w-4" />
            <span className={cn(location === "All Locations" ? "text-muted-foreground" : "")}>
              {location === "All Locations" ? "Where" : location}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
          {locations.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocationChange(loc)}
              className={cn(loc === location && "font-medium bg-accent")}
            >
              {loc}
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
          <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button className="w-full sm:w-auto" onClick={handleSearch}>
        Search
      </Button>
    </div>
  )
}