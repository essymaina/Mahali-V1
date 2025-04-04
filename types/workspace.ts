export interface Workspace {
    id: string
    name: string
    category: string
    location: string
    price: number
    rating: number
    images: string[]
    description: string
    amenities?: string[]
  }  