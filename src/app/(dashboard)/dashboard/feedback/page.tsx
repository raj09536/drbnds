"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Feedback {
    id: string
    patient_name: string
    rating: number
    review: string
    is_approved: boolean
    clinic_id: number
    doctor_id?: number
    created_at: string
}

interface Testimonial {
    id: string
    patient_name: string
    rating: number
    review: string
    is_active: boolean
    clinic_id: number
    doctor_id?: number
    created_at: string
}

export default function FeedbackPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [pending, setPending] = useState<Feedback[]>([])
    const [published, setPublished] = useState<Testimonial[]>([])
    const [loadingData, setLoadingData] = useState(true)

    const fetchFeedbackData = useCallback(async () => {
        if (!doctor) return
        setLoadingData(true)

        const { data: pend } = await supabase
            .from('feedback')
            .select('*')
            .eq('clinic_id', doctor.clinic_id)
            .eq('is_approved', false)
            .order('created_at', { ascending: false })

        const { data: publ } = await supabase
            .from('testimonials')
            .select('*')
            .eq('clinic_id', doctor.clinic_id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        setPending(pend || [])
        setPublished(publ || [])
        setLoadingData(false)
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchFeedbackData()

        // Realtime for feedback table
        const channel = supabase
            .channel(`clinic-feedback-${doctor?.clinic_id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback', filter: `clinic_id=eq.${doctor?.clinic_id}` },
                () => fetchFeedbackData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [doctor, loading, router, fetchFeedbackData])

    /* ── Actions ── */
    const approveFeedback = async (f: Feedback) => {
        const { error } = await supabase
            .from('feedback')
            .update({ is_approved: true })
            .eq('id', f.id)

        if (!error) {
            // Toast or notification could go here
            fetchFeedbackData()
        }
    }

    const rejectFeedback = async (id: string) => {
        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', id)
        if (!error) fetchFeedbackData()
    }

    const removeTestimonial = async (id: string) => {
        const { error } = await supabase
            .from('testimonials')
            .update({ is_active: false })
            .eq('id', id)
        if (!error) fetchFeedbackData()
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < rating ? 'text-[#fbbf24]' : 'text-gray-200'}`}>★</span>
                ))}
            </div>
        )
    }

    if (loading) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">🌿 Loading...</div>
    if (!doctor) return null

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar title="Feedback" breadcrumb="Dashboard / Feedback" doctor={doctor} />

                <main className="p-8 max-w-6xl mx-auto">
                    {/* Pending Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>Pending Approval</h2>
                                <p className="text-sm text-gray-500">New patient reviews waiting to be published on the website.</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{pending.length} Pending</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pending.map(f => (
                                <div key={f.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-[15px]">{f.patient_name}</h4>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{new Date(f.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {renderStars(f.rating)}
                                    </div>
                                    <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{f.review}"</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => approveFeedback(f)}
                                            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 border-none cursor-pointer"
                                            style={{ background: '#e6f4ec', color: '#1a5e34', border: '1.5px solid #22c55e' }}
                                        >
                                            ✓ Approve & Publish
                                        </button>
                                        <button
                                            onClick={() => rejectFeedback(f.id)}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
                                            style={{ background: '#fde8e4', color: '#c4715a', border: '1.5px solid #ef4444' }}
                                        >
                                            ✕ Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {pending.length === 0 && (
                                <div className="col-span-full py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-4xl mb-2">🎉</div>
                                    <p className="text-sm font-bold">No pending reviews!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Published Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>Published Testimonials</h2>
                                <p className="text-sm text-gray-500">Stories currently live on your landing page.</p>
                            </div>
                            <span className="px-3 py-1 bg-forest/10 text-forest text-xs font-bold rounded-full">{published.length} Live</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {published.map(p => (
                                <div key={p.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-[15px]">{p.patient_name}</h4>
                                            <p className="text-[11px] text-gray-400 mt-0.5">Published {new Date(p.created_at).toLocaleDateString()}</p>
                                        </div>
                                        {renderStars(p.rating)}
                                    </div>
                                    <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{p.review}"</p>
                                    <button
                                        onClick={() => removeTestimonial(p.id)}
                                        className="w-full py-2.5 text-gray-400 text-xs font-bold hover:text-rose-600 transition-colors bg-white border border-gray-100 rounded-xl cursor-pointer"
                                    >
                                        Remove from website
                                    </button>
                                </div>
                            ))}
                            {published.length === 0 && (
                                <div className="col-span-full py-12 bg-white/50 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-4xl mb-2">📝</div>
                                    <p className="text-sm font-bold">No published reviews yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
