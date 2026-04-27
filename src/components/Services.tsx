"use client"

import { useState, useEffect } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { services } from "@/data/staticData"
import { useRouter } from "next/navigation"

export function Services() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [visibleCount, setVisibleCount] = useState(5)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    // Handle visible count based on screen size
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1)
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2)
            } else {
                setVisibleCount(5)
            }
        }
        updateVisibleCount()
        window.addEventListener("resize", updateVisibleCount)
        return () => window.removeEventListener("resize", updateVisibleCount)
    }, [])

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(services.length - visibleCount, prev + 1))
    }

    // Touch handlers for swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50
        if (isLeftSwipe) handleNext()
        if (isRightSwipe) handlePrev()
    }

    // Adjust current index if it exceeds the max allowed after resize
    useEffect(() => {
        const maxIndex = Math.max(0, services.length - visibleCount)
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex)
        }
    }, [visibleCount, currentIndex])

    return (
        <section id="services" ref={ref} className="py-14 md:py-24 bg-[#f5f0e8] overflow-hidden">
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

                </div>

                {/* Slider Wrapper */}
                <div 
                    className="relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div 
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 md:mx-0 md:px-0 md:flex md:gap-5 md:overflow-visible transition-transform duration-500 ease-out"
                        style={{ 
                            transform: `translateX(calc(-${currentIndex} * (100% + 20px) / ${visibleCount}))`,
                        }}
                    >
                        {services.map((service, i) => (
                            <div
                                key={service.title}
                                onClick={() => router.push(`/services/${service.slug}`)}
                                className={`shrink-0 group cursor-pointer overflow-hidden transition-all duration-500 md:min-w-0 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                style={{
                                    width: `calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`,
                                    height: "340px",
                                    borderRadius: "16px",
                                    position: "relative",
                                    transitionDelay: `${300 + (i % visibleCount) * 100}ms`,
                                    minWidth: "280px"
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
                </div>
            </div>
        </section>
    )
}
