"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, MessageSquare, Play, Mic } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { supabase } from "@/lib/supabase"

interface Testimonial {
    id: string
    patient_name: string
    review: string
    rating: number
    type: 'text' | 'audio' | 'video'
    media_url: string | null
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
                .select("*, doctors(name)")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(6)

            if (data && data.length > 0) {
                const formatted = data.map((item: any) => ({
                    id: item.id,
                    patient_name: item.patient_name,
                    review: item.review,
                    rating: item.rating,
                    type: item.type || 'text',
                    media_url: item.media_url,
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
        const timer = setInterval(next, 7000) // Slightly longer for audio/video
        return () => clearInterval(timer)
    }, [isPaused, next, testimonials.length])

    if (!loaded || testimonials.length === 0) {
        return null // Don't render section if no testimonials
    }

    const t = testimonials[current]

    const getYouTubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const youtubeId = t.type === 'video' ? getYouTubeId(t.media_url) : null;

    return (
        <section
            ref={ref}
            id="testimonials"
            style={{ background: "var(--forest)", padding: "100px 0", overflow: "hidden" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span
                        className={`block transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "11px",
                            letterSpacing: "5px",
                            textTransform: "uppercase",
                            color: "var(--mint)",
                            fontWeight: 600,
                        }}
                    >
                        Success Stories
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(30px, 4.5vw, 42px)",
                            fontWeight: 600,
                            color: "white",
                            lineHeight: 1.1,
                            transitionDelay: "100ms",
                        }}
                    >
                        Healing Experiences Shared
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div className="max-w-[840px] mx-auto relative group">
                    <div
                        className="relative overflow-hidden transition-all duration-500 shadow-2xl"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "32px",
                            padding: "clamp(32px, 5vw, 64px)",
                        }}
                    >
                        {/* Type Badge */}
                        <div className="absolute top-8 right-8 z-20">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/5">
                                {t.type === 'text' && <><MessageSquare size={12} /> Text</>}
                                {t.type === 'audio' && <><Mic size={12} /> Audio</>}
                                {t.type === 'video' && <><Play size={12} /> Video</>}
                            </span>
                        </div>

                        {/* Large Quote - Only for text and audio */}
                        {t.type !== 'video' && (
                            <span
                                className="absolute select-none pointer-events-none"
                                style={{
                                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                    fontSize: "160px",
                                    color: "var(--gold)",
                                    opacity: 0.15,
                                    top: "0px",
                                    left: "24px",
                                    lineHeight: 1,
                                }}
                            >
                                &ldquo;
                            </span>
                        )}

                        <div className="relative z-10 flex flex-col items-center text-center lg:text-left lg:items-start">
                            {/* Stars */}
                            <div className="flex gap-1 mb-6" style={{ fontSize: "22px", color: "var(--gold)" }}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < t.rating ? "" : "opacity-30"}>★</span>
                                ))}
                            </div>

                            {/* Media Content */}
                            {t.type === 'audio' && t.media_url && (
                                <div className="w-full mb-6 animate-in fade-in slide-in-from-top-2">
                                    <audio 
                                        controls 
                                        src={t.media_url} 
                                        className="w-full accent-gold h-12 rounded-full"
                                        style={{ marginTop: 8 }}
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}

                            {t.type === 'video' && t.media_url && (
                                <div className="w-full mb-8 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg animate-in fade-in zoom-in-95 duration-500 aspect-video">
                                    {youtubeId ? (
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${youtubeId}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title="Patient Testimonial Video"
                                        ></iframe>
                                    ) : (
                                        <video 
                                            controls 
                                            src={t.media_url} 
                                            className="w-full h-full object-cover"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            )}

                            {/* Review Text */}
                            <p
                                className={`italic transition-all duration-300 ${t.type === 'video' ? 'text-lg opacity-80' : 'text-2xl'}`}
                                style={{
                                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                    color: "white",
                                    lineHeight: t.type === 'video' ? 1.5 : 1.7,
                                    minHeight: t.type === 'text' ? "100px" : "auto",
                                    marginBottom: "24px",
                                }}
                            >
                                &quot;{t.review}&quot;
                            </p>

                            {/* Patient Info */}
                            <div className="mt-auto pt-6 border-t border-white/10 w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-dm-sans)",
                                            fontSize: "14px",
                                            fontWeight: 700,
                                            color: "var(--mint)",
                                            letterSpacing: "3px",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {t.patient_name}
                                    </span>
                                    {t.doctor_name && (
                                        <span
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "11px",
                                                fontStyle: "italic",
                                                color: "rgba(255,255,255,0.5)",
                                                display: "block",
                                                marginTop: "4px"
                                            }}
                                        >
                                            Consulted with Dr. {t.doctor_name.replace("Dr. ", "")}
                                        </span>
                                    )}
                                </div>
                                
                                {t.type === 'text' && (
                                    <div className="hidden lg:block">
                                        <span className="text-[20px] text-white/5 font-serif select-none tracking-widest uppercase font-bold italic">
                                            Handwritten Note
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-center gap-6 mt-12">
                        <button
                            onClick={prev}
                            className="flex items-center justify-center rounded-full border-2 border-white/10 text-white hover:bg-white hover:text-forest transition-all duration-300 cursor-pointer group-hover:border-gold/50"
                            style={{ width: "48px", height: "48px" }}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex gap-3">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className="rounded-full transition-all duration-400 cursor-pointer"
                                    style={{
                                        width: i === current ? "32px" : "10px",
                                        height: "10px",
                                        background: i === current ? "var(--gold)" : "rgba(255,255,255,0.2)",
                                        boxShadow: i === current ? "0 0 10px rgba(251, 191, 36, 0.4)" : "none",
                                    }}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="flex items-center justify-center rounded-full border-2 border-white/10 text-white hover:bg-white hover:text-forest transition-all duration-300 cursor-pointer group-hover:border-gold/50"
                            style={{ width: "48px", height: "48px" }}
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
