import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppointmentProvider } from "@/context/AppointmentContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr. BND's Homoeopathic & Psychotherapy Clinic | Dehradun",
  description:
    "Experience holistic healing and mental wellness with Dr. BND in Dehradun. Specialized in classical Homoeopathy and compassionate Psychotherapy across two clinic locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased font-sans`}
      >
        <AppointmentProvider>
          {children}
        </AppointmentProvider>
        <Toaster position="top-center" expand={false} richColors />
      </body>
    </html>
  );
}
