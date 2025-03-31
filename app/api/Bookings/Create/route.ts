import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid"; // For generating unique booking IDs

export async function POST(request: Request) {
  try {
    const { userId, workspaceId, startTime, endTime, paymentMethod } = await request.json();

    // Validate input
    if (!userId || !workspaceId || !startTime || !endTime || !paymentMethod) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if workspace is available for the selected time slot
    const { data: existingBookings, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("workspace_id", workspaceId)
      .gte("end_time", startTime)
      .lte("start_time", endTime);

    if (bookingError) throw bookingError;

    if (existingBookings.length > 0) {
      return NextResponse.json({ success: false, message: "Workspace not available at selected time" }, { status: 400 });
    }

    // TODO: Integrate M-Pesa or Stripe payment processing here
    const paymentSuccess = true; // Mocking successful payment

    if (!paymentSuccess) {
      return NextResponse.json({ success: false, message: "Payment failed" }, { status: 400 });
    }

    // Insert new booking
    const bookingId = uuidv4();
    const { data, error } = await supabase
      .from("bookings")
      .insert([{ id: bookingId, user_id: userId, workspace_id: workspaceId, start_time: startTime, end_time: endTime }]);

    if (error) throw error;

    // Generate QR Code (Placeholder - Need to integrate QR code library)
    const qrCodeUrl = `https://mahali.com/check-in/${bookingId}`;

    // TODO: Send confirmation email with QR Code

    return NextResponse.json({ success: true, message: "Booking confirmed", bookingId, qrCodeUrl });
  } catch (error) {
    console.error("Error processing booking:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
