"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { services } from "@/data/staticData"
import Link from "next/link"

export function Services() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        const amount = 300
        scrollRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth",
        })
    }

    return (
        <section id="services" ref={ref} style={{ background: "var(--cream)", padding: "96px 0" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
                    <div>
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
                            How We Help
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
                            Healthcare Services
                        </h2>
                        <p
                            className={`mt-3 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "15px",
                                color: "var(--muted)",
                                lineHeight: 1.75,
                                transitionDelay: "200ms",
                                maxWidth: "480px",
                            }}
                        >
                            Comprehensive Health Solutions with Expertise in Classical Homoeopathy
                        </p>
                    </div>

                    {/* Arrow Buttons */}
                    <div className="flex gap-3 mt-6 sm:mt-0">
                        <button
                            onClick={() => scroll("left")}
                            className="flex items-center justify-center bg-white shadow-md rounded-full hover:bg-forest hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ width: "44px", height: "44px" }}
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex items-center justify-center bg-white shadow-md rounded-full hover:bg-forest hover:text-white transition-all duration-200 cursor-pointer"
                            style={{ width: "44px", height: "44px" }}
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {services.map((service, i) => (
                        <div
                            key={service.name}
                            className={`shrink-0 snap-start group cursor-pointer overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                width: "280px",
                                height: "340px",
                                borderRadius: "16px",
                                position: "relative",
                                transitionDelay: `${300 + i * 100}ms`,
                            }}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.05]"
                                style={{ backgroundImage: `url(${service.image})` }}
                            />
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 transition-all duration-300"
                                style={{
                                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                                }}
                            />
                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3
                                    style={{
                                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                        fontSize: "22px",
                                        fontWeight: 600,
                                        color: "white",
                                    }}
                                >
                                    {service.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-10">
                    <Link
                        href="#specializations"
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
                        View All →
                    </Link>
                </div>
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    )
}
