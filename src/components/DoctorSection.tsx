"use client"

import { useState, useEffect } from "react"
import { Phone, Video, Building2, ArrowRight, Calendar, MapPin, Pill } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useAppointment } from "@/context/AppointmentContext"
import { doctors as staticDoctors } from "@/data/staticData"
import { supabase } from "@/lib/supabase"

/* ─── Sub-Component for Team Member Card ─── */
function TeamMemberCard({ member, idx, isVisible, isReversed, openModal }: any) {
    const isAmit = member.id === 'pharmacist' && !member.photo

    return (
        <div
            className={`transition-all duration-700 flex flex-col lg:flex-row ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{
                display: "flex",
                flexDirection: isReversed ? "row-reverse" : "row",
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                marginBottom: "32px",
                transitionDelay: `${idx * 150}ms`,
                minHeight: "400px",
                maxWidth: "1000px",
                margin: "0 auto 32px auto"
            }}
        >
            {/* Image Side - Fixed Size */}
            {isAmit ? (
                <div style={{
                    width: '320px',
                    minWidth: '320px',
                    height: '400px',
                    background: '#1a3a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 56,
                    color: 'white',
                    fontWeight: 700,
                    flexShrink: 0
                }}>
                    AK
                </div>
            ) : (
                <div style={{
                    width: '320px',
                    minWidth: '320px',
                    height: '400px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#f5f0e8',
                    position: 'relative'
                }}>
                    <img
                        src={member.photo}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = 
                                    `<div style="width:320px;height:400px;background:#1a3a2a;display:flex;align-items:center;justify-content:center;font-size:56px;color:white;font-weight:700">
                                        ${member.id === 'pharmacist' ? 'AK' : member.name.split(" ").map((n:any) => n[0]).join("").slice(0, 2)}
                                    </div>`
                            }
                        }}
                    />
                </div>
            )}

            {/* Content Side - Flexible */}
            <div style={{
                flex: 1,
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: isReversed ? "#fcfbf9" : "white"
            }}>
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
                    {member.isPharmacist ? "Team Member" : "Specialist Doctor"}
                </span>

                <h3
                    className="mt-3"
                    style={{
                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                        fontSize: "38px",
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
                            className="px-8 py-3 bg-forest text-white rounded-full font-bold text-[14px] shadow-sm hover:brightness-110 transition-all cursor-pointer"
                        >
                            Book Consultation
                            <ArrowRight size={16} className="inline ml-2" />
                        </button>
                        <div className="flex gap-2">
                             <a href={`tel:${member.phone}`} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all">
                                <Phone size={16} />
                            </a>
                            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all cursor-pointer">
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
                clinic_name: d.clinic_name || "Dr. BND's Clinic",
                bio: d.bio || "Dedicated medical professional.",
                phone: d.phone || "+91 00000 00000"
            })) : staticDoctors

            const pharmacist = {
                id: 'pharmacist',
                name: 'Amit Kumar',
                role: 'Pharmacist',
                specialization: 'Medicine & Drug Dispensing',
                photo: '/amit-kumar.jpg', 
                initials: 'AK',
                qualifications: ['B.Pharm', 'Registered Pharmacist'],
                years_exp: 10,
                clinic_name: "Dr. BND's clinic",
                bio: "Expert pharmacist specializing in holistic medicine dispensing and personalized patient medication guidance. Committed to pharmaceutical excellence.",
                phone: "+91 00000 00000",
                isPharmacist: true
            }

            setTeamMembers([...doctorsList, pharmacist])
        }
        fetchTeam()
    }, [])

    return (
        <section id="doctors" ref={ref} style={{ background: "white", padding: "100px 0" }}>
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
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
                        Meet the Team
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(32px, 4.5vw, 42px)",
                            fontWeight: 600,
                            color: "var(--forest)",
                            lineHeight: 1.1,
                            transitionDelay: "100ms",
                        }}
                    >
                        Our Team
                    </h2>
                </div>

                <div className="flex flex-col gap-8">
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
