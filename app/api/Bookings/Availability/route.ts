import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { workspaceId, date, timeSlot } = await request.json();

    if (!workspaceId || !date || !timeSlot) {
      return NextResponse.json({ success: false, message: "Workspace ID, date, and time slot are required" }, { status: 400 });
    }

    // Check for conflicting bookings
    const { data: existingBookings, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("date", date)
      .eq("time_slot", timeSlot);

    if (error) throw error;

    const isAvailable = existingBookings.length === 0;

    return NextResponse.json({ success: true, available: isAvailable });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json({ success: false, message: "Failed to check availability" }, { status: 500 });
  }
}
