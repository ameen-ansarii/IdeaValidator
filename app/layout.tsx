import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import NavBar from "./components/NavBar";
import ThemeToggle from "./components/ThemeToggle";
import UserAuth from "./components/UserAuth";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Idea Validator",
  description: "Get a brutal, honest, AI-powered evaluation of your startup idea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              {/* Global Navigation - appears on all pages */}
              <NavBar />
              <ThemeToggle />
              <UserAuth />
              {/* Page Content */}
              {children}
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
