"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"

const images = [
    { id: 1, src: '/clinic1-main.jpg', caption: 'Our Dehradun Clinic' },
    { id: 2, src: '/clinic1-2.jpg', caption: 'Patient Consultation' },
    { id: 3, src: '/clinic1-3.jpg', caption: 'Homoeopathic Remedies' },
    { id: 4, src: '/clinic2-1.jpg', caption: 'Bijnor Clinic' },
    { id: 5, src: '/clinic1-4.jpg', caption: 'Reception Area' },
    { id: 6, src: '/clinic1-5.jpg', caption: 'Expert Diagnosis' },
    { id: 7, src: '/clinic2-2.jpg', caption: 'Natural Remedies' },
]

export function Gallery() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const router = useRouter()
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

    const openLightbox = (idx: number) => setLightboxIdx(idx)
    const closeLightbox = () => setLightboxIdx(null)

    const nextImage = useCallback(() => {
        if (lightboxIdx === null) return
        setLightboxIdx((lightboxIdx + 1) % images.length)
    }, [lightboxIdx])

    const prevImage = useCallback(() => {
        if (lightboxIdx === null) return
        setLightboxIdx((lightboxIdx - 1 + images.length) % images.length)
    }, [lightboxIdx])

    // ESC and arrow keys
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

    const featuredImage = images[0]
    const thumbnails = images.slice(1)

    return (
        <section ref={ref} id="gallery" style={{ background: "white", padding: "96px 0" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
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
                        Inside Our Clinics
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
                        Media Pictures
                    </h2>
                </div>

                {/* Featured Image */}
                <div
                    className={`overflow-hidden cursor-pointer mb-4 group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ borderRadius: "12px", height: "400px", transitionDelay: "200ms", overflow: "hidden" }}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={featuredImage.src}
                        alt={featuredImage.caption}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-105"
                    />
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {thumbnails.map((img, i) => (
                        <div
                            key={img.id}
                            className={`overflow-hidden cursor-pointer group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{
                                borderRadius: "12px",
                                height: "160px",
                                transitionDelay: `${300 + i * 80}ms`,
                                overflow: "hidden"
                            }}
                            onClick={() => openLightbox(i + 1)}
                        >
                            <img
                                src={img.src}
                                alt={img.caption}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                className="transition-transform duration-500 group-hover:scale-[1.05] group-hover:brightness-105"
                            />
                        </div>
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => router.push('/gallery')}
                        className="view-all-btn"
                    >
                        View All →
                    </button>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && images[lightboxIdx] && (
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.92)" }}
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gold transition-colors cursor-pointer bg-transparent border-none"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Prev */}
                    <button
                        className="absolute left-6 text-white hover:text-gold transition-colors cursor-pointer bg-transparent border-none"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    {/* Image */}
                    <div className="text-center" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh" }}>
                        <img
                            src={images[lightboxIdx].src}
                            alt={images[lightboxIdx].caption}
                            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
                            className="rounded-lg animate-lightbox-in"
                        />
                        <p
                            className="mt-3"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            {images[lightboxIdx].caption}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        className="absolute right-6 text-white hover:text-gold transition-colors cursor-pointer bg-transparent border-none"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <style jsx>{`
            @keyframes lightboxIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-lightbox-in {
              animation: lightboxIn 0.3s ease-out;
            }
          `}</style>
                </div>
            )}
        </section>
    )
}
