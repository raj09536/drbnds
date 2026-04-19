"use client"

import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useCountUp } from "@/hooks/useCountUp"

const formatHeroStat = (n: number) => {
    if (n >= 1000000) return (n / 100000).toFixed(0) + "L"
    if (n >= 1000) return (n / 1000).toFixed(0) + "K"
    return n.toString()
}

export function Hero() {
    const { ref, isVisible } = useScrollReveal(0.1)

    const patientsCount = useCountUp(100000, 2200, isVisible)
    const yearsCount = useCountUp(15, 1800, isVisible)
    const clinicsCount = useCountUp(2, 1200, isVisible)

    const scrollToServices = () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            ref={ref}
            className="relative h-svh md:min-h-screen w-full flex items-center overflow-hidden"
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

            <div className="container mx-auto px-5 md:px-6 relative z-10" style={{ paddingTop: "100px", paddingBottom: "60px" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left side */}
                    <div className="max-w-xl">
                        {/* Eyebrow */}
                        <div
                            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            <span
                                className="block tracking-[0.25em] md:tracking-[0.4em] uppercase text-mint font-medium"
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "clamp(10px, 1.5vw, 12px)",
                                }}
                            >
                                Homoeopathy · Psychotherapy · Dehradun & Bijnor
                            </span>
                        </div>

                        {/* H1 */}
                        <h1
                            className={`mt-6 md:mt-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "clamp(34px, 6vw, 64px)",
                                fontWeight: 300,
                                color: "white",
                                lineHeight: 1.1,
                                transitionDelay: "150ms",
                            }}
                        >
                            Healing for the{" "}
                            <em className="text-gold italic">Mind</em> &{" "}
                            <br className="hidden md:block" />
                            Body
                        </h1>

                        {/* Subtext */}
                        <p
                            className={`mt-6 md:mt-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "clamp(14px, 2vw, 18px)",
                                color: "rgba(255,255,255,0.7)",
                                maxWidth: "580px",
                                lineHeight: 1.7,
                                transitionDelay: "300ms",
                            }}
                        >
                            Experience the synergy of classical Homoeopathy and compassionate
                            Psychotherapy across our two healing clinics in Dehradun and Bijnor.
                        </p>

                        {/* Buttons */}
                        <div
                            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mt-10 md:mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: "450ms" }}
                        >
                            <Link
                                href="/appointment"
                                className="group flex items-center justify-center gap-3 bg-gold text-forest rounded-xl hover:brightness-110 transition-all duration-300 min-h-[52px] md:min-h-[58px]"
                                style={{
                                    padding: "16px 36px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                }}
                            >
                                Book a Consultation
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <button
                                onClick={scrollToServices}
                                className="flex items-center justify-center gap-3 text-white rounded-xl transition-all duration-300 hover:bg-white/10 cursor-pointer min-h-[52px] md:min-h-[58px]"
                                style={{
                                    padding: "16px 36px",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    background: "rgba(255,255,255,0.05)",
                                }}
                            >
                                Explore Services
                                <ChevronDown className="w-5 h-5 opacity-60" />
                            </button>
                        </div>

                        {/* Badge Pills */}
                        <div
                            className={`flex flex-wrap gap-2 md:gap-3 mt-12 md:mt-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: "600ms" }}
                        >
                            {["🌿 Natural & Safe", "⭐ 15+ Years Experience", "📍 2 Locations"].map((badge) => (
                                <span
                                    key={badge}
                                    className="rounded-full flex items-center gap-2 whitespace-nowrap"
                                    style={{
                                        background: "rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.9)",
                                        padding: "8px 18px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "clamp(11px, 1.5vw, 13px)",
                                        fontWeight: 500,
                                        backdropFilter: "blur(4px)",
                                    }}
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side — decorative card (desktop only) */}
                    <div
                        className={`hidden md:block transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        <div
                            className="relative overflow-hidden rounded-3xl"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1.5px solid var(--gold)",
                                padding: "40px",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            {/* Botanical SVG background decoration */}
                            <svg
                                className="absolute -bottom-8 -right-8 opacity-[0.07] pointer-events-none"
                                width="260" height="260" viewBox="0 0 260 260"
                                fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="130" cy="130" r="120" stroke="var(--gold)" strokeWidth="2" />
                                <circle cx="130" cy="130" r="90" stroke="var(--gold)" strokeWidth="1.5" />
                                <path d="M130 10 Q145 60 130 110 Q115 60 130 10Z" fill="var(--gold)" />
                                <path d="M130 150 Q145 200 130 250 Q115 200 130 150Z" fill="var(--gold)" />
                                <path d="M10 130 Q60 115 110 130 Q60 145 10 130Z" fill="var(--gold)" />
                                <path d="M150 130 Q200 115 250 130 Q200 145 150 130Z" fill="var(--gold)" />
                                <path d="M44 44 Q80 80 110 110 Q75 80 44 44Z" fill="var(--gold)" opacity="0.6" />
                                <path d="M150 150 Q186 186 216 216 Q181 181 150 150Z" fill="var(--gold)" opacity="0.6" />
                            </svg>

                            {/* Est. eyebrow */}
                            <span
                                className="block mb-3 uppercase tracking-[4px]"
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "10px",
                                    color: "var(--mint)",
                                    fontWeight: 600,
                                }}
                            >
                                Est. 2009
                            </span>

                            {/* Clinic name */}
                            <h3
                                style={{
                                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                    fontSize: "clamp(22px, 2.5vw, 30px)",
                                    fontWeight: 600,
                                    color: "var(--gold)",
                                    lineHeight: 1.2,
                                }}
                            >
                                Dr. BND's<br />Homoeopathic Clinic
                            </h3>

                            {/* Location pills */}
                            <div className="flex gap-2 mt-4 flex-wrap">
                                {["📍 Dehradun", "📍 Bijnor"].map((loc) => (
                                    <span
                                        key={loc}
                                        className="rounded-full"
                                        style={{
                                            background: "rgba(255,255,255,0.08)",
                                            color: "rgba(255,255,255,0.85)",
                                            padding: "6px 14px",
                                            fontFamily: "var(--font-dm-sans)",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {loc}
                                    </span>
                                ))}
                            </div>

                            {/* Divider */}
                            <div
                                className="my-6"
                                style={{ height: "1px", background: "rgba(201,168,76,0.25)" }}
                            />

                            {/* Stat badges */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: formatHeroStat(patientsCount) + "+", label: "Patients" },
                                    { value: yearsCount + "+", label: "Years" },
                                    { value: clinicsCount.toString(), label: "Clinics" },
                                ].map((stat, i) => (
                                    <div key={stat.label} className="relative text-center">
                                        <div
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "clamp(20px, 2.2vw, 26px)",
                                                fontWeight: 800,
                                                color: "var(--gold)",
                                                lineHeight: 1,
                                                letterSpacing: "-0.5px",
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            className="mt-1"
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "10px",
                                                textTransform: "uppercase",
                                                letterSpacing: "2px",
                                                color: "rgba(255,255,255,0.55)",
                                            }}
                                        >
                                            {stat.label}
                                        </div>
                                        {/* Vertical divider between stats */}
                                        {i < 2 && (
                                            <div
                                                className="absolute right-0 top-1/2 -translate-y-1/2"
                                                style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.12)" }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Bottom tagline */}
                            <p
                                className="mt-6"
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "12px",
                                    color: "rgba(255,255,255,0.45)",
                                    fontStyle: "italic",
                                    lineHeight: 1.6,
                                }}
                            >
                                "Healing the root, not just the symptom."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce opacity-40">
                <ChevronDown className="w-6 h-6 text-white" />
            </div>
        </section>
    )
}
