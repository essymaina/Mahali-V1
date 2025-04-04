import { supabase } from "./supabase" // or './supabaseClient' depending on your setup
import type { Workspace } from "./supabaseTypes"

export async function getWorkspaces(category?: string, location?: string, date?: string): Promise<Workspace[]> {
  let query = supabase.from("workspaces").select("*")

  if (category && category !== "All Workspaces") {
    query = query.eq("category", category)
  }

  if (location && location !== "All Locations") {
    query = query.eq("location", location)
  }

  // Date filtering would require checking availability in bookings table
  // This is a simplified version

  const { data, error } = await query

  if (error) {
    console.error("Error fetching workspaces:", error)
    return []
  }

  return data || []
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const { data, error } = await supabase.from("workspaces").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching workspace:", error)
    return null
  }

  return data
}

export async function createWorkspace(
  workspace: Omit<Workspace, "id" | "created_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase.from("workspaces").insert([workspace]).select()

  if (error) {
    console.error("Error creating workspace:", error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.[0]?.id }
}

export async function updateWorkspace(
  id: string,
  workspace: Partial<Workspace>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("workspaces").update(workspace).eq("id", id)

  if (error) {
    console.error("Error updating workspace:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteWorkspace(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("workspaces").delete().eq("id", id)

  if (error) {
    console.error("Error deleting workspace:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getOwnerWorkspaces(ownerId: string): Promise<Workspace[]> {
  const { data, error } = await supabase.from("workspaces").select("*").eq("owner_id", ownerId)

  if (error) {
    console.error("Error fetching owner workspaces:", error)
    return []
  }

  return data || []
}