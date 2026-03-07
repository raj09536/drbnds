"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Doctor {
    id: number
    name: string
    photo_url: string
    specialization: string
    clinic_id: number
    clinics: { name: string }
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function FeedbackForm() {
    const { ref, isVisible } = useScrollReveal(0.15)
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | "">("")
    const [name, setName] = useState("")
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Fetch doctors from Supabase
    useEffect(() => {
        supabase
            .from("doctors")
            .select("id, name, photo_url, specialization, clinic_id, clinics(name)")
            .eq("is_available", true) // DB has is_available instead of is_active
            .order("id")
            .then(({ data }) => { if (data) setDoctors(data as any) })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !review.trim() || rating === 0 || !selectedDoctorId) {
            toast.error("Please fill in all fields and select a rating.")
            return
        }

        setLoading(true)

        const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId)

        const { error } = await supabase.from("feedback").insert({
            patient_name: name.trim(),
            review: review.trim(),
            rating,
            doctor_id: selectedDoctorId,
            clinic_id: selectedDoctor?.clinic_id,
            is_approved: false,
        })

        setLoading(false)

        if (error) {
            console.error("Feedback error:", error)
            toast.error("Failed to submit feedback. Please try again.")
        } else {
            setSubmitted(true)
            setName("")
            setReview("")
            setRating(0)
            setSelectedDoctorId("")
        }
    }

    const displayRating = hoverRating || rating

    return (
        <section ref={ref} style={{ background: "var(--cream)", padding: "96px 0" }}>
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
                        Your Experience
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
                        Share Your Feedback
                    </h2>
                    <p
                        className={`mt-3 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "15px",
                            color: "var(--muted)",
                            lineHeight: 1.7,
                            maxWidth: "520px",
                            margin: "12px auto 0",
                            transitionDelay: "200ms",
                        }}
                    >
                        Your feedback helps us improve and inspires others to seek natural healing. Approved reviews will be featured on our website.
                    </p>
                </div>

                {/* Form Card */}
                <div
                    className={`max-w-[560px] mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: "300ms" }}
                >
                    {submitted ? (
                        /* ── Success State ── */
                        <div
                            className="text-center"
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "60px 40px",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                            }}
                        >
                            <div className="flex items-center justify-center mx-auto" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--sage)", marginBottom: "20px" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "26px", fontWeight: 600, color: "var(--forest)" }}>
                                Thank You!
                            </h3>
                            <p className="mt-3" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "380px", margin: "12px auto 0" }}>
                                Your feedback has been submitted for review. Once approved by our team, it will be featured in our Patient Stories section.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-8 cursor-pointer transition-all duration-200 hover:bg-sage"
                                style={{
                                    padding: "12px 28px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "var(--forest)",
                                    color: "white",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                }}
                            >
                                Submit Another Review
                            </button>
                        </div>
                    ) : (
                        /* ── Form ── */
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "40px",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* Star Rating */}
                            <div className="text-center mb-8">
                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 600, color: "var(--forest)", marginBottom: "12px" }}>
                                    How was your experience?
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="cursor-pointer transition-transform duration-150 hover:scale-110"
                                            style={{ background: "none", border: "none", padding: "4px", fontSize: "32px" }}
                                        >
                                            <span style={{ color: star <= displayRating ? "var(--gold)" : "#e0dfdb", transition: "color 0.15s" }}>★</span>
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
                                        {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                                    </p>
                                )}
                            </div>

                            {/* Doctor Select */}
                            <div className="mb-5">
                                <label htmlFor="fb-doctor" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)", marginBottom: "8px", display: "block" }}>
                                    Select Doctor *
                                </label>
                                <div className="flex flex-col gap-2">
                                    {doctors.map((doc) => {
                                        const isActive = selectedDoctorId === doc.id
                                        return (
                                            <button
                                                key={doc.id}
                                                type="button"
                                                onClick={() => setSelectedDoctorId(doc.id)}
                                                className="flex items-center gap-3 text-left cursor-pointer transition-all duration-200"
                                                style={{
                                                    padding: "12px 16px",
                                                    borderRadius: "12px",
                                                    border: `2px solid ${isActive ? "var(--gold)" : "rgba(0,0,0,0.08)"}`,
                                                    background: isActive ? "#fdf8ee" : "white",
                                                }}
                                            >
                                                <div className="shrink-0 rounded-full overflow-hidden" style={{ width: "40px", height: "40px", border: `2px solid ${isActive ? "var(--gold)" : "#e8e8e8"}` }}>
                                                    <Image src={doc.photo_url} alt={doc.name} width={40} height={40} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 600, color: "var(--forest)" }}>{doc.name}</p>
                                                    <p className="truncate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--muted)" }}>{doc.specialization} • {doc.clinics?.name}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center justify-center rounded-full" style={{ width: "20px", height: "20px", border: `2px solid ${isActive ? "var(--gold)" : "#ddd"}`, background: isActive ? "var(--gold)" : "transparent" }}>
                                                    {isActive && (
                                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Name */}
                            <div className="mb-5">
                                <label htmlFor="fb-name" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)", marginBottom: "8px", display: "block" }}>
                                    Your Name *
                                </label>
                                <input
                                    id="fb-name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                    style={{
                                        width: "100%",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: "10px",
                                        padding: "12px 16px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "14px",
                                        color: "var(--charcoal)",
                                        background: "white",
                                        outline: "none",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                />
                            </div>

                            {/* Review */}
                            <div className="mb-5">
                                <label htmlFor="fb-review" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)", marginBottom: "8px", display: "block" }}>
                                    Your Review *
                                </label>
                                <textarea
                                    id="fb-review"
                                    required
                                    rows={4}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    maxLength={500}
                                    placeholder="Share your experience with us..."
                                    className="resize-none focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                    style={{
                                        width: "100%",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: "10px",
                                        padding: "12px 16px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "14px",
                                        color: "var(--charcoal)",
                                        background: "white",
                                        outline: "none",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                    }}
                                />
                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--muted)", marginTop: "4px", textAlign: "right" }}>
                                    {review.length}/500
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-[10px] transition-all duration-200 hover:bg-sage hover:-translate-y-px cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: "var(--forest)",
                                    color: "white",
                                    padding: "14px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    border: "none",
                                    boxShadow: "0 4px 16px rgba(26,58,42,0.2)",
                                }}
                            >
                                {loading ? "Submitting..." : "Submit Feedback →"}
                            </button>

                            <p className="text-center mt-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--muted)" }}>
                                🔒 Your feedback will be reviewed before being published.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
