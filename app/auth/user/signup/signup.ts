import { supabase, setUserRole } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, role } = req.body;

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  const user = data.user;
  if (!user) return res.status(500).json({ error: "User creation failed" });

  // Set user role in database
  const success = await setUserRole(user.id, role || "user");

  if (!success) return res.status(500).json({ error: "Failed to set role" });

  res.status(200).json({ message: "User created successfully", user });
}