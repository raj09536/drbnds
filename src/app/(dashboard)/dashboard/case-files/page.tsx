"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"
import { toast } from "sonner"
import { Plus, Search, FileText, Trash2, Eye, X, Upload, Calendar, Tag, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface CaseFile {
    id: string
    title: string
    summary: string
    full_story: string
    photo_url: string | null
    tags: string[]
    doctor_id: number
    clinic_id: number
    is_active: boolean
    created_at: string
}

/* ─── Components ─────────────────────────────────────────────────────── */

function CaseFileCard({ 
    caseFile, 
    onDelete, 
    isExpanded, 
    onToggleExpand 
}: { 
    caseFile: CaseFile, 
    onDelete: (id: string) => Promise<void>,
    isExpanded: boolean,
    onToggleExpand: () => void
}) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="p-5 flex gap-5 items-start">
                <div className="shrink-0 relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                    {caseFile.photo_url ? (
                        <Image 
                            src={caseFile.photo_url} 
                            alt={caseFile.title} 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <FileText size={24} className="text-gray-300" />
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[16px] font-bold text-forest truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            {caseFile.title}
                        </h3>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(caseFile.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <p className="text-[13px] text-gray-500 leading-snug mb-3 line-clamp-2 italic">
                        "{caseFile.summary}"
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {caseFile.tags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className="px-2 py-0.5 bg-[#fdf8ee] text-[#92400e] border border-[#fbbf24]/20 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onToggleExpand}
                            style={{ cursor: 'pointer' }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isExpanded 
                                ? 'bg-forest text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <Eye size={14} />}
                            {isExpanded ? 'Collapse' : 'View Full Story'}
                        </button>
                        <button 
                            onClick={() => onDelete(caseFile.id)}
                            style={{ cursor: 'pointer' }}
                            className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:text-white hover:bg-rose-600 transition-all border border-gray-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-5 pb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="pt-5 border-t border-gray-50 flex flex-col gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={12} /> Detailed Clinical Story
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {caseFile.full_story}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function CaseFilesPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null)
    
    // Form State
    const [form, setForm] = useState({
        title: '',
        summary: '',
        full_story: '',
        tags: '',
    })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchCaseFiles = useCallback(async () => {
        if (!doctor?.doctor_id) return
        setLoadingData(true)
        
        const { data, error } = await supabase
            .from('case_files')
            .select('*')
            .eq('doctor_id', doctor.doctor_id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            
        if (!error) {
            setCaseFiles(data || [])
        }
        setLoadingData(false)
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchCaseFiles()
    }, [doctor, loading, router, fetchCaseFiles])

    const handleUploadAndSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || !form.summary || !form.full_story) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            let uploadedUrl = null
            
            if (photoFile) {
                const filename = `case-files/${Date.now()}-${photoFile.name}`
                const { error: uploadError } = await supabase.storage
                    .from('clinic-media')
                    .upload(filename, photoFile)
                
                if (uploadError) throw uploadError
                
                const { data } = supabase.storage
                    .from('clinic-media')
                    .getPublicUrl(filename)
                
                uploadedUrl = data.publicUrl
            }

            const { error: insertError } = await supabase
                .from('case_files')
                .insert({
                    doctor_id: doctor.doctor_id,
                    clinic_id: doctor.clinic_id,
                    title: form.title,
                    summary: form.summary,
                    full_story: form.full_story,
                    photo_url: uploadedUrl,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    is_active: true,
                })

            if (insertError) throw insertError

            toast.success("Case file added successfully!")
            setShowModal(false)
            setForm({ title: '', summary: '', full_story: '', tags: '' })
            setPhotoFile(null)
            fetchCaseFiles()
        } catch (error: any) {
            toast.error("Error: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteCaseFile = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this case file?")) return
        
        try {
            const { error } = await supabase
                .from('case_files')
                .update({ is_active: false })
                .eq('id', id)
            
            if (error) throw error
            
            toast.success("Case file removed")
            setCaseFiles(prev => prev.filter(c => c.id !== id))
        } catch (error: any) {
            toast.error("Error: " + error.message)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-800 font-bold animate-pulse">🌿 Loading Case Files...</p>
            </div>
        </div>
    )

    if (!doctor) return null

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar title="Clinical Case Files" breadcrumb="Dashboard / Case Files" doctor={doctor} />

                <main className="p-8 max-w-6xl mx-auto">
                    {/* Header with Add Button */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                                Success Gallery
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Documenting Patient Journeys</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(true)}
                            style={{ cursor: 'pointer' }}
                            className="bg-forest text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-forest/90 transition-all shadow-md active:scale-95"
                        >
                            <Plus size={20} />
                            Add New Case
                        </button>
                    </div>

                    {/* Case Files List */}
                    {loadingData ? (
                        <div className="grid grid-cols-1 gap-6 opacity-50">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : caseFiles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {caseFiles.map(caseFile => (
                                <CaseFileCard 
                                    key={caseFile.id} 
                                    caseFile={caseFile} 
                                    onDelete={deleteCaseFile}
                                    isExpanded={expandedCaseId === caseFile.id}
                                    onToggleExpand={() => setExpandedCaseId(expandedCaseId === caseFile.id ? null : caseFile.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-3xl mb-4 text-amber-600">📁</div>
                            <h3 className="text-lg font-bold text-gray-900">No case files yet</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-8 max-w-[280px]">Add your first success story to build trust with potential patients.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                style={{ cursor: 'pointer' }}
                                className="text-forest font-bold text-sm underline decoration-2 underline-offset-4"
                            >
                                Start your first entry
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => !isSubmitting && setShowModal(false)}
                    ></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add Case Study</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Share a medical milestone</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ cursor: 'pointer' }}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                                disabled={isSubmitting}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleUploadAndSave} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Case Title*</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Rare Homeopathic Recovery from Chronic PCOD"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition-all text-sm font-medium"
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                    />
                                </div>

                                {/* Summary */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Short Summary* (2 lines)</label>
                                    <textarea 
                                        required
                                        rows={2}
                                        placeholder="Briefly state the condition and the outcome..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition-all text-sm font-medium resize-none"
                                        value={form.summary}
                                        onChange={e => setForm({...form, summary: e.target.value})}
                                    />
                                </div>

                                {/* Full Story */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed clinical Story* (6+ lines)</label>
                                    <textarea 
                                        required
                                        rows={6}
                                        placeholder="Describe the initial diagnosis, treatment process, and long-term results..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition-all text-sm font-medium resize-none"
                                        value={form.full_story}
                                        onChange={e => setForm({...form, full_story: e.target.value})}
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Condition Tags (Comma separated)</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-3.5 text-gray-300" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="PCOD, Recovery, Thyroid, 6-Months..."
                                            style={{ cursor: 'pointer' }}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition-all text-sm font-medium"
                                            value={form.tags}
                                            onChange={e => setForm({...form, tags: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {/* Photo */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            id="case-photo"
                                            className="hidden"
                                            onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                                        />
                                        <label 
                                            htmlFor="case-photo"
                                            style={{ cursor: 'pointer' }}
                                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                                photoFile ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-forest/40 hover:bg-forest/2'
                                            }`}
                                        >
                                            {photoFile ? (
                                                <span className="flex items-center gap-2 font-bold"><Upload size={18} /> {photoFile.name}</span>
                                            ) : (
                                                <span className="flex items-center gap-3 italic"><ImageIcon size={20} /> Click to upload patient photo or report</span>
                                            )}
                                        </label>
                                        {photoFile && (
                                            <button 
                                                type="button"
                                                onClick={() => setPhotoFile(null)}
                                                style={{ cursor: 'pointer' }}
                                                className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                style={{ cursor: 'pointer' }}
                                className="w-full mt-10 bg-forest text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-forest/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Save & Build Success Gallery
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    )
}
