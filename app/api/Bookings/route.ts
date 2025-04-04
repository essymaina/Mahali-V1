import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { getUserSession } from "../../../utils/auth"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get all bookings for the current user
export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, workspaces(*)")
    .eq("user_id", user.id)
    .order("start_time", { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// Create a new booking
export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { workspace_id, start_time, end_time, payment_method } = await req.json()

    // Validate input
    if (!workspace_id || !start_time || !end_time) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if workspace is available for the selected time slot
    const { data: existingBookings, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("workspace_id", workspace_id)
      .gte("end_time", start_time)
      .lte("start_time", end_time)

    if (bookingError) throw bookingError

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ success: false, error: "Workspace not available at selected time" }, { status: 400 })
    }

    // TODO: Integrate payment processing here
    const paymentSuccess = true // Mocking successful payment

    if (!paymentSuccess) {
      return NextResponse.json({ success: false, error: "Payment failed" }, { status: 400 })
    }

    // Insert new booking
    const bookingId = uuidv4()
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          id: bookingId,
          user_id: user.id,
          workspace_id,
          start_time,
          end_time,
          status: "confirmed",
        },
      ])
      .select("*")
      .single()

    if (error) throw error

    // Generate QR Code URL
    const qrCodeUrl = `https://www.mahalispaces.com/check-in/${bookingId}`

    // TODO: Send confirmation email with QR Code

    return NextResponse.json({
      success: true,
      message: "Booking confirmed",
      data: { ...data, qrCodeUrl },
    })
  } catch (error) {
    console.error("Error processing booking:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
