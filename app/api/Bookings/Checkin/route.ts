import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });
    }

    // Check if the booking exists
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Ensure the booking is not already checked in
    if (booking.status === "checked-in") {
      return NextResponse.json({ success: false, message: "Already checked in" }, { status: 400 });
    }

    // Mark as checked-in
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "checked-in" })
      .eq("id", bookingId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "Check-in successful" });
  } catch (error) {
    console.error("Error during check-in:", error);
    return NextResponse.json({ success: false, message: "Failed to check in" }, { status: 500 });
  }
}
