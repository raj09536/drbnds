"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Video, User, MapPin, Calendar, Clock, ChevronRight, X, CheckCircle2, Loader2, Mail, MessageSquare } from "lucide-react"

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
    <div className="flex items-center gap-3 my-6 md:my-8 text-[10px] md:text-xs">
        <div className="flex-1 h-px bg-charcoal/5" />
        <span className="font-bold text-charcoal/30 uppercase tracking-[3px] md:tracking-[5px]">{label}</span>
        <div className="flex-1 h-px bg-charcoal/5" />
    </div>
)

const SectionLabel = ({ children, optional, htmlFor }: { children: React.ReactNode; optional?: boolean; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="block text-xs font-bold text-mint uppercase tracking-widest mb-2.5">
        {children} {optional && <span className="lowercase font-medium text-charcoal/30 tracking-normal">(optional)</span>}
    </label>
)

const inputClass = "w-full px-4 py-3 md:py-3.5 bg-cream/30 border-2 border-transparent rounded-xl md:rounded-2xl text-forest font-medium placeholder:text-charcoal/20 outline-none focus:border-gold/50 focus:bg-white transition-all text-sm md:text-base";

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
    }, [selectedDoctor, date, slot, mode, fullName, phone, reason, email])

    const slotsToShow = showAllSlots ? ALL_SLOTS : ALL_SLOTS.slice(0, 9)
    const modes = [
        { key: "physical", icon: User, label: "In-Person" },
        { key: "video", icon: Video, label: "Video" },
        { key: "audio", icon: Phone, label: "Audio" },
    ] as const;

    return (
        <div className="fixed inset-0 z-9999 flex items-end md:items-center justify-center bg-forest/80 backdrop-blur-md" onClick={onClose}>
            <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="w-full md:max-w-xl h-[92vh] md:h-auto md:max-h-[85vh] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-forest px-8 py-7 md:py-8 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-mint font-bold uppercase tracking-[4px] text-[10px] md:text-xs">Step {step} of 2</span>
                            <h3 className="text-white font-bold leading-tight mt-1" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "28px" }}>
                                {step === 1 ? "Choose Your Doctor" : "Clinical Registration"}
                            </h3>
                        </div>
                        {!booked && (
                            <button 
                                onClick={onClose} 
                                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X size={22} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 scroll-smooth">
                    {booked ? (
                        <div className="flex flex-col items-center text-center justify-center h-full py-10">
                            <div className="w-20 h-20 bg-mint/10 text-mint rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-forest mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>Clinical Success!</h3>
                            <p className="text-charcoal/50 font-medium leading-relaxed max-w-sm">
                                Your appointment is registered. Our coordinator will contact you shortly to confirm the clinical schedule.
                            </p>
                            <div className="mt-10 px-6 py-3 bg-cream rounded-full text-mint font-bold text-xs uppercase tracking-widest">
                                Auto-closing in {countdown}s
                            </div>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-6">
                            <p className="text-charcoal/40 font-bold uppercase tracking-widest text-[11px]">Select Clinical Specialist</p>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {DOCTORS.map((doc) => {
                                    const isSelected = selectedDoctor?.id === doc.id
                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className="group relative flex items-center text-left gap-5 p-5 rounded-3xl border-2 transition-all cursor-pointer"
                                            style={{
                                                background: isSelected ? "var(--cream)" : "white",
                                                borderColor: isSelected ? "var(--gold)" : "var(--cream)",
                                                boxShadow: isSelected ? "0 12px 24px -12px rgba(201,168,76,0.3)" : "none",
                                            }}
                                        >
                                            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                                                <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" />
                                                {isSelected && (
                                                    <div className="absolute -top-2 -right-2 bg-gold text-forest rounded-full p-1 border-4 border-white">
                                                        <CheckCircle2 size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-forest font-bold leading-tight" style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px" }}>{doc.name}</h4>
                                                <p className="text-mint font-bold text-[10px] uppercase tracking-widest mt-1">{doc.spec}</p>
                                                <div className="flex items-center gap-2 text-charcoal/40 font-medium mt-2 text-xs">
                                                    <MapPin size={12} className="text-gold" />
                                                    {doc.clinic}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => step === 1 && selectedDoctor && setStep(2)}
                                disabled={!selectedDoctor}
                                className="w-full mt-8 h-14 md:h-16 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 bg-forest text-white shadow-xl shadow-forest/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
                            >
                                Continue To Details
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Summary Card */}
                            <div className="flex items-center gap-4 bg-cream/40 p-4 rounded-[1.5rem] border border-gold-light/20">
                                <img src={selectedDoctor?.photo} alt={selectedDoctor?.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                                <div className="flex-1">
                                    <p className="text-forest font-bold text-sm leading-tight">{selectedDoctor?.name}</p>
                                    <p className="text-[10px] font-bold text-mint uppercase tracking-widest mt-0.5">{selectedDoctor?.clinic}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="text-[10px] font-bold text-gold hover:text-forest uppercase tracking-widest border-2 border-gold/20 px-3 py-1.5 rounded-full transition-all">Change</button>
                            </div>

                            <SectionDivider label="Logistics" />

                            <div className="space-y-6">
                                <div>
                                    <SectionLabel>Consultation Format</SectionLabel>
                                    <div className="grid grid-cols-3 gap-3">
                                        {modes.map((m) => {
                                            const active = mode === m.key
                                            return (
                                                <button
                                                    key={m.key}
                                                    onClick={() => setMode(m.key)}
                                                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer"
                                                    style={{
                                                        background: active ? "var(--forest)" : "var(--cream)/20",
                                                        borderColor: active ? "var(--gold)" : "transparent",
                                                        color: active ? "white" : "var(--forest)"
                                                    }}
                                                >
                                                    <m.icon size={20} strokeWidth={active ? 2.5 : 2} />
                                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{m.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <SectionLabel htmlFor="appt-date">Clinical Date</SectionLabel>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-mint/40 pointer-events-none" size={18} />
                                            <input id="appt-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} pl-12`} />
                                        </div>
                                    </div>
                                    <div>
                                        <SectionLabel>Select Time Slot</SectionLabel>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-mint/40 pointer-events-none" size={18} />
                                            <select 
                                                className={`${inputClass} appearance-none pl-12 pr-10`}
                                                value={slot || ""} 
                                                onChange={(e) => setSlot(e.target.value)}
                                            >
                                                <option value="" disabled>Choose Slot</option>
                                                {ALL_SLOTS.map(s => (
                                                    <option key={s} value={s} disabled={bookedSlots.includes(s)}>
                                                        {s} {bookedSlots.includes(s) ? "(Booked)" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mint/40">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop grid for slots - only visible on wide screens as alternative */}
                                <div className="hidden md:block">
                                   <SectionLabel>Quick Select Slots</SectionLabel>
                                   <div className="grid grid-cols-3 gap-2">
                                        {slotsToShow.map((s) => {
                                            const isSelected = slot === s;
                                            const isBooked = bookedSlots.includes(s);
                                            return (
                                                <button
                                                    key={s}
                                                    disabled={isBooked}
                                                    onClick={() => setSlot(s)}
                                                    className="py-2.5 px-2 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer"
                                                    style={{
                                                        background: isSelected ? "var(--gold)" : "white",
                                                        borderColor: isSelected ? "var(--gold)" : "var(--cream)",
                                                        color: isSelected ? "white" : isBooked ? "var(--charcoal/20)" : "var(--forest)",
                                                        opacity: isBooked ? 0.3 : 1
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            )
                                        })}
                                   </div>
                                   {!showAllSlots && (
                                       <button onClick={() => setShowAllSlots(true)} className="mt-3 text-[10px] font-bold text-mint uppercase tracking-widest hover:text-gold transition-colors block ml-auto">Load More Slots ↓</button>
                                   )}
                                </div>
                            </div>

                            <SectionDivider label="Patient Identity" />

                            <div className="space-y-4">
                                <div className="relative">
                                    <SectionLabel htmlFor="name">Full Identity Name</SectionLabel>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-mint/40" size={18} />
                                        <input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Rahul Sharma" className={`${inputClass} pl-12`} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <SectionLabel htmlFor="phone">Phone Number</SectionLabel>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-mint/40" size={18} />
                                            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 81919 19949" className={`${inputClass} pl-12 text-sm`} />
                                        </div>
                                    </div>
                                    <div>
                                        <SectionLabel htmlFor="email" optional>Email Address</SectionLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-mint/40" size={18} />
                                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" className={`${inputClass} pl-12 text-sm`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <SectionLabel htmlFor="reason" optional>Reason for consultation</SectionLabel>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-mint/40" size={18} />
                                        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe clinical symptoms..." className={`${inputClass} pl-12 min-h-[100px] resize-none pt-4`} />
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white pt-4 pb-2 md:relative md:p-0">
                                <button
                                    onClick={handleBook}
                                    disabled={loading}
                                    className="w-full h-14 md:h-16 rounded-2xl font-bold flex items-center justify-center gap-3 bg-gold text-forest shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {loading ? (
                                        <><Loader2 className="animate-spin" size={20} /> Registering...</>
                                    ) : (
                                        <>Finalize Appointment Registration <ChevronRight size={20} strokeWidth={3} /></>
                                    )}
                                </button>
                                {fieldErrors.general && <p className="text-red-500 text-[10px] font-bold text-center mt-3 uppercase tracking-widest">{fieldErrors.general}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
