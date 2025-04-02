'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export default function SearchForm() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    if (date) params.set("date", date)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-gray-50 py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Workspace Type Dropdown */}
          <div className="w-full md:w-1/4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Workspace Type" />
              </SelectTrigger>
              <SelectContent sideOffset={4} className="z-50 w-[var(--radix-select-trigger-width)]">
                <SelectItem value="art-gallery">Art Gallery</SelectItem>
                <SelectItem value="coffee-shop">Coffee Shop</SelectItem>
                <SelectItem value="coworking-space">Coworking Space</SelectItem>
                <SelectItem value="garden">Garden</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Dropdown */}
          <div className="w-full md:w-1/4">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Where?" />
              </SelectTrigger>
              <SelectContent sideOffset={4} className="z-50 w-[var(--radix-select-trigger-width)]">
                <SelectItem value="westlands">Westlands</SelectItem>
                <SelectItem value="kilimani">Kilimani</SelectItem>
                <SelectItem value="karen">Karen</SelectItem>
                <SelectItem value="cbd">CBD</SelectItem>
                <SelectItem value="lavington">Lavington</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Dropdown */}
          <div className="w-full md:w-1/4">
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="When" />
              </SelectTrigger>
              <SelectContent sideOffset={4} className="z-50 w-[var(--radix-select-trigger-width)]">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="next-week">Next Week</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-1/4">
            <Button 
              className="w-full bg-[#0a1f56] hover:bg-[#0a1f56]/90 text-white" 
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}