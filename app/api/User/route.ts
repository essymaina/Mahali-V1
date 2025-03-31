import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status"); // optional filter (upcoming, completed, incomplete)
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10; // 10 results per page

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  try {
    let query = supabase.from("bookings").select("*").eq("user_id", userId);

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Apply sorting (newest first)
    query = query.order("booking_date", { ascending: false });

    // Apply pagination
    const { data, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return NextResponse.json({ success: true, bookings: data });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 });
  }
}
