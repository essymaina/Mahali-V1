"use client"; // Required for state-based components in Next.js App Router

import { useAuthStore } from "../app/store/authStore";
import { supabase } from "../src/lib/supabaseClient";

export default function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-lg font-bold">MAHALI</h1>
      <div>
        {user ? (
          <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        ) : (
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
