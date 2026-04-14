"use client"

import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { clinics } from "@/data/staticData"

export function Locations() {
    const { ref, isVisible } = useScrollReveal(0.1)

    return (
        <section id="location" ref={ref} className="section-padding" style={{ background: "white" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
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
                        Find Us
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
                        Our Clinic Locations
                    </h2>
                    <p
                        className={`mt-3 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "15px",
                            color: "var(--muted)",
                            lineHeight: 1.75,
                            transitionDelay: "200ms",
                        }}
                    >
                        Visit us at either of our two healing centres
                    </p>
                </div>

                {/* Clinic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {clinics.map((clinic, i) => (
                        <div
                            key={clinic.id}
                            className={`overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{
                                background: "var(--warm-white)",
                                border: "1px solid var(--gold-light)",
                                borderRadius: "20px",
                                transitionDelay: `${300 + i * 150}ms`,
                            }}
                        >
                            {/* Card Content */}
                            <div style={{ padding: "32px" }}>
                                {/* Badge */}
                                <span
                                    className="inline-block rounded-full"
                                    style={{
                                        background: "var(--forest)",
                                        color: "white",
                                        padding: "4px 14px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Clinic 0{clinic.id}
                                </span>

                                {/* Clinic Name */}
                                <h3
                                    className="mt-4"
                                    style={{
                                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                        fontSize: "24px",
                                        fontWeight: 600,
                                        color: "var(--forest)",
                                    }}
                                >
                                    {clinic.name}
                                </h3>

                                {/* Doctor */}
                                <p
                                    className="mt-2"
                                    style={{
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "13px",
                                        color: "var(--sage)",
                                    }}
                                >
                                    👨‍⚕️ {clinic.doctor}
                                </p>

                                {/* Info */}
                                <div className="flex flex-col gap-3 mt-5">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--sage)" }} />
                                        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)" }}>
                                            {clinic.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--sage)" }} />
                                        <a
                                            href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
                                            className="hover:underline"
                                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--forest)", fontWeight: 500 }}
                                        >
                                            {clinic.phone}
                                        </a>
                                        {clinic.phone2 && (
                                            <>
                                                <span style={{ color: "var(--muted)" }}>·</span>
                                                <a
                                                    href={`tel:${clinic.phone2.replace(/[^+\d]/g, "")}`}
                                                    className="hover:underline"
                                                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--forest)", fontWeight: 500 }}
                                                >
                                                    {clinic.phone2}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--sage)" }} />
                                        <a
                                            href={`mailto:${clinic.email}`}
                                            className="hover:underline"
                                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--forest)", fontWeight: 500 }}
                                        >
                                            {clinic.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Get Directions */}
                                <a
                                    href={clinic.map_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-6 rounded-lg transition-all duration-200 hover:bg-sage"
                                    style={{
                                        background: "var(--forest)",
                                        color: "white",
                                        padding: "10px 22px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Get Directions
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Map Embed */}
                            <iframe
                                src={clinic.map_embed}
                                width="100%"
                                className="w-full rounded-xl"
                                style={{ border: "none", height: "clamp(220px, 35vw, 400px)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${clinic.name}`}
                            />
                        </div>
                    ))}
                </div>

                {/* Urgency Note */}
                <p
                    className="text-center mt-10"
                    style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "14px",
                        color: "var(--muted)",
                    }}
                >
                    Need urgent care? Call us directly:{" "}
                    <a href="tel:+918191919949" className="hover:underline" style={{ color: "var(--forest)", fontWeight: 600 }}>
                        +91-8191919949
                    </a>
                </p>
            </div>
        </section>
    )
}
