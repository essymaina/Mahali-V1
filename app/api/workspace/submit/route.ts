import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;

    let query = supabase.from("workspaces").select("*");

    // Apply filters
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (category) {
      query = query.ilike("category", `%${category}%`);
    }

    // Sorting: First by 'editor's pick' (assumes a boolean column `editors_pick`), then most recent
    query = query.order("editors_pick", { ascending: false }).order("created_at", { ascending: false });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Fetch data
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, workspaces: data });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch workspaces" }, { status: 500 });
  }
}
