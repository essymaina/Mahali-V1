'use client'

import { useState } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select'

export default function TestSelectPage() {
  const [value, setValue] = useState('')
  
  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Select Test</h1>
      <div className="w-64">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent sideOffset={4} className="z-50">
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-4">Selected value: {value}</p>
      </div>
    </div>
  )
}