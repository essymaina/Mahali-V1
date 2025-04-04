import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { cookies } from "next/headers"

// GET a specific workspace
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const id = params.id

    const { data, error } = await supabase.from("workspaces").select("*, workspace_photos(*)").eq("id", id).single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 })
    }

    return NextResponse.json({ success: true, workspace: data })
  } catch (error) {
    console.error("Error fetching workspace:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE a workspace
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const id = params.id
    const updates = await req.json()

    // Remove any fields that shouldn't be directly updated
    const { id: _, created_at, updated_at, ...validUpdates } = updates

    const { data, error } = await supabase.from("workspaces").update(validUpdates).eq("id", id).select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, workspace: data[0] })
  } catch (error) {
    console.error("Error updating workspace:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a workspace
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const id = params.id

    // First delete related photos
    const { error: photoError } = await supabase.from("workspace_photos").delete().eq("workspace_id", id)

    if (photoError) {
      console.error("Error deleting workspace photos:", photoError)
    }

    // Then delete the workspace
    const { error } = await supabase.from("workspaces").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Workspace deleted successfully" })
  } catch (error) {
    console.error("Error deleting workspace:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}