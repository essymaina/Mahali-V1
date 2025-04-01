import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// 🔹 1️⃣ CREATE a workspace
export async function POST(req: Request) {
    const { owner_id, name, location, price } = await req.json();
  
    const { data, error } = await supabase
      .from("workspaces")
      .insert([{ owner_id, name, location, price }])
      .select();
  
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  }
  
  // 🔹 2️⃣ READ all workspaces for an owner
  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const owner_id = searchParams.get("owner_id");
  
    if (!owner_id) return NextResponse.json({ error: "Owner ID required" }, { status: 400 });
  
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", owner_id);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 200 });
  }
  
  // 🔹 3️⃣ UPDATE a workspace
  export async function PUT(req: Request) {
    const { id, name, location, price } = await req.json();
  
    const { data, error } = await supabase
      .from("workspaces")
      .update({ name, location, price })
      .eq("id", id)
      .select();
  
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 200 });
  }
  
  // 🔹 4️⃣ DELETE a workspace
  export async function DELETE(req: Request) {
    const { id } = await req.json();
  
    const { data, error } = await supabase.from("workspaces").delete().eq("id", id);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Workspace deleted successfully" }, { status: 200 });
  }
  