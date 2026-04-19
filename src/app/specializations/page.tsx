"use client"

import Link from "next/link"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { specializations } from "@/data/staticData"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function SpecializationsPage() {
    const { ref, isVisible } = useScrollReveal(0.1)

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-white border-b border-[#2D501610]">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <span className="inline-block px-4 py-1.5 bg-[#2D501610] text-[#2D5016] text-[12px] font-bold tracking-[2px] uppercase rounded-full mb-6">
                        Our Expertise
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#2D5016] font-serif mb-6 leading-tight">
                        Our Specializations
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        With over 15 years of dedicated practice, we provide expert homoeopathic treatment for a wide range of conditions.
                    </p>
                </div>
            </section>

            {/* Specializations Grid */}
            <section ref={ref} className="py-20 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {specializations.map((spec, i) => (
                            <div
                                key={spec.title}
                                className={`group bg-white p-8 md:p-10 rounded-3xl border border-[#2D501610] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,80,22,0.08)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                <div className="text-[56px] mb-8 leading-none transform transition-transform duration-300 group-hover:scale-110">
                                    {spec.icon}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-[#2D5016] font-serif leading-tight">
                                    {spec.title}
                                </h3>
                                {spec.subtitle && (
                                    <p className="text-sm text-muted-foreground/70 font-medium uppercase tracking-widest mt-2">
                                        {spec.subtitle}
                                    </p>
                                )}
                                <div className="mt-6 w-12 h-1 bg-[#C9A84C30] group-hover:w-20 group-hover:bg-[#C9A84C] transition-all duration-500 rounded-full" />
                                <p className="mt-6 text-muted-foreground text-[15px] md:text-[16px] leading-relaxed">
                                    {spec.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-forest text-white overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pt-1" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                
                <div className="container mx-auto px-6 text-center max-w-3xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight">
                        Speak With Our Specialists Today
                    </h2>
                    <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto">
                        Our personalised treatment approach can help restore your health naturally. Book your appointment today.
                    </p>
                    <Link
                        href="/appointment"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-[#2D5016] text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-[#1a3a2a] hover:-translate-y-1 shadow-[0_10px_30px_rgba(45,80,22,0.3)] group border-2 border-white/20"
                    >
                        Book Appointment
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    )
}
