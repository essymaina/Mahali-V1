import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { useAuthStore } from "app/store/authStore";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MAHALI - Workspace Booking Platform",
  description: "Find and book workspaces across Nairobi",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUser({ id: data.user.id, email: data.user.email });
    };

    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar /> {/* Add a Navbar for global navigation */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
