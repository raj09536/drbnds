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
        <section id="services" ref={ref} className="py-24 bg-[#f5f0e8]">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
                    <div>
                        <span
                            className={`block eyebrow transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        >
                            WHAT WE OFFER
                        </span>
                        <h2
                            className={`mt-4 section-title transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Our Services
                        </h2>
                        <p
                            className={`mt-3 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            style={{
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
                            className="flex items-center justify-center bg-white shadow-md rounded-full hover:bg-forest hover:text-white transition-all duration-200 cursor-pointer w-11 h-11"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex items-center justify-center bg-white shadow-md rounded-full hover:bg-forest hover:text-white transition-all duration-200 cursor-pointer w-11 h-11"
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
                            key={service.title}
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
                                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                                }}
                            />
                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="text-2xl mb-1 transform transition-transform duration-300 group-hover:scale-110 origin-left">
                                    {service.icon}
                                </div>
                                <h3
                                    className="text-white font-serif text-xl font-bold leading-tight"
                                >
                                    {service.title}
                                </h3>
                                <p className="text-white/70 text-[11px] mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12 pt-4">
                    <Link
                        href="#specializations"
                        className="view-all-services-btn"
                    >
                        View All →
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .view-all-services-btn {
                    border: 1.5px solid #2D5016;
                    color: #2D5016;
                    background: transparent;
                    padding: 12px 28px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .view-all-services-btn:hover {
                    background: #2D5016;
                    color: #FFFFFF !important;
                }
            `}</style>
        </section>
    )
}
