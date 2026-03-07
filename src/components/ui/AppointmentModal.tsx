"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
)
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
)
const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
)

/* ─── Types and Hardcoded Data ────────────────────────────────────────── */
interface Doctor {
    id: number
    name: string
    spec: string
    clinic: string
    clinic_id: number
    photo: string
}

const DOCTORS: Doctor[] = [
    {
        id: 1,
        name: 'Dr. B. N. Dwivedy',
        spec: 'MD Homeopathy · Psychotherapy',
        clinic: 'Clinic 1 — Dehradun',
        clinic_id: 1,
        photo: '/doctor.jpeg',
    },
    {
        id: 2,
        name: 'Dr. Himanshu Bhandari',
        spec: 'B.H.M.S (H.P.U)',
        clinic: 'Clinic 2 — Bijnor',
        clinic_id: 2,
        photo: '/second_doctor.jpeg',
    },
]

/* ─── Time Slots ─────────────────────────────────────────────────────── */
const ALL_SLOTS = [
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM",
    "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
    "08:00 PM", "08:15 PM", "08:30 PM",
]

/* ─── Sub-components ─────────────────────────────────────────────────── */
const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3" style={{ margin: "24px 0 16px" }}>
        <div className="flex-1" style={{ height: "1px", background: "rgba(0,0,0,0.08)" }} />
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
        <div className="flex-1" style={{ height: "1px", background: "rgba(0,0,0,0.08)" }} />
    </div>
)

const OptionalTag = () => (
    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", fontWeight: 500, color: "var(--sage)", background: "rgba(61,107,82,0.1)", padding: "2px 8px", borderRadius: "999px", marginLeft: "6px", verticalAlign: "middle" }}>Optional</span>
)

const SectionLabel = ({ children, optional, htmlFor }: { children: React.ReactNode; optional?: boolean; htmlFor?: string }) => (
    <label htmlFor={htmlFor} style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
        {children}{optional && <OptionalTag />}
    </label>
)

const inputStyle: React.CSSProperties = {
    padding: "12px 14px", border: "2px solid rgba(0,0,0,0.1)", borderRadius: "10px",
    fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--forest)",
    width: "100%", outline: "none", transition: "border 0.2s, box-shadow 0.2s",
}

interface Props {
    onClose: () => void
    preSelectedDoctorId: number | null
}

