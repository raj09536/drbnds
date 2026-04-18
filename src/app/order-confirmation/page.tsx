"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, ShoppingBag, Home, Banknote, Smartphone } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

function OrderConfirmationContent() {
    const params = useSearchParams()
    const router = useRouter()
    const orderNumber = params.get('id') || '—'
    const paymentType = params.get('type') as 'cod' | 'upi' | null

    return (
        <div className="container mx-auto px-4 md:px-6 py-20 flex justify-center">
            <div className="max-w-[560px] w-full text-center">
                {/* Animated checkmark */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-[#7fb99a20] flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle size={44} className="text-[#3d6b52]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h1
                        className="font-bold text-[#1a3a2a] mb-2"
                        style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "clamp(28px, 4vw, 38px)" }}
                    >
                        Order Placed Successfully!
                    </h1>
                    <p className="text-[#1a3a2a60] font-semibold mb-6" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}>
                        Order #{orderNumber}
                    </p>

                    {/* Payment badge */}
                    {paymentType === 'cod' && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[13px] mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            <Banknote size={15} />
                            Cash on Delivery
                        </span>
                    )}
                    {paymentType === 'upi' && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[13px] mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            <Smartphone size={15} />
                            UPI Payment — Awaiting Confirmation
                        </span>
                    )}

                    {/* Info box */}
                    <div className="bg-[#1a3a2a08] border border-[#1a3a2a15] rounded-2xl p-5 mb-8 text-left">
                        <p className="text-[#1a3a2a] text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Our team will contact you shortly to confirm your delivery charges and estimated delivery time.
                            A WhatsApp message has been sent to our pharmacist with your order details.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => router.push('/shop')}
                            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1a3a2a] text-white font-bold text-[14px] hover:brightness-110 transition-all cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            <ShoppingBag size={16} />
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#1a3a2a20] text-[#1a3a2a] font-bold text-[14px] hover:bg-[#1a3a2a08] transition-all cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            <Home size={16} />
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />
            <Suspense fallback={<div className="py-32 text-center text-[#1a3a2a60]">Loading...</div>}>
                <OrderConfirmationContent />
            </Suspense>
            <Footer />
        </main>
    )
}
