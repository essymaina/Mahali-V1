import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are defined
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Function to update a user's role
 * @param userId - The user's ID from Supabase Auth
 * @param role - New role ('user' | 'premium' | 'owner' | 'admin')
 */
export const setUserRole = async (userId: string, role: string) => {
  const { error } = await supabase.from("users").update({ role }).eq("id", userId);

  if (error) {
    console.error("Error setting role:", error);
    return false;
  }
  return true;
};

/**
 * Function to fetch the current authenticated user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user;
};

/**
 * Function to fetch user role from the database
 * @param userId - The user's ID
 */
export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single();

  if (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
  return data?.role;
};