import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { getUserSession } from "@/utils/auth"
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

    // Fetch booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, user_id, status, start_time")
      .eq("id", booking_id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // Check if booking is already canceled
    if (booking.status === "canceled") {
      return NextResponse.json({ success: false, error: "Booking is already canceled" }, { status: 400 })
    }

    // Ensure cancellation is before check-in time
    const now = new Date()
    const startTime = new Date(booking.start_time)

    if (now >= startTime) {
      return NextResponse.json(
        { success: false, error: "Booking cannot be canceled after start time" },
        { status: 400 },
      )
    }

    // Update the booking status to "canceled"
    const { error: updateError } = await supabase.from("bookings").update({ status: "canceled" }).eq("id", booking_id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: "Booking canceled successfully",
    })
  } catch (error) {
    console.error("Error canceling booking:", error)
    return NextResponse.json({ success: false, error: "Failed to cancel booking" }, { status: 500 })
  }
}