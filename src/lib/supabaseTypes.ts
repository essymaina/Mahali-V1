// Define database types for better type safety
export type Profile = {
    id: string
    first_name: string | null
    last_name: string | null
    business_name: string | null
    user_type: "user" | "owner" | string
    created_at: string
  }
  
  export type Workspace = {
    id: string
    name: string
    description: string
    location: string
    category: string
    hourly_rate: number | null
    daily_rate: number
    monthly_rate: number | null
    owner_id: string
    created_at: string
    images: string[]
  }
  
  export type Booking = {
    id: string
    workspace_id: string
    user_id: string
    date: string
    start_time: string
    end_time: string
    status: "pending" | "confirmed" | "completed" | "cancelled"
    total_price: number
    created_at: string
  }
  
  export type Event = {
    id: string
    title: string
    description: string
    location: string
    date: string
    category: string
    image: string
    created_at: string
  }
  
  export type Subscription = {
    id: string
    user_id: string
    status: "active" | "cancelled" | "past_due"
    plan: "premium" | "basic"
    current_period_end: string
    created_at: string
  }  