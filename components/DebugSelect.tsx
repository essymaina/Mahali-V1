// components/DebugSelect.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export function DebugSelect({ 
  placeholder, 
  options, 
  value, 
  onValueChange 
}: { 
  placeholder: string, 
  options: {value: string, label: string}[], 
  value: string, 
  onValueChange: (value: string) => void 
}) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return (
    <div className="h-10 w-full border rounded-md bg-background px-3 py-2">
      {placeholder}
    </div>
  )

  return (
    <>
      <style jsx global>{`
        [data-radix-popper-content-wrapper] {
          z-index: 9999 !important;
          visibility: visible !important;
          opacity: 1 !important;
          transform: none !important;
          display: block !important;
        }
      `}</style>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          position="popper" 
          sideOffset={4} 
          className="z-[9999] !visible !opacity-100"
          style={{ zIndex: 9999 }}
        >
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}