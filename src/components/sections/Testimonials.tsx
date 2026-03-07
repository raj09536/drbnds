"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { supabase } from "@/lib/supabase"

interface Testimonial {
    id: string
    patient_name: string
    review: string
    rating: number
    clinic: string
    doctor_name?: string
}

export function Testimonials() {
    const { ref, isVisible } = useScrollReveal(0.15)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [loaded, setLoaded] = useState(false)

    // Fetch active testimonials from Supabase
    useEffect(() => {
        const fetchTestimonials = async () => {
            const { data, error } = await supabase
                .from("testimonials")
                .select("id, patient_name, review, rating, clinics(name), doctors(name)")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(6)

            if (data && data.length > 0) {
                const formatted = data.map((item: any) => ({
                    id: item.id,
                    patient_name: item.patient_name,
                    review: item.review,
                    rating: item.rating,
                    clinic: item.clinics?.name || "Clinic",
                    doctor_name: item.doctors?.name || ""
                }))
                setTestimonials(formatted)
            }
            setLoaded(true)
        }
        fetchTestimonials()
    }, [])

    const next = useCallback(() => {
        if (testimonials.length === 0) return
        setCurrent((c) => (c + 1) % testimonials.length)
    }, [testimonials.length])

    const prev = useCallback(() => {
        if (testimonials.length === 0) return
        setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
    }, [testimonials.length])

    // Auto-rotate
    useEffect(() => {
        if (isPaused || testimonials.length <= 1) return
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [isPaused, next, testimonials.length])

    if (!loaded || testimonials.length === 0) {
        return null // Don't render section if no approved testimonials
    }

    const t = testimonials[current]

    return (
        <section
            ref={ref}
            style={{ background: "var(--forest)", padding: "96px 0" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
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
                        Patient Stories
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(28px, 3.5vw, 40px)",
                            fontWeight: 600,
                            color: "white",
                            lineHeight: 1.2,
                            transitionDelay: "100ms",
                        }}
                    >
                        What Our Patients Say
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div className="max-w-[760px] mx-auto relative">
                    <div
                        className="relative transition-opacity duration-500"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "20px",
                            padding: "48px",
                        }}
                    >
                        {/* Large Quote */}
                        <span
                            className="absolute select-none pointer-events-none"
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "120px",
                                color: "var(--gold)",
                                opacity: 0.25,
                                top: "10px",
                                left: "24px",
                                lineHeight: 1,
                            }}
                        >
                            &ldquo;
                        </span>

                        {/* Review */}
                        <p
                            className="relative z-10"
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "22px",
                                fontStyle: "italic",
                                color: "white",
                                lineHeight: 1.7,
                                minHeight: "120px",
                            }}
                        >
                            {t.review}
                        </p>

                        {/* Stars */}
                        <div className="mt-6 flex gap-1" style={{ fontSize: "20px", color: "var(--gold)" }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < t.rating ? "" : "opacity-30"}>★</span>
                            ))}
                        </div>

                        {/* Patient Info */}
                        <div className="mt-3">
                            <span
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "var(--mint)",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                }}
                            >
                                {t.patient_name}
                            </span>
                            <div className="flex flex-col mt-1">
                                <span
                                    style={{
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.5)",
                                    }}
                                >
                                    {t.clinic}
                                </span>
                                {t.doctor_name && (
                                    <span
                                        style={{
                                            fontFamily: "var(--font-dm-sans)",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                            color: "var(--gold)",
                                            marginTop: "2px"
                                        }}
                                    >
                                        Consulted with Dr. {t.doctor_name.replace("Dr. ", "")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                            style={{ width: "44px", height: "44px" }}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className="rounded-full transition-all duration-300 cursor-pointer"
                                    style={{
                                        width: i === current ? "24px" : "8px",
                                        height: "8px",
                                        background: i === current ? "var(--gold)" : "rgba(255,255,255,0.3)",
                                    }}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                            style={{ width: "44px", height: "44px" }}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
