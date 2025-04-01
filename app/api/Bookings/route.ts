import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseClient"
import { getUserSession } from "../../../utils/auth"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("bookings").select("*").eq("user_id", user.id) // Only fetch the logged-in user's bookings

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { workspace_id, start_time, end_time } = await req.json()

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ user_id: user.id, workspace_id, start_time, end_time }])
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { booking_id } = await req.json()

  const { error } = await supabase.from("bookings").delete().match({ id: booking_id, user_id: user.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Booking canceled" })
}