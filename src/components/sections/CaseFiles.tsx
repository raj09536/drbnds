"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, User, Tag, Loader2 } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
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

export function CaseFiles() {
    const { ref, isVisible } = useScrollReveal(0.15)
    const [cases, setCases] = useState<CaseFile[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const fetchCases = async () => {
            console.log('Fetching case files with stable lib/supabase client...')
            const { data, error } = await supabase
                .from('case_files')
                .select('*, doctors(name)')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(3)

            console.log('Case files data:', data, 'Error:', error)

            if (data && data.length > 0) {
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
            setLoaded(true)
        }
        fetchCases()
    }, [])

    return (
        <section 
            ref={ref} 
            style={{ background: "var(--cream)", padding: "100px 0" }}
            id="success-gallery"
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
                            fontWeight: 700 
                        }}
                    >
                        Success Stories
                    </span>
                    <h2 
                        className={`mt-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{ 
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", 
                            fontSize: "clamp(32px, 5vw, 42px)", 
                            fontWeight: 600, 
                            color: "var(--forest)", 
                            lineHeight: 1.1,
                            transitionDelay: "100ms"
                        }}
                    >
                        Patient Case Files
                    </h2>
                    <p 
                        className={`mt-4 text-gray-500 max-w-[500px] mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{ fontSize: "15px", transitionDelay: "200ms" }}
                    >
                        Real stories of healing and recovery through holistic medical excellence.
                    </p>
                </div>

                {/* Grid */}
                {loaded && cases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cases.map((c, i) => (
                            <div 
                                key={c.id}
                                className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                {/* Photo/Placeholder */}
                                <div className="relative h-[200px] w-full overflow-hidden bg-forest">
                                    {c.photo_url ? (
                                        <img 
                                            src={c.photo_url} 
                                            alt={c.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5a40)' }} />
                                    )}
                                    
                                    {/* Clamped Tags Container */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        right: 12,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 6,
                                        overflow: 'hidden',
                                        maxHeight: 32,
                                    }}>
                                        {c.tags.slice(0, 2).map((tag, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-2 py-0.5 bg-gold text-[#92400e] text-[9px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm"
                                                style={{
                                                    maxWidth: 120,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-[17px] font-bold text-forest line-clamp-2 leading-tight mb-2 group-hover:text-gold transition-colors duration-300 h-10">
                                        {c.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-400 line-clamp-3 mb-4 h-[60px] italic">
                                        "{c.summary}"
                                    </p>
                                    
                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-mint/10 flex items-center justify-center text-mint">
                                                    <User size={10} />
                                                </div>
                                                <span className="text-[12px] font-bold text-mint uppercase tracking-wider">
                                                    Dr. {c.doctor_name?.replace("Dr. ", "")}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-300 font-medium">
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <Link 
                                            href={`/case-files/${c.id}`}
                                            className="mt-4 flex items-center gap-2 text-[13px] font-bold text-forest hover:text-gold transition-colors group/link"
                                        >
                                            Read Full Story 
                                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/50 border-2 border-dashed border-mint/20 rounded-[40px] p-20 text-center">
                        {!loaded ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 text-mint animate-spin" />
                                <p className="text-forest font-medium">Loading clinical cases...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-mint mb-2">
                                    📋
                                </div>
                                <h3 className="text-2xl font-bold text-forest" style={{ fontFamily: 'var(--font-cormorant)' }}>Gallery Coming Soon</h3>
                                <p className="text-gray-400 max-w-sm">We are currently documenting our recent success stories. Please check back soon for clinical updates.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* View All Button */}
                {cases.length > 0 && (
                    <div className="mt-16 text-center">
                        <Link 
                            href="/case-files"
                            className={`inline-flex items-center gap-3 px-8 py-3.5 bg-forest text-white rounded-full font-bold text-sm hover:bg-[#1a3a2a] transition-all shadow-lg active:scale-95 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                            style={{ transitionDelay: "600ms" }}
                        >
                            View All Success Gallery
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
