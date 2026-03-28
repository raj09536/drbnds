"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, User, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CaseFile {
    id: string
    title: string
    summary: string
    photo_url: string | null
    tags: string[]
    doctor_name?: string
    created_at: string
}

export default function CaseFilesListPage() {
    const [cases, setCases] = useState<CaseFile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCases = async () => {
            const { data } = await supabase
                .from('case_files')
                .select('*, doctors(name)')
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (data) {
                setCases(data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    summary: item.summary,
                    photo_url: item.photo_url,
                    tags: item.tags || [],
                    doctor_name: item.doctors?.name || "Expert Doctor",
                    created_at: item.created_at
                })))
            }
            setLoading(false)
        }
        fetchCases()
    }, [])

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* Header */}
            <header className="bg-forest py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -mr-[300px] -mt-[300px]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 
                        className="text-white text-5xl font-extrabold max-w-2xl leading-[1.1]"
                        style={{ fontFamily: "var(--font-playfair, serif)" }}
                    >
                        Success Gallery & Case Studies
                    </h1>
                    <p className="text-white/60 mt-6 max-w-lg text-lg font-medium leading-relaxed italic">
                        Real stories of healing from our patients, documented by our experts.
                    </p>
                </div>
            </header>

            {/* List */}
            <main className="container mx-auto px-6 py-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[420px] bg-gray-100 rounded-[32px] animate-pulse"></div>
                        ))}
                    </div>
                ) : cases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cases.map((c) => (
                            <Link 
                                href={`/case-files/${c.id}`} 
                                key={c.id}
                                className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative h-[220px] w-full overflow-hidden bg-forest">
                                    {c.photo_url ? (
                                        <Image 
                                            src={c.photo_url} 
                                            alt={c.title} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div style={{ 
                                            width:'100%', 
                                            height:'100%', 
                                            background:'linear-gradient(135deg, #1a3a2a, #2d5a40)' 
                                        }} />
                                    )}
                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                        {c.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gold text-[#92400e] text-[10px] font-bold rounded-full uppercase tracking-widest backdrop-blur-md shadow-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 
                                        className="text-xl font-bold text-forest leading-tight mb-4 group-hover:text-gold transition-colors block italic"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    >
                                        {c.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-3 mb-8 leading-relaxed italic">
                                        "{c.summary}"
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint">
                                                <User size={14} />
                                            </div>
                                            <span className="text-[11px] font-extrabold text-mint uppercase tracking-[2px]">
                                                Dr. {c.doctor_name?.replace("Dr. ", "")}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center">
                        <div className="w-24 h-24 bg-forest/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 grayscale">📋</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories Coming Soon</h2>
                        <p className="text-gray-500 italic font-medium">We are currently documenting more case studies from our successful treatments.</p>
                    </div>
                )}
            </main>

            {/* CTA */}
            <section className="bg-cream py-24 text-center border-t border-black/5">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-bold text-forest mb-4" style={{ fontFamily: "var(--font-playfair, serif)" }}>Ready to write your own success story?</h3>
                    <p className="text-gray-500 mb-10 max-w-lg mx-auto italic">Book a consultation with our experts and take the first step towards holistic recovery.</p>
                    <button 
                        onClick={() => window.location.href = '/#booking'}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-forest text-white rounded-full font-bold shadow-2xl hover:bg-[#1a3a2a] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Schedule Your Consult
                        <ArrowRight size={18} />
                    </button>
                </div>
            </section>
        </div>
    )
}
