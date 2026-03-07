"use client"

import { ArrowRight, ChevronDown } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useAppointment } from "@/context/AppointmentContext"

export function Hero() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const { openModal } = useAppointment()

    const scrollToServices = () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: "var(--forest)" }}
        >
            {/* Decorative Overlays */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 15% 25%, rgba(127,185,154,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 75%, rgba(201,168,76,0.12) 0%, transparent 55%)",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 15 30 25 Q25 15 30 5Z' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="container mx-auto px-6 relative z-10" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
                <div className="max-w-3xl">
                    {/* Eyebrow */}
                    <div
                        className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "12px",
                                letterSpacing: "5px",
                                textTransform: "uppercase",
                                color: "var(--mint)",
                            }}
                        >
                            Homoeopathy · Psychotherapy · Dehradun & Bijnor
                        </span>
                    </div>

                    {/* H1 */}
                    <h1
                        className={`mt-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(38px, 5vw, 64px)",
                            fontWeight: 300,
                            color: "white",
                            lineHeight: 1.15,
                            transitionDelay: "150ms",
                        }}
                    >
                        Healing for the{" "}
                        <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Mind</em> &{" "}
                        Body
                    </h1>

                    {/* Subtext */}
                    <p
                        className={`mt-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "16px",
                            color: "rgba(255,255,255,0.65)",
                            maxWidth: "520px",
                            lineHeight: 1.8,
                            transitionDelay: "300ms",
                        }}
                    >
                        Experience the synergy of classical Homoeopathy and compassionate
                        Psychotherapy across our two healing clinics in Dehradun and Bijnor.
                    </p>

                    {/* Buttons */}
                    <div
                        className={`flex flex-col sm:flex-row gap-4 mt-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{ transitionDelay: "450ms" }}
                    >
                        <button
                            onClick={() => openModal()}
                            className="flex items-center justify-center gap-2 bg-gold text-forest rounded-lg hover:brightness-110 transition-all duration-200 cursor-pointer"
                            style={{
                                padding: "14px 32px",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                fontWeight: 600,
                                border: "none",
                            }}
                        >
                            Book a Consultation
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={scrollToServices}
                            className="flex items-center justify-center gap-2 text-white rounded-lg transition-all duration-200 hover:bg-white/8 cursor-pointer"
                            style={{
                                padding: "14px 32px",
                                border: "1px solid rgba(255,255,255,0.4)",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                fontWeight: 600,
                                background: "transparent",
                            }}
                        >
                            Explore Services ↓
                        </button>
                    </div>

                    {/* Badge Pills */}
                    <div
                        className={`flex flex-wrap gap-3 mt-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{ transitionDelay: "600ms" }}
                    >
                        {["🌿 Natural & Safe", "⭐ 15+ Years Experience", "📍 2 Locations"].map((badge) => (
                            <span
                                key={badge}
                                className="rounded-full"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.8)",
                                    padding: "6px 16px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
                <ChevronDown className="w-5 h-5 text-white/40" />
            </div>
        </section>
    )
}
