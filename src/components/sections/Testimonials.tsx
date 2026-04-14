"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, MessageSquare, Play, Mic, Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
    id: string
    patient_name: string
    review: string
    rating: number
    type: 'text' | 'audio' | 'video'
    media_url: string | null
    doctor_name?: string
}

type FilterType = 'all' | 'text' | 'video' | 'audio'

export function Testimonials() {
    const { ref, isVisible } = useScrollReveal(0.15)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')
    const touchStart = useRef<number | null>(null)
    const touchEnd = useRef<number | null>(null)

    // Fetch active testimonials from Supabase
    useEffect(() => {
        const fetchTestimonials = async () => {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*, doctors(name)")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(20)

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

    // Reset carousel position when filter changes
    useEffect(() => {
        setCurrent(0)
    }, [activeFilter])

    const filteredTestimonials = activeFilter === 'all'
        ? testimonials
        : testimonials.filter(t => t.type === activeFilter)

    const next = useCallback(() => {
        if (filteredTestimonials.length === 0) return
        setCurrent((c) => (c + 1) % filteredTestimonials.length)
    }, [filteredTestimonials.length])

    const prev = useCallback(() => {
        if (filteredTestimonials.length === 0) return
        setCurrent((c) => (c - 1 + filteredTestimonials.length) % filteredTestimonials.length)
    }, [filteredTestimonials.length])

    // Swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return
        const distance = touchStart.current - touchEnd.current
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50
        if (isLeftSwipe) next()
        if (isRightSwipe) prev()
        touchStart.current = null
        touchEnd.current = null
    }

    // Auto-rotate
    useEffect(() => {
        if (isPaused || filteredTestimonials.length <= 1) return
        const timer = setInterval(next, 7000)
        return () => clearInterval(timer)
    }, [isPaused, next, filteredTestimonials.length])

    if (!loaded || testimonials.length === 0) return null

    const safeIndex = filteredTestimonials.length > 0
        ? current % filteredTestimonials.length
        : 0
    const t = filteredTestimonials[safeIndex] ?? null

    const getYouTubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const youtubeId = t?.type === 'video' ? getYouTubeId(t?.media_url ?? null) : null;

    return (
        <section
            ref={ref}
            id="testimonials"
            className="bg-forest overflow-hidden"
            style={{ padding: "48px 0" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <span
                        className="block text-mint font-bold uppercase tracking-[4px] md:tracking-[6px]"
                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px" }}
                    >
                        Success Stories
                    </span>
                    <h2
                        className="mt-4 text-white font-bold leading-tight"
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(32px, 4.5vw, 48px)",
                        }}
                    >
                        Patient Testimonials
                    </h2>
                </div>

                {/* Filter Pills */}
                <div
                    className="flex justify-center gap-2 mb-6 flex-wrap"
                >
                    {(['all', 'video', 'audio', 'text'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                                padding: "6px 20px",
                                borderRadius: "100px",
                                fontSize: "13px",
                                fontFamily: "var(--font-dm-sans)",
                                fontWeight: 600,
                                background: activeFilter === f ? "var(--gold)" : "rgba(255,255,255,0.08)",
                                color: activeFilter === f ? "white" : "rgba(255,255,255,0.75)",
                                border: `1.5px solid ${activeFilter === f ? "var(--gold)" : "rgba(255,255,255,0.25)"}`,
                            }}
                        >
                            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Testimonial Card */}
                {filteredTestimonials.length === 0 ? (
                    <div className="text-center py-16 max-w-[840px] mx-auto">
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                            No {activeFilter} testimonials yet.
                        </p>
                    </div>
                ) : (
                    <div
                        className="max-w-[840px] mx-auto relative group px-0 md:px-0"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <AnimatePresence mode="wait">
                            {t && (
                            <motion.div
                                key={`${activeFilter}-${safeIndex}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="relative overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-10"
                            >
                                {/* Type Badge */}
                                <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/5">
                                        {(t.type === 'text' || !t.type) && <><MessageSquare size={12} /> Text</>}
                                        {t.type === 'audio' && <><Mic size={12} /> Audio</>}
                                        {t.type === 'video' && <><Play size={12} /> Video</>}
                                    </span>
                                </div>

                                <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} fill={i < t.rating ? "var(--gold)" : "transparent"} stroke={i < t.rating ? "var(--gold)" : "rgba(255,255,255,0.2)"} />
                                        ))}
                                    </div>

                                    {/* Media Content */}
                                    {t.type === 'audio' && t.media_url && (
                                        <div className="w-full mb-8">
                                            <audio
                                                controls
                                                src={t.media_url}
                                                className="w-full rounded-full opacity-80"
                                                style={{ minHeight: '54px' }}
                                            >
                                                Your browser does not support audio.
                                            </audio>
                                        </div>
                                    )}

                                    {t.type === 'video' && t.media_url && (
                                        <div className="w-full mb-10 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg aspect-video">
                                            {youtubeId ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <video
                                                    controls
                                                    src={t.media_url}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Review Text */}
                                    <p
                                        className="leading-relaxed font-medium italic text-white"
                                        style={{
                                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                            fontSize: "clamp(15px, 2vw, 19px)",
                                            marginBottom: "32px",
                                        }}
                                    >
                                        &ldquo;{t.review}&rdquo;
                                    </p>

                                    {/* Patient Info */}
                                    <div className="mt-auto pt-8 border-t border-white/10 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <span
                                                className="block text-mint font-bold uppercase tracking-[2px] md:tracking-[3px]"
                                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(14px, 1.5vw, 16px)" }}
                                            >
                                                {t.patient_name}
                                            </span>
                                            {t.doctor_name && (
                                                <span className="block italic text-white/40 mt-1" style={{ fontSize: "12px" }}>
                                                    Consulted with Dr. {t.doctor_name.replace("Dr. ", "")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8">
                            <button
                                onClick={prev}
                                className="hidden md:flex items-center justify-center rounded-full border-2 border-white/10 text-white hover:bg-white hover:text-forest transition-all duration-300 cursor-pointer w-12 h-12"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Pagination Dots */}
                            <div className="flex gap-3">
                                {filteredTestimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className="rounded-full transition-all duration-500 cursor-pointer min-h-[10px]"
                                        style={{
                                            width: i === current ? "32px" : "10px",
                                            height: "10px",
                                            background: i === current ? "var(--gold)" : "rgba(255,255,255,0.2)",
                                            boxShadow: i === current ? "0 0 10px rgba(251, 191, 36, 0.4)" : "none",
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={next}
                                className="hidden md:flex items-center justify-center rounded-full border-2 border-white/10 text-white hover:bg-white hover:text-forest transition-all duration-300 cursor-pointer w-12 h-12"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
