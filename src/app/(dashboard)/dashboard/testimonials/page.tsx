"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"
import { toast } from "sonner"
import { Star, FileAudio, FileVideo, Type, Link, Upload, Check, X, Trash2, Globe, Clock } from "lucide-react"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Feedback {
    id: string
    patient_name: string
    rating: number
    review: string
    is_approved: boolean
    is_rejected: boolean
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
    is_rejected: boolean
    clinic_id: number
    doctor_id?: number
    created_at: string
    type: 'text' | 'audio' | 'video'
    media_url: string | null
}

/* ─── PendingTextCard (text feedback needing media choice before approve) */
function PendingTextCard({
    f,
    onApprove,
    onReject,
    renderStars
}: {
    f: Feedback,
    onApprove: (f: Feedback, type: 'text' | 'audio' | 'video', url: string | null) => Promise<void>,
    onReject: (id: string, table: 'feedback') => Promise<void>,
    renderStars: (r: number) => React.ReactNode
}) {
    const [selectedType, setSelectedType] = useState<'text' | 'audio' | 'video'>('text')
    const [mediaUrl, setMediaUrl] = useState<string | null>(null)
    const [videoOption, setVideoOption] = useState<'link' | 'upload'>('link')
    const [isUploading, setIsUploading] = useState(false)
    const [isApproving, setIsApproving] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'audio' | 'video') => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setIsUploading(true)
            const filename = `testimonials/${Date.now()}-${file.name}`
            const { error } = await supabase.storage.from('clinic-media').upload(filename, file)
            if (error) throw error
            const { data: urlData } = supabase.storage.from('clinic-media').getPublicUrl(filename)
            setMediaUrl(urlData.publicUrl)
            toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded!`)
        } catch (error: any) {
            toast.error("Upload failed: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{f.patient_name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-0.5">{renderStars(f.rating)}</div>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{f.review}"</p>

            {/* Display Style */}
            <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Display Style</p>
                <div className="flex gap-2">
                    {[
                        { id: 'text', label: '📝 Text', icon: Type },
                        { id: 'audio', label: '🎵 Audio', icon: FileAudio },
                        { id: 'video', label: '🎥 Video', icon: FileVideo }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => { setSelectedType(type.id as any); setMediaUrl(null) }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold rounded-xl border-2 transition-all ${
                                selectedType === type.id
                                    ? 'bg-[#fdf8ee] border-[#fbbf24] text-[#92400e]'
                                    : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <type.icon size={14} />
                            {type.label.split(' ')[1]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Media Inputs */}
            <div className="mb-6 space-y-3">
                {selectedType === 'audio' && (
                    <div>
                        <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} id={`audio-${f.id}`} className="hidden" disabled={isUploading} />
                        <label htmlFor={`audio-${f.id}`} className={`flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${mediaUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-amber-400'}`}>
                            {isUploading ? 'Uploading...' : mediaUrl ? <span className="flex items-center gap-2 font-bold"><Check size={14} /> Audio Uploaded</span> : <span className="italic">Click to upload Audio</span>}
                        </label>
                    </div>
                )}
                {selectedType === 'video' && (
                    <div className="space-y-3">
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                            <button onClick={() => { setVideoOption('link'); setMediaUrl(null) }} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoOption === 'link' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                                <Link size={12} /> Link
                            </button>
                            <button onClick={() => { setVideoOption('upload'); setMediaUrl(null) }} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoOption === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                                <Upload size={12} /> Upload
                            </button>
                        </div>
                        {videoOption === 'link' ? (
                            <input type="text" placeholder="YouTube / Drive URL" value={mediaUrl || ''} onChange={(e) => setMediaUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                        ) : (
                            <div>
                                <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} id={`video-${f.id}`} className="hidden" disabled={isUploading} />
                                <label htmlFor={`video-${f.id}`} className={`flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${mediaUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-amber-400'}`}>
                                    {isUploading ? 'Uploading...' : mediaUrl ? <span className="font-bold flex items-center gap-2"><Check size={14} /> Video Uploaded</span> : <span className="italic">Click to upload Video</span>}
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    disabled={isApproving || isUploading || (selectedType !== 'text' && !mediaUrl)}
                    onClick={async () => { setIsApproving(true); await onApprove(f, selectedType, mediaUrl); setIsApproving(false) }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 bg-[#e6f4ec] text-[#1a5e34] border border-[#22c55e] cursor-pointer"
                >
                    <Check size={16} />
                    {isApproving ? 'Publishing...' : 'Approve & Publish'}
                </button>
                <button
                    disabled={isApproving || isUploading}
                    onClick={() => onReject(f.id, 'feedback')}
                    className="px-4 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 bg-white text-[#ef4444] border border-[#ef4444] cursor-pointer flex items-center gap-2"
                >
                    <X size={16} /> Reject
                </button>
            </div>
        </div>
    )
}

/* ─── PendingMediaCard (video/audio submitted by patient — preview + approve) */
function PendingMediaCard({
    t,
    onApprove,
    onReject,
    renderStars
}: {
    t: Testimonial,
    onApprove: (id: string) => Promise<void>,
    onReject: (id: string, table: 'testimonials') => Promise<void>,
    renderStars: (r: number) => React.ReactNode
}) {
    const [isProcessing, setIsProcessing] = useState(false)

    return (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{t.patient_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-gray-400">{new Date(t.created_at).toLocaleDateString()}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${t.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {t.type === 'video' ? <FileVideo size={10} /> : <FileAudio size={10} />}
                            {t.type.toUpperCase()} — Patient Submitted
                        </span>
                    </div>
                </div>
                <div className="flex gap-0.5">{renderStars(t.rating)}</div>
            </div>

            {t.review && (
                <p className="text-sm text-gray-600 italic leading-relaxed mb-4">"{t.review}"</p>
            )}

            {/* Media Preview */}
            {t.media_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {t.type === 'audio' && (
                        <div className="p-4 flex flex-col items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-2xl">🎙️</div>
                            <audio controls preload="metadata" style={{ width: '100%', minHeight: '54px' }} src={t.media_url}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                    {t.type === 'video' && (
                        <div className="aspect-video bg-black">
                            <video controls className="w-full h-full" src={t.media_url} />
                        </div>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    disabled={isProcessing}
                    onClick={async () => { setIsProcessing(true); await onApprove(t.id); setIsProcessing(false) }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 bg-[#e6f4ec] text-[#1a5e34] border border-[#22c55e] cursor-pointer"
                >
                    <Check size={16} />
                    {isProcessing ? 'Publishing...' : 'Approve & Publish'}
                </button>
                <button
                    disabled={isProcessing}
                    onClick={async () => { setIsProcessing(true); await onReject(t.id, 'testimonials'); setIsProcessing(false) }}
                    className="px-4 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 bg-white text-[#ef4444] border border-[#ef4444] cursor-pointer flex items-center gap-2"
                >
                    <X size={16} /> Reject
                </button>
            </div>
        </div>
    )
}

/* ─── PublishedCard ──────────────────────────────────────────────────── */
function PublishedTestimonialCard({
    p,
    onRemove,
    renderStars
}: {
    p: Testimonial,
    onRemove: (id: string) => Promise<void>,
    renderStars: (r: number) => React.ReactNode
}) {
    const getYouTubeId = (url: string | null) => {
        if (!url) return null
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }
    const youtubeId = getYouTubeId(p.media_url)

    return (
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{p.patient_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-gray-400">Published {new Date(p.created_at).toLocaleDateString()}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            p.type === 'video' ? 'bg-purple-100 text-purple-700' :
                            p.type === 'audio' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                            {p.type === 'text' && <Type size={10} />}
                            {p.type === 'audio' && <FileAudio size={10} />}
                            {p.type === 'video' && <FileVideo size={10} />}
                            {p.type.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-0.5">{renderStars(p.rating)}</div>
            </div>

            <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{p.review}"</p>

            {p.media_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {p.type === 'audio' && (
                        <div className="p-4 flex flex-col items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-2xl">🎙️</div>
                            <audio controls preload="metadata" style={{ width: '100%', minHeight: '54px' }} src={p.media_url}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                    {p.type === 'video' && (
                        <div className="aspect-video bg-black">
                            {youtubeId ? (
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                                <video controls className="w-full h-full" src={p.media_url} />
                            )}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => onRemove(p.id)}
                className="w-full py-3 text-gray-400 text-xs font-bold hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all bg-white border border-gray-100 rounded-xl cursor-pointer flex items-center justify-center gap-2 group-hover:border-rose-200"
            >
                <Trash2 size={14} />
                Remove from website
            </button>
        </div>
    )
}

/* ─── RejectedCard ───────────────────────────────────────────────────── */
function RejectedCard({ item, renderStars }: { item: any, renderStars: (r: number) => React.ReactNode }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-red-50 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-gray-600 text-[14px]">{item.patient_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                        {item.type && item.type !== 'text' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${item.type === 'video' ? 'bg-purple-50 text-purple-400' : 'bg-blue-50 text-blue-400'}`}>
                                {item.type === 'video' ? <FileVideo size={9} /> : <FileAudio size={9} />}
                                {item.type.toUpperCase()}
                            </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-400 flex items-center gap-1">
                            <X size={9} /> Rejected
                        </span>
                    </div>
                </div>
                <div className="flex gap-0.5 opacity-50">{renderStars(item.rating)}</div>
            </div>
            {item.review && (
                <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">"{item.review}"</p>
            )}
        </div>
    )
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function TestimonialsPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [pendingText, setPendingText] = useState<Feedback[]>([])
    const [pendingMedia, setPendingMedia] = useState<Testimonial[]>([])
    const [published, setPublished] = useState<Testimonial[]>([])
    const [rejected, setRejected] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [showRejected, setShowRejected] = useState(false)

    const fetchData = useCallback(async () => {
        if (!doctor?.clinic_id) return
        setLoadingData(true)
        try {
            // 1. Pending text feedback (feedback table has permissive RLS)
            const { data: textPendRaw } = await supabase
                .from('feedback')
                .select('*')
                .eq('clinic_id', doctor.clinic_id)
                .eq('is_approved', false)
                .order('created_at', { ascending: false })

            const textPend = (textPendRaw || []).filter((f: any) => !f.is_rejected)

            // 2. Pending video/audio — via API route (bypasses RLS for is_active=false)
            const mediaRes = await fetch(`/api/testimonials/pending?clinic_id=${doctor.clinic_id}`)
            const mediaJson = mediaRes.ok ? await mediaRes.json() : { pending: [] }
            const mediaPend = mediaJson.pending || []

            // 3. Published — public records, RLS allows this
            const { data: publ } = await supabase
                .from('testimonials')
                .select('*')
                .eq('clinic_id', doctor.clinic_id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            // 4. Rejected history from feedback table
            const { data: rejFeedbackRaw } = await supabase
                .from('feedback')
                .select('*')
                .eq('clinic_id', doctor.clinic_id)
                .order('created_at', { ascending: false })

            const rejFeedback = (rejFeedbackRaw || []).filter((f: any) => f.is_rejected === true)
            // Rejected media come from pending API — mediaPend already excludes them,
            // but we need all rejected media separately
            const allMediaRes = await fetch(`/api/testimonials/pending?clinic_id=${doctor.clinic_id}&include_rejected=true`)
            const allMediaJson = allMediaRes.ok ? await allMediaRes.json() : { pending: [] }
            const rejTestimonials = (allMediaJson.pending || []).filter((t: any) => t.is_rejected === true)

            setPendingText(textPend || [])
            setPendingMedia(mediaPend)
            setPublished(publ || [])

            const allRejected = [
                ...(rejFeedback || []).map((r: any) => ({ ...r, source: 'feedback' })),
                ...(rejTestimonials || []).map((r: any) => ({ ...r, source: 'testimonials' })),
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            setRejected(allRejected)
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingData(false)
        }
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) { router.push('/login'); return }
        if (doctor) fetchData()
    }, [doctor, loading, router, fetchData])

    /* ── Actions ── */

    // Approve text feedback → insert into testimonials
    const approveTextFeedback = async (f: Feedback, type: 'text' | 'audio' | 'video', mediaUrl: string | null) => {
        try {
            const { error: tError } = await supabase.from('testimonials').insert({
                patient_name: f.patient_name,
                review: f.review,
                rating: f.rating,
                doctor_id: f.doctor_id,
                clinic_id: f.clinic_id,
                feedback_id: f.id,
                type,
                media_url: mediaUrl || null,
                is_active: true,
            })
            if (tError) throw tError

            const { error: fError } = await supabase.from('feedback').update({ is_approved: true }).eq('id', f.id)
            if (fError) throw fError

            toast.success("Testimonial published!")
            setPendingText(prev => prev.filter(p => p.id !== f.id))
            fetchData()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    // Approve media testimonial → via API route (bypasses RLS)
    const approveMediaTestimonial = async (id: string) => {
        try {
            const res = await fetch('/api/testimonials/pending', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'approve' }),
            })
            if (!res.ok) throw new Error((await res.json()).error)
            toast.success("Testimonial published!")
            setPendingMedia(prev => prev.filter(p => p.id !== id))
            fetchData()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    // Reject — testimonials via API (RLS bypass), feedback via direct supabase
    const rejectItem = async (id: string, table: 'feedback' | 'testimonials') => {
        try {
            if (table === 'testimonials') {
                const res = await fetch('/api/testimonials/pending', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, action: 'reject' }),
                })
                if (!res.ok) throw new Error((await res.json()).error)
            } else {
                const { error } = await supabase.from('feedback').update({ is_rejected: true }).eq('id', id)
                if (error) {
                    if (error.message?.includes('is_rejected')) {
                        const { error: delError } = await supabase.from('feedback').delete().eq('id', id)
                        if (delError) throw delError
                    } else {
                        throw error
                    }
                }
            }
            toast.success("Moved to Reject History")
            if (table === 'feedback') setPendingText(prev => prev.filter(p => p.id !== id))
            else setPendingMedia(prev => prev.filter(p => p.id !== id))
            fetchData()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    // Remove published testimonial — via API to bypass RLS
    const removeTestimonial = async (id: string) => {
        try {
            const res = await fetch('/api/testimonials/pending', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'remove' }),
            })
            if (!res.ok) throw new Error((await res.json()).error)
            toast.success("Removed from website")
            setPublished(prev => prev.filter(p => p.id !== id))
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    const renderStars = (rating: number) =>
        [...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? '#fbbf24' : 'transparent'} className={i < rating ? 'text-[#fbbf24]' : 'text-gray-200'} />
        ))

    const totalPending = pendingText.length + pendingMedia.length

    if (loading) return (
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-800 font-bold animate-pulse">🌿 Loading Dashboard...</p>
            </div>
        </div>
    )
    if (!doctor) return null

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar title="Testimonials" breadcrumb="Dashboard / Testimonials" doctor={doctor} />

                <main className="p-8 max-w-6xl mx-auto">

                    {/* ── SECTION 1: PENDING APPROVALS ── */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Pending Approvals
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">New Stories Waiting to Bloom</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className="text-amber-700 text-xs font-extrabold">{totalPending} New Requests</span>
                            </div>
                        </div>

                        {loadingData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : totalPending > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingText.map(f => (
                                    <PendingTextCard
                                        key={f.id}
                                        f={f}
                                        onApprove={approveTextFeedback}
                                        onReject={rejectItem}
                                        renderStars={renderStars}
                                    />
                                ))}
                                {pendingMedia.map(t => (
                                    <PendingMediaCard
                                        key={t.id}
                                        t={t}
                                        onApprove={approveMediaTestimonial}
                                        onReject={rejectItem}
                                        renderStars={renderStars}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-3xl mb-4 text-green-600">✨</div>
                                <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                                <p className="text-gray-500 text-sm mt-1">No new feedback requests for now.</p>
                            </div>
                        )}
                    </section>

                    {/* ── SECTION 2: PUBLISHED ── */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8 pt-8 border-t border-gray-200">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Published Stories
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Live on your landing page</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full text-green-700">
                                <Globe size={14} />
                                <span className="text-xs font-extrabold">{published.length} Active</span>
                            </div>
                        </div>

                        {loadingData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : published.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {published.map(p => (
                                    <PublishedTestimonialCard key={p.id} p={p} onRemove={removeTestimonial} renderStars={renderStars} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">🖼️</div>
                                <h3 className="text-lg font-bold text-gray-400">No testimonials published yet</h3>
                                <p className="text-gray-400 text-sm mt-1">Approve feedback above to see them here.</p>
                            </div>
                        )}
                    </section>

                    {/* ── SECTION 3: REJECT HISTORY ── */}
                    <section className="pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                                    Reject History
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Previously rejected submissions</p>
                            </div>
                            <button
                                onClick={() => setShowRejected(prev => !prev)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                            >
                                <Clock size={14} />
                                <span className="text-xs font-extrabold">{rejected.length} Rejected</span>
                                <span className="text-xs">{showRejected ? '▲' : '▼'}</span>
                            </button>
                        </div>

                        {showRejected && (
                            <>
                                {loadingData ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
                                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
                                    </div>
                                ) : rejected.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rejected.map(item => (
                                            <RejectedCard key={`${item.source}-${item.id}`} item={item} renderStars={renderStars} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-3">🗃️</div>
                                        <h3 className="text-base font-bold text-gray-400">No rejected items</h3>
                                    </div>
                                )}
                            </>
                        )}
                    </section>

                </main>
            </div>
        </div>
    )
}
