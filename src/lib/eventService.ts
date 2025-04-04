import { supabase  } from "./supabaseClient"
import { type Event  } from "./supabaseTypes"

export async function getEvents(category?: string): Promise<Event[]> {
  let query = supabase.from("events").select("*").order("date", { ascending: true })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data || []
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function createEvent(
  event: Omit<Event, "id" | "created_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase.from("events").insert([event]).select()

  if (error) {
    console.error("Error creating event:", error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.[0]?.id }
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("events").update(event).eq("id", id)

  if (error) {
    console.error("Error updating event:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting event:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}