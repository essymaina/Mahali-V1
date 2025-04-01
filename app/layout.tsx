// app/layout.tsx (server component)
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/navbar";
import AuthProvider from "../components/AuthProvider"; // New wrapper for auth logic

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MAHALI - Workspace Booking Platform",
  description: "Find and book workspaces across Nairobi",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <AuthProvider>{children}</AuthProvider> {/* Auth logic inside client provider */}
        </ThemeProvider>
      </body>
    </html>
  );
}

