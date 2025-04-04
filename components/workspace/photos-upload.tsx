"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Upload, Plus, Camera } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

interface Photo {
  id: string
  url: string
  name: string
  type: string
  file: File
}

interface PhotosUploadProps {
  photos: Photo[]
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
}

export function PhotosUpload({ photos, setPhotos }: PhotosUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [currentPhotoType, setCurrentPhotoType] = useState("")

  const MAX_PHOTOS = 12
  const PHOTO_TYPES = [
    { value: "exterior", label: "Exterior" },
    { value: "interior", label: "Interior" },
    { value: "window-seat", label: "Window Seat" },
    { value: "lounge", label: "Lounge Area" },
    { value: "bar-seating", label: "Bar Seating" },
    { value: "booth", label: "Booth" },
    { value: "private-room", label: "Private Room" },
    { value: "outdoor", label: "Outdoor Area" },
    { value: "meeting-room", label: "Meeting Room" },
    { value: "hot-desk", label: "Hot Desk" },
    { value: "dedicated-desk", label: "Dedicated Desk" },
    { value: "amenities", label: "Amenities" },
  ]

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0] && photos.length < MAX_PHOTOS && currentPhotoType) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0] && photos.length < MAX_PHOTOS && currentPhotoType) {
      handleFiles(target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newPhotos = Array.from(files)
      .slice(0, MAX_PHOTOS - photos.length)
      .map((file) => {
        // In a real app, you would upload the file to a server and get a URL back
        // For this demo, we'll create an object URL
        return {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
          name: file.name,
          type: currentPhotoType,
          file: file,
        }
      })

    setPhotos([...photos, ...newPhotos])
    setCurrentPhotoType("")
  }

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id))
  }

  const getTypeLabel = (type: string) => {
    const photoType = PHOTO_TYPES.find((t) => t.value === type)
    return photoType ? photoType.label : type
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Workspace Photos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload up to 12 photos of your workspace. Be sure to include different seating options and areas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="photoType">Photo Type</Label>
            <Select value={currentPhotoType} onValueChange={setCurrentPhotoType}>
              <SelectTrigger id="photoType" className="border-2 border-solid">
                <SelectValue placeholder="Select photo type" />
              </SelectTrigger>
              <SelectContent>
                {PHOTO_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              {photos.length} of {MAX_PHOTOS} photos uploaded
            </div>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive ? "border-[#0a1f56] bg-[#0a1f56]/5" : "border-gray-300"} ${!currentPhotoType ? "opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <Camera className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-center text-gray-500 mb-4">
              Drag and drop your photos here, or click to select files
            </p>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              disabled={photos.length >= MAX_PHOTOS || !currentPhotoType}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const fileUpload = document.getElementById("file-upload")
              if (fileUpload) {
                fileUpload.click()
              }
            }}
              disabled={photos.length >= MAX_PHOTOS || !currentPhotoType}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Photos
            </Button>
            {!currentPhotoType && (
              <p className="text-sm text-center text-amber-600 mt-4">Please select a photo type before uploading</p>
            )}
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Uploaded Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="relative aspect-square rounded-md overflow-hidden border">
                  <Image src={photo.url || "/placeholder.svg"} alt={photo.name} fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2 truncate">
                  {getTypeLabel(photo.type)}
                </div>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => {
                  const fileUpload = document.getElementById("file-upload")
                  if (fileUpload) {
                    fileUpload.click()
                  }
                }}
                disabled={!currentPhotoType}
                className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center aspect-square ${!currentPhotoType ? "opacity-50" : "hover:border-[#0a1f56] hover:bg-[#0a1f56]/5"}`}
              >
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}