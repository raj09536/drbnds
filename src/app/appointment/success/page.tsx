"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Phone, ArrowRight, Home } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function AppointmentSuccessPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-20 flex flex-col items-center text-center max-w-xl">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                    style={{ background: "rgba(26,58,42,0.1)" }}
                >
                    <CheckCircle size={52} className="text-[#1a3a2a]" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-bold text-[#1a3a2a]"
                    style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(28px, 5vw, 40px)" }}
                >
                    Appointment Request Sent!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-[#1a3a2a80] text-[15px] leading-relaxed"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                    Your appointment request has been sent via WhatsApp. Our team will confirm your slot shortly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 w-full p-5 rounded-2xl flex items-center gap-4"
                    style={{ background: "rgba(26,58,42,0.06)", border: "1px solid rgba(26,58,42,0.1)" }}
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(26,58,42,0.1)" }}>
                        <Phone size={18} className="text-[#1a3a2a]" />
                    </div>
                    <div className="text-left">
                        <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60]" style={{ fontFamily: "var(--font-dm-sans)" }}>Clinic Contact</p>
                        <p className="text-[15px] font-bold text-[#1a3a2a] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>+91-8191919949</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row gap-4 w-full"
                >
                    <Link
                        href="/appointment"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[14px] border-2 border-[#1a3a2a] text-[#1a3a2a] hover:bg-[#1a3a2a] hover:text-white transition-all"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                        Book Another <ArrowRight size={15} />
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[14px] text-white transition-all hover:brightness-110"
                        style={{ background: "var(--forest, #1a3a2a)", fontFamily: "var(--font-dm-sans)" }}
                    >
                        <Home size={15} /> Return to Home
                    </Link>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
