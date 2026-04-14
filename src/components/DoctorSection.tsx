"use client"

import { useState, useEffect } from "react"
import { Phone, Video, Building2, ArrowRight, Calendar, MapPin, Pill, Star } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useAppointment } from "@/context/AppointmentContext"
import { doctors as staticDoctors } from "@/data/staticData"
import { supabase } from "@/lib/supabase"

/* ─── Sub-Component for Team Member Card ─── */
function TeamMemberCard({ member, idx, isVisible, isReversed, openModal }: any) {
    const isAmit = member.id === 'pharmacist' && !member.photo
    const initials = member.name.split(" ").map((n:any) => n[0]).join("").slice(0, 2)

    return (
        <div
            className={`transition-all duration-700 flex flex-col items-center md:gap-12 ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                marginBottom: "32px",
                transitionDelay: `${idx * 150}ms`,
                maxWidth: "1000px",
                margin: "0 auto 32px auto"
            }}
        >
            {/* Image Side - Responsive Size */}
            {isAmit ? (
                <div className="shrink-0 flex items-center justify-center font-bold text-6xl text-white bg-[#1a3a2a] w-full max-w-[320px] mx-auto aspect-square md:w-[280px] md:max-w-none md:h-[400px] md:aspect-auto mt-4 md:mt-0 md:ml-4 md:mr-4">
                    {initials}
                </div>
            ) : (
                <div className="shrink-0 overflow-hidden relative bg-[#f5f0e8] w-full max-w-[320px] mx-auto aspect-square md:w-[280px] md:max-w-none md:h-[400px] md:aspect-auto mt-6 md:mt-0 md:ml-4 md:mr-4">
                    <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = 
                                    `<div class="w-full h-full flex items-center justify-center font-bold text-6xl text-white bg-[#1a3a2a]">
                                        ${initials}
                                    </div>`
                            }
                        }}
                    />
                </div>
            )}

            {/* Content Side - Flexible */}
            <div 
                className="flex-1 p-8 lg:p-10 flex flex-col justify-center" 
                style={{ background: isReversed ? "#fcfbf9" : "white" }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "11px",
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                            color: "var(--mint)",
                            fontWeight: 700,
                        }}
                    >
                        {member.isPharmacist ? "D. Pharma Homeopathy" : "Specialist Doctor"}
                    </span>
                    <div className="hidden sm:flex items-center gap-1 text-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="var(--gold)" />)}
                    </div>
                </div>

                <h3
                    className="mt-1"
                    style={{
                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                        fontSize: "clamp(22px, 3vw, 32px)",
                        fontWeight: 600,
                        color: "var(--forest)",
                        lineHeight: 1.1,
                        fontStyle: 'italic'
                    }}
                >
                    {member.name}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                    {member.qualifications.map((q: string) => (
                        <span
                            key={q}
                            className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[12px] font-medium text-forest"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            {q}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-[14px]">{member.years_exp}+ Years Exp</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        {member.isPharmacist ? <Pill size={14} /> : <span>📋</span>}
                        <span className="text-[14px]">{member.specialization}</span>
                    </div>
                </div>

                <p
                    className="mt-6"
                    style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "15px",
                        color: "var(--muted)",
                        lineHeight: 1.7,
                        opacity: 0.9
                    }}
                >
                    {member.bio}
                </p>

                {!member.isPharmacist ? (
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => openModal(member.id)}
                            className="px-8 py-3 bg-forest text-white rounded-full font-bold text-[14px] shadow-sm hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
                        >
                            Book Consultation
                            <ArrowRight size={16} className="inline ml-1" />
                        </button>
                        <div className="flex gap-2">
                             <a href={`tel:${member.phone}`} className="w-12 h-12 lg:w-10 lg:h-10 rounded-full border border-gray-100 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all">
                                <Phone size={16} />
                            </a>
                            <button className="w-12 h-12 lg:w-10 lg:h-10 rounded-full border border-gray-100 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all cursor-pointer">
                                <Video size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-gray-400">
                        <MapPin size={14} />
                        <span className="text-[13px] font-medium uppercase tracking-wider">{member.clinic_name} — In-house Pharmacy</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function Doctors() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const { openModal } = useAppointment()
    const [teamMembers, setTeamMembers] = useState<any[]>([])

    useEffect(() => {
        const fetchTeam = async () => {
            const { data: dbDoctors } = await supabase
                .from('doctors')
                .select('*')
                .eq('is_active', true)
            
            const doctorsList = dbDoctors && dbDoctors.length > 0 ? dbDoctors.map(d => ({
                id: d.id,
                name: d.name,
                photo: d.photo_url || "/doctor.jpeg",
                qualifications: d.qualifications || ["Expert Doctor"],
                specialization: d.specialization || "General Physician",
                years_exp: d.years_exp || 5,
                clinic_name: d.clinic_name || "Dr. BND's clinic",
                bio: d.bio || "Dedicated medical professional providing holistic care through advanced homoeopathy.",
                phone: d.phone || "+91 81919 19949"
            })) : staticDoctors

            const pharmacist = {
                id: 'pharmacist',
                name: 'Amit Kumar',
                role: 'D. Pharma Homeopathy',
                specialization: 'D. Pharma Homeopathy',
                photo: '/amit-kumar.jpg',
                initials: 'AK',
                qualifications: ['D. Pharma', 'Homoeopathy Pharmacist'],
                years_exp: 2,
                clinic_name: "Dr. BND's Clinic",
                bio: "Expert pharmacist specializing in holistic medicine dispensing and personalized patient medication guidance. Committed to pharmaceutical excellence.",
                phone: "+91 81919 19949",
                isPharmacist: true
            }

            setTeamMembers([...doctorsList, pharmacist])
        }
        fetchTeam()
    }, [])

    return (
        <section id="doctors" ref={ref} className="section-padding bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span
                        className={`block transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "11px",
                            letterSpacing: "5px",
                            textTransform: "uppercase",
                            color: "var(--mint)",
                            fontWeight: 700,
                        }}
                    >
                        Medical Board
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(32px, 4.5vw, 48px)",
                            fontWeight: 600,
                            color: "var(--forest)",
                            lineHeight: 1.1,
                            transitionDelay: "100ms",
                        }}
                    >
                        Our Clinical Experts
                    </h2>
                </div>

                <div className="flex flex-col">
                    {teamMembers.map((member, idx) => (
                        <TeamMemberCard 
                            key={member.id} 
                            member={member} 
                            idx={idx} 
                            isVisible={isVisible} 
                            isReversed={idx % 2 !== 0}
                            openModal={openModal}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

