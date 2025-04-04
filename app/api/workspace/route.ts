import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { cookies } from "next/headers"

// Define photo type
interface PhotoData {
  url: string
  type: string
}

// CREATE a workspace
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { owner_id, name, location, price, category, description, amenities, photos, wifi_speed } = await req.json()

    // Validate required fields
    if (!owner_id || !name || !location || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("workspaces")
      .insert([
        {
          owner_id,
          name,
          location,
          price,
          category,
          description,
          amenities,
          wifi_speed,
          status: "pending", // All new workspaces start as pending
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // If photos were provided, insert them
    if (photos && photos.length > 0 && data && data[0]) {
      const workspace_id = data[0].id

      const photoInserts = photos.map((photo: PhotoData) => ({
        workspace_id,
        url: photo.url,
        type: photo.type,
      }))

      const { error: photoError } = await supabase.from("workspace_photos").insert(photoInserts)

      if (photoError) {
        console.error("Error inserting photos:", photoError)
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("Error creating workspace:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// READ all workspaces for an owner
export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { searchParams } = new URL(req.url)
    const owner_id = searchParams.get("owner_id")
    const location = searchParams.get("location")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = 10

    let query = supabase.from("workspaces").select("*, workspace_photos(*)")

    // Filter by owner if provided
    if (owner_id) {
      query = query.eq("owner_id", owner_id)
    }

    // Apply additional filters
    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    if (category) {
      query = query.ilike("category", `%${category}%`)
    }

    // Sorting: First by 'editor's pick' (assumes a boolean column `editors_pick`), then most recent
    query = query.order("editors_pick", { ascending: false }).order("created_at", { ascending: false })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    // Fetch data
    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, workspaces: data })
  } catch (error) {
    console.error("Error fetching workspaces:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}