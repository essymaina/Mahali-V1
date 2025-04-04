import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { workspace_id, start_time, end_time } = await req.json()

    if (!workspace_id || !start_time || !end_time) {
      return NextResponse.json(
        { success: false, error: "Workspace ID, start time, and end time are required" },
        { status: 400 },
      )
    }

    // Check for conflicting bookings
    const { data: existingBookings, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("workspace_id", workspace_id)
      .gte("end_time", start_time)
      .lte("start_time", end_time)
      .not("status", "eq", "canceled") // Exclude canceled bookings

    if (error) throw error

    const isAvailable = !existingBookings || existingBookings.length === 0

    return NextResponse.json({
      success: true,
      available: isAvailable,
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json({ success: false, error: "Failed to check availability" }, { status: 500 })
  }
}