export function AppointmentModal({ onClose, preSelectedDoctorId }: Props) {
    const [step, setStep] = useState<1 | 2>(1)
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [mode, setMode] = useState<"audio" | "video" | "physical">("physical")
    const [date, setDate] = useState("")
    const [slot, setSlot] = useState<string | null>(null)
    const [showAllSlots, setShowAllSlots] = useState(false)
    const [booked, setBooked] = useState(false)
    const [countdown, setCountdown] = useState(3)
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [reason, setReason] = useState("")
    const [email, setEmail] = useState("")
    const [location, setLocation] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [bookedSlots, setBookedSlots] = useState<string[]>([])

    const today = new Date().toISOString().split("T")[0]

    const resetForm = useCallback(() => {
        setStep(1)
        setSelectedDoctor(null)
        setMode("physical")
        setDate("")
        setSlot(null)
        setFullName("")
        setPhone("")
        setReason("")
        setEmail("")
        setLocation("")
        setBooked(false)
        setCountdown(3)
        setBookedSlots([])
    }, [])

    useEffect(() => {
        if (preSelectedDoctorId) {
            const doc = DOCTORS.find((d) => d.id === preSelectedDoctorId)
            if (doc) {
                setSelectedDoctor(doc)
                setStep(2)
            }
        }
    }, [preSelectedDoctorId])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    useEffect(() => {
        let timer: any
        if (booked && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1)
            }, 1000)
        } else if (booked && countdown === 0) {
            onClose()
            resetForm()
        }
        return () => clearInterval(timer)
    }, [booked, countdown, onClose, resetForm])

    // Fetch booked slots when date OR doctor changes
    useEffect(() => {
        if (!date || !selectedDoctor) return

        const fetchBooked = async () => {
            const { data } = await supabase
                .from('appointments')
                .select('time_slot')
                .eq('doctor_id', selectedDoctor.id)
                .eq('appointment_date', date)
                .in('status', ['pending', 'confirmed'])

            setBookedSlots(data?.map(a => a.time_slot) || [])
        }

        fetchBooked()
    }, [date, selectedDoctor])

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!fullName.trim()) errs.fullName = "Full name is required"
        if (!phone.trim()) errs.phone = "Phone number is required"
        else if (!/^\+?[\d\s-]{10,}$/.test(phone.trim())) errs.phone = "Enter a valid phone number"
        if (!date) errs.date = "Please select a date"
        if (!slot) errs.slot = "Please select a time slot"
        return errs
    }

    const handleBook = useCallback(async () => {
        if (!selectedDoctor) return
        const errs = validate()
        if (Object.keys(errs).length) { setFieldErrors(errs); return }
        setFieldErrors({})
        setLoading(true)

        const { error } = await supabase.from("appointments").insert({
            doctor_id: selectedDoctor.id,
            clinic_id: selectedDoctor.clinic_id,
            patient_name: fullName.trim(),
            patient_phone: phone.trim(),
            patient_email: email.trim() || null,
            reason: reason.trim() || null,
            appointment_date: date,
            time_slot: slot,
            mode,
            status: "pending",
        })

        setLoading(false)
        if (error) {
            setFieldErrors({ general: "Failed to book. Please try again." })
        } else {
            setBooked(true)
        }
    }, [selectedDoctor, date, slot, mode, fullName, phone, reason, email, location])

    const slotsToShow = showAllSlots ? ALL_SLOTS : ALL_SLOTS.slice(0, 10)
    const modes: { key: "audio" | "video" | "physical"; icon: any; label: string }[] = [
        { key: "audio", icon: PhoneIcon, label: "Audio Call" },
        { key: "video", icon: VideoIcon, label: "Video Call" },
        { key: "physical", icon: PersonIcon, label: "In Person" },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,58,42,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose}>
            <div className="w-full relative flex flex-col bg-white rounded-[20px] shadow-2xl overflow-hidden animate-modal-in" style={{ maxWidth: "520px", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div style={{ background: "var(--forest)", padding: "24px 28px 20px", flexShrink: 0 }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "var(--mint)", fontWeight: 500 }}>Step {step} of 2</span>
                            <h3 className="mt-1" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "26px", fontWeight: 400, color: "white" }}>
                                {step === 1 ? "Choose Your Doctor" : "Book Appointment"}
                            </h3>
                        </div>
                        {!booked && (
                            <button onClick={onClose} className="shrink-0 flex items-center justify-center rounded-full bg-white/10 border-none text-white text-xl cursor-pointer hover:bg-white/20 transition-all" style={{ width: "36px", height: "36px" }}>×</button>
                        )}
                    </div>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto flex-1" style={{ padding: "24px 28px 28px" }}>
                    {booked ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 text-forest text-2xl">✓</div>
                            <h3 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "28px", color: "var(--forest)" }}>Appointment Booked!</h3>
                            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)" }}>
                                We have received your request and will contact you shortly.
                            </p>
                            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", fontWeight: 600, color: "var(--sage)" }}>
                                Closing in {countdown}...
                            </p>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-4">
                            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}>Select the doctor you&apos;d like to consult with:</p>
                            <div className="space-y-3">
                                {DOCTORS.map((doc) => {
                                    const isSelected = selectedDoctor?.id === doc.id
                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className="w-full flex items-center text-left gap-4 p-4 rounded-xl transition-all border-none relative cursor-pointer"
                                            style={{
                                                background: isSelected ? "#fdf8ee" : "white",
                                                border: isSelected ? "2px solid var(--gold)" : "2px solid rgba(0,0,0,0.08)",
                                                boxShadow: isSelected ? "0 0 0 4px rgba(201,168,76,0.12)" : "none",
                                                overflow: "visible"
                                            }}
                                        >
                                            <div className="shrink-0 rounded-full overflow-hidden border-2 border-white" style={{ width: "52px", height: "52px" }}>
                                                <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "12px", fontWeight: 600, color: "var(--forest)", margin: 0 }}>{doc.name}</h4>
                                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "var(--muted)", margin: "2px 0" }}>{doc.spec}</p>
                                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--sage)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                                    📍 {doc.clinic}
                                                </span>
                                            </div>
                                            <div
                                                className="shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center"
                                                style={{
                                                    borderColor: isSelected ? "var(--gold)" : "#d1d5db",
                                                    background: isSelected ? "var(--gold)" : "transparent"
                                                }}
                                            >
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => step === 1 && selectedDoctor && setStep(2)}
                                disabled={!selectedDoctor}
                                className="w-full mt-6 py-4 rounded-xl border-none font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                                style={{
                                    background: selectedDoctor ? "var(--forest)" : "#d1d5db",
                                    color: "white",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px"
                                }}
                            >
                                Continue →
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3 bg-cream rounded-xl p-3 mb-6">
                                <div className="shrink-0 rounded-full overflow-hidden w-8 h-8">
                                    <img src={selectedDoctor?.photo} alt={selectedDoctor?.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-forest m-0">{selectedDoctor?.name}</p>
                                    <p className="text-[10px] text-muted m-0">{selectedDoctor?.clinic}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="bg-transparent border-none text-sage text-xs font-bold cursor-pointer hover:text-forest">Change →</button>
                            </div>

                            <SectionDivider label="Booking Details" />

                            <SectionLabel>Mode of Consultation</SectionLabel>
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {modes.map((m) => {
                                    const active = mode === m.key
                                    return (
                                        <button
                                            key={m.key}
                                            onClick={() => setMode(m.key)}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer"
                                            style={{
                                                background: active ? "var(--forest)" : "white",
                                                borderColor: active ? "var(--gold)" : "rgba(0,0,0,0.1)",
                                                color: active ? "white" : "var(--muted)"
                                            }}
                                        >
                                            <m.icon />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mb-5">
                                <SectionLabel htmlFor="appt-date">Preferred Date</SectionLabel>
                                <input id="appt-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                            </div>

                            <div className="mb-6">
                                <SectionLabel>Available Slots</SectionLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {slotsToShow.map((s) => {
                                        const isBooked = bookedSlots.includes(s)
                                        const isSelected = slot === s

                                        return (
                                            <button
                                                key={s}
                                                disabled={isBooked}
                                                onClick={() => !isBooked && setSlot(s)}
                                                style={{
                                                    padding: '9px 6px',
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    fontFamily: "var(--font-dm-sans)",
                                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                                    border: `1.5px solid ${isBooked ? 'rgba(196,113,90,0.4)' :
                                                        isSelected ? '#c9a84c' :
                                                            'rgba(0,0,0,0.1)'
                                                        }`,
                                                    background:
                                                        isBooked ? '#fde8e4' :
                                                            isSelected ? '#fdf8ee' :
                                                                'white',
                                                    color:
                                                        isBooked ? '#c4715a' :
                                                            isSelected ? '#1a3a2a' :
                                                                '#2c2c2c',
                                                    opacity: isBooked ? 0.7 : 1,
                                                    position: 'relative',
                                                }}
                                            >
                                                {s}
                                                {isBooked && (
                                                    <span style={{
                                                        display: 'block',
                                                        fontSize: 9,
                                                        color: '#c4715a',
                                                        fontWeight: 700,
                                                        marginTop: 1
                                                    }}>
                                                        Booked
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                                {ALL_SLOTS.length > 10 && !showAllSlots && (
                                    <button
                                        onClick={() => setShowAllSlots(true)}
                                        className="mt-3 text-[11px] font-bold text-sage underline cursor-pointer bg-transparent border-none"
                                    >
                                        Show all slots
                                    </button>
                                )}
                            </div>

                            <SectionDivider label="Your Information" />

                            <div className="space-y-4">
                                <div>
                                    <SectionLabel htmlFor="name">Full Name</SectionLabel>
                                    <input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" style={inputStyle} />
                                </div>
                                <div>
                                    <SectionLabel htmlFor="phone">Phone Number</SectionLabel>
                                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" style={inputStyle} />
                                </div>
                                <div>
                                    <SectionLabel htmlFor="reason" optional>Reason for visit</SectionLabel>
                                    <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us how we can help..." style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                                </div>
                            </div>

                            <button
                                onClick={handleBook}
                                disabled={loading}
                                className="w-full mt-8 py-4 rounded-xl border-none font-bold text-forest transition-all cursor-pointer"
                                style={{
                                    background: 'var(--gold)',
                                    color: 'var(--forest)',
                                    boxShadow: '0 10px 25px rgba(201,168,76,0.3)',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Processing...' : 'Confirm Appointment →'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-modal-in { animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            `}</style>
        </div>
    )
}
