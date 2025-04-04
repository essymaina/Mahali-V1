import { supabase } from "./supabaseClient"
import { type Booking } from "./supabaseTypes"

export async function getUserBookings(
  userId: string,
  status?: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<Booking[]> {
  let query = supabase
    .from("bookings")
    .select(`
      *,
      workspaces:workspace_id (
        name,
        location,
        category,
        images
      )
    `)
    .eq("user_id", userId)

  if (status) {
    query = query.eq("status", status)
  }

  // Order by date, most recent first
  query = query.order("date", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching user bookings:", error)
    return []
  }

  return data || []
}

export async function getWorkspaceBookings(
  workspaceId: string,
  status?: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<Booking[]> {
  let query = supabase
    .from("bookings")
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name
      )
    `)
    .eq("workspace_id", workspaceId)

  if (status) {
    query = query.eq("status", status)
  }

  // Order by date
  query = query.order("date", { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching workspace bookings:", error)
    return []
  }

  return data || []
}

export async function createBooking(
  booking: Omit<Booking, "id" | "created_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase.from("bookings").insert([booking]).select()

  if (error) {
    console.error("Error creating booking:", error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.[0]?.id }
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function checkAvailability(
  workspaceId: string,
  date: string,
  startTime: string,
  endTime: string,
): Promise<{ available: boolean; conflictingBookings?: Booking[] }> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("date", date)
    .or(`status.eq.pending,status.eq.confirmed`)

  if (error) {
    console.error("Error checking availability:", error)
    return { available: false }
  }

  // Check for time conflicts
  const conflictingBookings = data.filter((booking) => {
    // Simple time overlap check
    return (
      (startTime >= booking.start_time && startTime < booking.end_time) ||
      (endTime > booking.start_time && endTime <= booking.end_time) ||
      (startTime <= booking.start_time && endTime >= booking.end_time)
    )
  })

  return {
    available: conflictingBookings.length === 0,
    conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined,
  }
}