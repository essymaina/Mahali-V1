import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0]; // Get today's date

    // Fetch user bookings
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) throw error;

    // Categorize bookings
    const upcoming = bookings.filter((booking) => booking.date >= today);
    const completed = bookings.filter((booking) => booking.date < today);

    return NextResponse.json({ success: true, upcoming, completed });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch booking history" }, { status: 500 });
  }
}
