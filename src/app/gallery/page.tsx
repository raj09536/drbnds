"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X, ChevronLeft, ChevronRight, ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface GalleryImage {
    id: number
    image_url: string
    caption: string
    clinic_id: number
    is_active: boolean
}

export default function GalleryPage() {
    const router = useRouter()
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

    const fetchGallery = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('gallery')
            .select('id, image_url, caption, clinic_id, is_active')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (data) setImages(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchGallery()
    }, [])

    const openLightbox = (idx: number) => setLightboxIdx(idx)
    const closeLightbox = () => setLightboxIdx(null)

    const nextImage = useCallback(() => {
        if (lightboxIdx === null || images.length === 0) return
        setLightboxIdx((lightboxIdx + 1) % images.length)
    }, [lightboxIdx, images])

    const prevImage = useCallback(() => {
        if (lightboxIdx === null || images.length === 0) return
        setLightboxIdx((lightboxIdx - 1 + images.length) % images.length)
    }, [lightboxIdx, images])

    useEffect(() => {
        if (lightboxIdx === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox()
            if (e.key === "ArrowRight") nextImage()
            if (e.key === "ArrowLeft") prevImage()
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [lightboxIdx, nextImage, prevImage])

    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-forest font-bold transition-all hover:opacity-70 bg-transparent border-none cursor-pointer"
                        style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                    <h1 className="text-xl font-bold text-forest" style={{ fontFamily: 'var(--font-cormorant)' }}>Full Gallery</h1>
                    <div className="w-24" /> {/* Spacer */}
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-mint gap-3">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Loading Gallery...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                        <p className="text-xl">📸 No photos found</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((img, i) => (
                            <div
                                key={img.id}
                                className="break-inside-avoid overflow-hidden rounded-2xl cursor-pointer group relative shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                                onClick={() => openLightbox(i)}
                            >
                                <img
                                    src={img.image_url}
                                    alt={img.caption || 'Clinic photo'}
                                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium text-sm">{img.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Lightbox */}
            {lightboxIdx !== null && images[lightboxIdx] && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10"
                    style={{ background: "rgba(0,0,0,0.95)" }}
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gold transition-colors cursor-pointer bg-white/10 p-2 rounded-full border-none backdrop-blur-md"
                        onClick={closeLightbox}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        className="absolute left-6 text-white hover:text-gold transition-colors cursor-pointer bg-white/10 p-3 rounded-full border-none backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={images[lightboxIdx].image_url}
                                alt={images[lightboxIdx].caption || 'Clinic photo'}
                                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                            />
                        </div>
                        {images[lightboxIdx].caption && (
                            <p className="mt-6 text-white/80 font-medium text-lg text-center" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                                {images[lightboxIdx].caption}
                            </p>
                        )}
                        <div className="mt-4 text-white/40 text-[11px] font-bold tracking-widest uppercase">
                            {lightboxIdx + 1} / {images.length}
                        </div>
                    </div>

                    <button
                        className="absolute right-6 text-white hover:text-gold transition-colors cursor-pointer bg-white/10 p-3 rounded-full border-none backdrop-blur-md"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            )}
        </div>
    )
}
