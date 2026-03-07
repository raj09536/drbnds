"use client"

import { useScrollReveal } from "@/hooks/useScrollReveal"
import { specializations } from "@/data/staticData"
import Link from "next/link"

export function Specializations() {
    const { ref, isVisible } = useScrollReveal(0.1)

    return (
        <section id="specializations" ref={ref} style={{ background: "white", padding: "96px 0" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span
                        className={`block transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "11px",
                            letterSpacing: "5px",
                            textTransform: "uppercase",
                            color: "var(--mint)",
                            fontWeight: 500,
                        }}
                    >
                        What We Treat
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(28px, 3.5vw, 40px)",
                            fontWeight: 600,
                            color: "var(--forest)",
                            lineHeight: 1.2,
                            transitionDelay: "100ms",
                        }}
                    >
                        Our Specializations
                    </h2>
                    <p
                        className={`mt-4 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "15px",
                            color: "var(--muted)",
                            lineHeight: 1.75,
                            transitionDelay: "200ms",
                        }}
                    >
                        Elevating Health with Specialized Care in Homoeopathy
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {specializations.map((spec, i) => (
                        <div
                            key={spec.name}
                            className={`group cursor-pointer transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                padding: "32px 24px",
                                background: "white",
                                border: "1px solid rgba(0,0,0,0.06)",
                                borderRadius: "16px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                                transitionDelay: `${300 + i * 80}ms`,
                            }}
                        >
                            {/* Icon Circle */}
                            <div
                                className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-white/15"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    background: "var(--cream)",
                                    fontSize: "28px",
                                }}
                            >
                                {spec.icon}
                            </div>

                            {/* Name */}
                            <h3
                                className="mt-5 transition-colors duration-300 group-hover:text-white"
                                style={{
                                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                    fontSize: "20px",
                                    fontWeight: 600,
                                    color: "var(--forest)",
                                }}
                            >
                                {spec.name}
                            </h3>

                            {/* Description */}
                            <p
                                className="mt-2 transition-colors duration-300 group-hover:text-white/70"
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "13px",
                                    color: "var(--muted)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {spec.desc}
                            </p>

                            <style jsx>{`
                .group:hover {
                  background: var(--forest) !important;
                  border-color: var(--forest) !important;
                  transform: translateY(-6px);
                  box-shadow: 0 12px 32px rgba(26, 58, 42, 0.2) !important;
                }
              `}</style>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="#services"
                        className="inline-flex items-center gap-2 rounded-lg transition-all duration-200 hover:bg-forest hover:text-white"
                        style={{
                            border: "2px solid var(--forest)",
                            color: "var(--forest)",
                            padding: "12px 28px",
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "14px",
                            fontWeight: 600,
                        }}
                    >
                        View All Services →
                    </Link>
                </div>
            </div>
        </section>
    )
}
