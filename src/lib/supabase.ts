import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use ANON KEY for frontend
);

/**
 * Function to update a user's role
 * @param userId - The user's ID from Supabase Auth
 * @param role - New role ('user' | 'premium' | 'owner' | 'admin')
 */
export const setUserRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error setting role:", error);
    return false;
  }
  return true;
};

