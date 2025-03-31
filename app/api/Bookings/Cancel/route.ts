import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { bookingId, userId } = await request.json();

    if (!bookingId || !userId) {
      return NextResponse.json({ success: false, message: "Booking ID and User ID are required" }, { status: 400 });
    }

    // Fetch booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, user_id, status, date, check_in_time")
      .eq("id", bookingId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Check if booking is already canceled
    if (booking.status === "canceled") {
      return NextResponse.json({ success: false, message: "Booking is already canceled" }, { status: 400 });
    }

    // Ensure cancellation is before check-in time
    const now = new Date();
    const checkInTime = new Date(`${booking.date}T${booking.check_in_time}`);

    if (now >= checkInTime) {
      return NextResponse.json({ success: false, message: "Booking cannot be canceled after check-in time" }, { status: 400 });
    }

    // Update the booking status to "canceled"
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "canceled" })
      .eq("id", bookingId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return NextResponse.json({ success: false, message: "Failed to cancel booking" }, { status: 500 });
  }
}

