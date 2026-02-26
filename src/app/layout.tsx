import type { Metadata } from "next";
import { Geist, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. BND's Homoeopathic & Psychotherapy Clinic",
  description: "Experience holistic healing and mental wellness with Dr. BND in Dehradun. Specialized in Homoeopathy and Psychotherapy.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${inter.variable} ${playfair.variable} antialiased font-sans`}
      >
        {children}
        <Toaster position="top-center" expand={false} richColors />
      </body>
    </html>
  );
}

