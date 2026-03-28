"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, User, ArrowRight, Tag, Share2, Printer } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CaseFile {
    id: string
    title: string
    summary: string
    full_story: string
    photo_url: string | null
    tags: string[]
    doctor_name?: string
    doctor_photo?: string
    created_at: string
}

export default function CaseFileDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [caseData, setCaseData] = useState<CaseFile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCaseData = async () => {
            if (!params.id) return

            const { data, error } = await supabase
                .from('case_files')
                .select('*, doctors(name, photo_url)')
                .eq('id', params.id)
                .single()

            if (data && !error) {
                setCaseData({
                    id: data.id,
                    title: data.title,
                    summary: data.summary,
                    full_story: data.full_story,
                    photo_url: data.photo_url,
                    tags: data.tags || [],
                    doctor_name: data.doctors?.name || "Expert Doctor",
                    doctor_photo: data.doctors?.photo_url || "/doctor.jpeg",
                    created_at: data.created_at
                })
            }
            setLoading(false)
        }
        fetchCaseData()
    }, [params.id])


    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    if (!caseData) return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Study Not Found</h2>
            <p className="text-gray-500 mb-8 italic">The story you're looking for might have been moved.</p>
            <Link href="/case-files" className="px-8 py-3 bg-forest text-white rounded-full font-bold shadow-lg">Back to Collection</Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link 
                        href="/case-files" 
                        className="inline-flex items-center gap-2 text-forest/60 hover:text-forest transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft size={18} /> All Case Files
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-forest transition-all active:scale-95 shadow-sm">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Part 1: Hero */}
            <article className="container mx-auto px-6 max-w-4xl pt-12">
                {/* Photo */}
                <div className="relative w-full h-[400px] mb-12 rounded-[40px] overflow-hidden shadow-2xl border border-black/5 flex items-center justify-center bg-forest group">
                    {caseData.photo_url ? (
                        <Image 
                            src={caseData.photo_url} 
                            alt={caseData.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                        />
                    ) : (
                        <div style={{ 
                            width:'100%', 
                            height:'100%', 
                            background:'linear-gradient(135deg, #1a3a2a, #2d5a40)' 
                        }} />
                    )}
                </div>

                {/* Header Information */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {caseData.tags.map((tag, idx) => (
                            <span key={idx} className="px-4 py-1.5 bg-gold/10 text-[#92400e] text-[11px] font-extrabold rounded-full uppercase tracking-widest border border-gold/20 shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 
                        className="text-forest text-[48px] md:text-[56px] font-extrabold leading-[1.05] mb-8 tracking-tight italic"
                        style={{ fontFamily: "var(--font-playfair, serif)" }}
                    >
                        {caseData.title}
                    </h1>

                    <div className="flex items-center justify-between py-6 border-y border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-mint/20 p-0.5">
                                <Image 
                                    src={caseData.doctor_photo || "/doctor.jpeg"} 
                                    alt={caseData.doctor_name || "Doctor"} 
                                    width={56} 
                                    height={56} 
                                    className="object-cover w-full h-full rounded-full" 
                                />
                            </div>
                            <div>
                                <p className="text-[14px] font-extrabold text-forest uppercase tracking-widest leading-none mb-1">
                                    Dr. {caseData.doctor_name?.replace("Dr. ", "")}
                                </p>
                                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">
                                    Documenting Clinical Success
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] text-gray-300 font-bold uppercase tracking-widest mb-1">Published On</span>
                            <span className="text-[13px] font-bold text-gray-500">
                                {new Date(caseData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Story Content */}
                <div 
                    className="prose prose-forest max-w-none text-[18px] text-gray-700 leading-relaxed font-medium mb-20 italic whitespace-pre-wrap selection:bg-gold/20"
                    style={{ fontFamily: "var(--font-dm-sans, sans-serif)", lineHeight: 1.95 }}
                >
                    {caseData.full_story}
                </div>

                {/* Final CTA Card */}
                <div className="bg-forest p-10 md:p-14 rounded-[40px] text-center text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500 scale-110">
                            <Calendar size={32} className="text-gold shadow-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight" style={{ fontFamily: "var(--font-playfair, serif)" }}>Experience healing like this</h2>
                        <p className="text-white/60 mb-10 max-w-md italic font-medium">Every journey is unique. Let our experts guide you to recovery through scientific medical methodology.</p>
                        <Link 
                            href="/#booking"
                            className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-[#92400e] text-[15px] rounded-full font-bold shadow-2xl hover:bg-[#fbbf24] transition-all hover:scale-105 active:scale-95 group"
                        >
                            Book Appointment Now
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    )
}
