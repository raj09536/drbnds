"use client"

import Image from "next/image"
import { Phone, Video, Building2, ArrowRight, Calendar, MapPin } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useAppointment } from "@/context/AppointmentContext"
import { doctors } from "@/data/staticData"

export function Doctors() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const { openModal } = useAppointment()

    return (
        <section id="doctors" ref={ref} style={{ background: "white", padding: "96px 0" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
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
                        Expert Care
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
                        Meet Your Healers
                    </h2>
                </div>

                {/* Doctor Cards */}
                <div className="flex flex-col gap-8">
                    {doctors.map((doctor, idx) => {
                        const isReversed = idx % 2 !== 0
                        return (
                            <div
                                key={doctor.id}
                                className={`overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    borderRadius: "16px",
                                    transitionDelay: `${300 + idx * 200}ms`,
                                }}
                            >
                                <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                                    {/* Image Side */}
                                    <div className="relative lg:w-[40%]" style={{ minHeight: "400px" }}>
                                        <Image
                                            src={doctor.photo}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover"
                                            style={{
                                                borderRadius: isReversed
                                                    ? "0 16px 16px 0"
                                                    : "16px 0 0 16px",
                                            }}
                                        />
                                    </div>

                                    {/* Content Side */}
                                    <div className="lg:w-[60%]" style={{ padding: "40px", background: "#f8f9fa" }}>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "11px",
                                                letterSpacing: "4px",
                                                textTransform: "uppercase",
                                                color: "var(--mint)",
                                                fontWeight: 500,
                                            }}
                                        >
                                            About Doctor
                                        </span>

                                        <h3
                                            className="mt-3"
                                            style={{
                                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                                fontSize: "36px",
                                                fontWeight: 600,
                                                color: "var(--forest)",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {doctor.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {doctor.qualifications.map((q) => (
                                                <span
                                                    key={q}
                                                    className="rounded-full"
                                                    style={{
                                                        background: "var(--cream)",
                                                        border: "1px solid var(--gold-light)",
                                                        padding: "4px 14px",
                                                        fontFamily: "var(--font-dm-sans)",
                                                        fontSize: "13px",
                                                        color: "var(--forest)",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {q}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-5 mt-5">
                                            <span
                                                className="flex items-center gap-1.5"
                                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}
                                            >
                                                <Calendar className="w-3.5 h-3.5" /> {doctor.years_exp}+ Years Experience
                                            </span>
                                            <span
                                                className="flex items-center gap-1.5"
                                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}
                                            >
                                                📋 {doctor.specialization}
                                            </span>
                                            <span
                                                className="flex items-center gap-1.5"
                                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}
                                            >
                                                <MapPin className="w-3.5 h-3.5" /> {doctor.clinic_name.split("—")[0].trim()}
                                            </span>
                                        </div>

                                        <p
                                            className="mt-5"
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "15px",
                                                color: "var(--muted)",
                                                lineHeight: 1.75,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {doctor.bio}
                                        </p>

                                        {/* Action Buttons Row */}
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            <a
                                                href={`tel:${doctor.phone.replace(/[^+\d]/g, "")}`}
                                                className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:bg-forest hover:text-white hover:border-forest"
                                                style={{
                                                    border: "1px solid var(--sage)",
                                                    color: "var(--forest)",
                                                    padding: "8px 16px",
                                                    fontFamily: "var(--font-dm-sans)",
                                                    fontSize: "13px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                <Phone className="w-3.5 h-3.5" /> Call
                                            </a>
                                            <button
                                                className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
                                                style={{
                                                    border: "1px solid var(--sage)",
                                                    color: "var(--forest)",
                                                    padding: "8px 16px",
                                                    fontFamily: "var(--font-dm-sans)",
                                                    fontSize: "13px",
                                                    fontWeight: 500,
                                                    background: "transparent",
                                                }}
                                            >
                                                <Video className="w-3.5 h-3.5" /> Video Call
                                            </button>
                                            <button
                                                className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:bg-forest hover:text-white hover:border-forest cursor-pointer"
                                                style={{
                                                    border: "1px solid var(--sage)",
                                                    color: "var(--forest)",
                                                    padding: "8px 16px",
                                                    fontFamily: "var(--font-dm-sans)",
                                                    fontSize: "13px",
                                                    fontWeight: 500,
                                                    background: "transparent",
                                                }}
                                            >
                                                <Building2 className="w-3.5 h-3.5" /> In Person
                                            </button>
                                        </div>

                                        {/* Book Button — opens modal with pre-selected doctor */}
                                        <button
                                            onClick={() => openModal(doctor.id)}
                                            className="w-full flex items-center justify-center gap-2 mt-6 rounded-lg cursor-pointer transition-all duration-200 hover:brightness-110"
                                            style={{
                                                background: "var(--gold)",
                                                color: "var(--forest)",
                                                padding: "14px",
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                border: "none",
                                            }}
                                        >
                                            Book an Appointment with {doctor.name.split(".").pop()?.trim()}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
