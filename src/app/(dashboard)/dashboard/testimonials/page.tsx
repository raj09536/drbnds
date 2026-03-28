"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"
import { toast } from "sonner"
import { Star, FileAudio, FileVideo, Type, Link, Upload, Check, X, Trash2, Globe } from "lucide-react"

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
    type: 'text' | 'audio' | 'video'
    media_url: string | null
}

/* ─── Components ─────────────────────────────────────────────────────── */

function PendingTestimonialCard({ 
    f, 
    onApprove, 
    onReject,
    renderStars 
}: { 
    f: Feedback, 
    onApprove: (f: Feedback, type: 'text'|'audio'|'video', url: string | null) => Promise<void>,
    onReject: (id: string) => Promise<void>,
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
            const { data, error } = await supabase.storage
                .from('clinic-media')
                .upload(filename, file)

            if (error) throw error

            const { data: urlData } = supabase.storage
                .from('clinic-media')
                .getPublicUrl(filename)

            setMediaUrl(urlData.publicUrl)
            toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully!`)
        } catch (error: any) {
            toast.error("Upload failed: " + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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

            {/* Type Selector Toggle */}
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
                            onClick={() => {
                                setSelectedType(type.id as any)
                                setMediaUrl(null)
                            }}
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

            {/* Conditional Media Inputs */}
            <div className="mb-6 space-y-3">
                {selectedType === 'audio' && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(e, 'audio')}
                            id={`audio-${f.id}`}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor={`audio-${f.id}`}
                            className={`flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                mediaUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-amber-400'
                            }`}
                        >
                            {isUploading ? (
                              <span className="flex items-center gap-2">Uploading...</span>
                            ) : mediaUrl ? (
                              <span className="flex items-center gap-2 font-bold"><Check size={14} /> Audio Uploaded</span>
                            ) : (
                              <span className="flex items-center gap-2 italic">Click to upload Audio recording</span>
                            )}
                        </label>
                    </div>
                )}

                {selectedType === 'video' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => { setVideoOption('link'); setMediaUrl(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                                    videoOption === 'link' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                }`}
                            >
                                <Link size={12} /> Link
                            </button>
                            <button
                                onClick={() => { setVideoOption('upload'); setMediaUrl(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                                    videoOption === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                }`}
                            >
                                <Upload size={12} /> Upload
                            </button>
                        </div>

                        {videoOption === 'link' ? (
                            <input
                                type="text"
                                placeholder="YouTube / Drive URL"
                                value={mediaUrl || ''}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            />
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                    id={`video-${f.id}`}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor={`video-${f.id}`}
                                    className={`flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                        mediaUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-amber-400'
                                    }`}
                                >
                                    {isUploading ? 'Uploading...' : mediaUrl ? <span className="font-bold flex items-center gap-2"><Check size={14} /> Video Uploaded</span> : <span className="italic">Click to upload Video file</span>}
                                </label>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    disabled={isApproving || isUploading || (selectedType !== 'text' && !mediaUrl)}
                    onClick={async () => {
                        setIsApproving(true)
                        await onApprove(f, selectedType, mediaUrl)
                        setIsApproving(false)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50 bg-[#e6f4ec] text-[#1a5e34] border border-[#22c55e] cursor-pointer"
                >
                    <Check size={16} />
                    {isApproving ? 'Publishing...' : 'Approve & Publish'}
                </button>
                <button
                    disabled={isApproving || isUploading}
                    onClick={() => onReject(f.id)}
                    className="px-4 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 bg-white text-[#ef4444] border border-[#ef4444] cursor-pointer flex items-center gap-2"
                >
                    <X size={16} />
                    Reject
                </button>
            </div>
        </div>
    )
}

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
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const youtubeId = getYouTubeId(p.media_url);

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

            {/* Media Previews */}
            {p.media_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {p.type === 'audio' && (
                        <div className="p-3">
                            <audio controls className="w-full h-10 ring-0 outline-none" src={p.media_url}>
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                    {p.type === 'video' && (
                        <div className="aspect-video bg-black">
                            {youtubeId ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video controls className="w-full h-full" src={p.media_url}>
                                    Your browser does not support the video element.
                                </video>
                            )}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => onRemove(p.id)}
                className="w-full py-3 text-gray-400 text-xs font-bold hover:text-white hover:bg-rose-600 hover:border-rose-600 transition-all bg-white border border-gray-100 rounded-xl cursor-not-allowed group-hover:cursor-pointer flex items-center justify-center gap-2 group-hover:border-rose-200"
            >
                <Trash2 size={14} />
                Remove from website
            </button>
        </div>
    )
}

export default function TestimonialsPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [pending, setPending] = useState<Feedback[]>([])
    const [published, setPublished] = useState<Testimonial[]>([])
    const [loadingData, setLoadingData] = useState(true)

    const fetchTestimonialsData = useCallback(async () => {
        if (!doctor?.clinic_id) return
        setLoadingData(true)

        try {
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
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingData(false)
        }
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchTestimonialsData()
    }, [doctor, loading, router, fetchTestimonialsData])

    /* ── Actions ── */
    const approveTestimonial = async (f: Feedback, type: 'text' | 'audio' | 'video', mediaUrl: string | null) => {
        try {
            // 1. Insert into testimonials
            const { error: tError } = await supabase
                .from('testimonials')
                .insert({
                    patient_name: f.patient_name,
                    review: f.review,
                    rating: f.rating,
                    doctor_id: f.doctor_id,
                    clinic_id: f.clinic_id,
                    feedback_id: f.id,
                    type: type,
                    media_url: mediaUrl || null,
                    is_active: true,
                })

            if (tError) throw tError

            // 2. Mark feedback as approved
            const { error: fError } = await supabase
                .from('feedback')
                .update({ is_approved: true })
                .eq('id', f.id)

            if (fError) throw fError

            toast.success("Testimonial published!")
            setPending(prev => prev.filter(p => p.id !== f.id))
            fetchTestimonialsData()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    const rejectTestimonial = async (id: string) => {
        try {
            const { error } = await supabase
                .from('feedback')
                .delete()
                .eq('id', id)
            if (error) throw error
            
            toast.success("Testimonial rejected")
            setPending(prev => prev.filter(p => p.id !== id))
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    const removeTestimonial = async (id: string) => {
        try {
            const { error } = await supabase
                .from('testimonials')
                .update({ is_active: false })
                .eq('id', id)
            if (error) throw error
            
            toast.success("Removed from website")
            setPublished(prev => prev.filter(p => p.id !== id))
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                size={14} 
                fill={i < rating ? '#fbbf24' : 'transparent'} 
                className={i < rating ? 'text-[#fbbf24]' : 'text-gray-200'} 
            />
        ))
    }

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
                    {/* SECTION 1 — PENDING APPROVALS */}
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
                                <span className="text-amber-700 text-xs font-extrabold">{pending.length} New Requests</span>
                            </div>
                        </div>

                        {loadingData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : pending.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pending.map(f => (
                                    <PendingTestimonialCard 
                                        key={f.id} 
                                        f={f} 
                                        onApprove={approveTestimonial} 
                                        onReject={rejectTestimonial} 
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

                    {/* SECTION 2 — PUBLISHED TESTIMONIALS */}
                    <section>
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
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : published.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {published.map(p => (
                                    <PublishedTestimonialCard 
                                        key={p.id} 
                                        p={p} 
                                        onRemove={removeTestimonial} 
                                        renderStars={renderStars} 
                                    />
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
                </main>
            </div>
        </div>
    )
}
