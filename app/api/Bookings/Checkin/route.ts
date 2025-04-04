import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { getUserSession } from "../../../../utils/auth"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { booking_id } = await req.json()

    if (!booking_id) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 })
    }

    // Check if the booking exists and belongs to the user
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status, user_id")
      .eq("id", booking_id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Ensure the booking is not already checked in
    if (booking.status === "checked-in") {
      return NextResponse.json({ success: false, error: "Already checked in" }, { status: 400 })
    }

    // Mark as checked-in
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "checked-in",
        check_in_time: new Date().toISOString(),
      })
      .eq("id", booking_id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
    })
  } catch (error) {
    console.error("Error during check-in:", error)
    return NextResponse.json({ success: false, error: "Failed to check in" }, { status: 500 })
  }
}
