"use client"

import { useScrollReveal } from "@/hooks/useScrollReveal"
import { specializations } from "@/data/staticData"
import Link from "next/link"

export function Specializations() {
    const { ref, isVisible } = useScrollReveal(0.1)
    // Show only first 6
    const previewSpecs = specializations.slice(0, 6)

    return (
        <section id="specializations" ref={ref} className="py-14 md:py-24 bg-[#FAFAF7]">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span
                        className={`block eyebrow transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                        Our Expertise
                    </span>
                    <h2
                        className={`mt-4 section-title transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{ transitionDelay: "100ms" }}
                    >
                        Our Specializations
                    </h2>
                    <p
                        className={`mt-4 text-muted transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{ 
                            fontSize: "15px", 
                            lineHeight: 1.75,
                            transitionDelay: "200ms" 
                        }}
                    >
                        With over 15 years of dedicated practice, we provide expert homoeopathic treatment for a wide range of conditions.
                    </p>
                </div>

                {/* Grid - 3x2 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {previewSpecs.map((spec, i) => (
                        <div
                            key={spec.title}
                            className={`group bg-white p-5 md:p-8 rounded-2xl border border-[#2D501615] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(45,80,22,0.1)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                transitionDelay: `${300 + i * 50}ms`,
                            }}
                        >
                            <div className="text-[36px] md:text-[48px] mb-6 transform transition-transform duration-300 group-hover:scale-110">
                                {spec.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-[#2D5016] font-serif leading-tight">
                                {spec.title}
                            </h3>
                            {spec.subtitle && (
                                <p className="text-[13px] text-muted-foreground/70 font-medium uppercase tracking-wider mt-1">
                                    {spec.subtitle}
                                </p>
                            )}
                            <p className="mt-4 text-muted-foreground text-[14px] leading-relaxed line-clamp-2">
                                {spec.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12 pt-4">
                    <Link
                        href="/specializations"
                        className="view-all-btn"
                    >
                        View All Specializations →
                    </Link>
                </div>
            </div>
        </section>
    )
}
