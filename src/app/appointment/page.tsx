"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, Phone, Video, Building2 } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { supabase } from "@/lib/supabase"

type ClinicId = "dehradun" | "bijnor"
type ConsultationType = "in-clinic" | "phone" | "video"
type Session = "morning" | "evening" | "afternoon"

const DEHRADUN_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const BIJNOR_DAYS = ["Tuesday", "Wednesday"]

const CLINICS = [
    {
        id: "dehradun" as ClinicId,
        name: "Dehradun Clinic",
        address: "Rajpur Road, Dehradun, Uttarakhand",
        phone: "+91-8191919949",
        doctors: [
            { id: "bnd", name: "Dr. B. N. Dwivedy", photo: "/doctor.jpeg", spec: "Classical Homoeopathy" },
            { id: "hb", name: "Dr. Himanshu Bhandari", photo: "/second_doctor.jpeg", spec: "Psychotherapy & Homoeopathy" },
        ],
    },
    {
        id: "bijnor" as ClinicId,
        name: "Bijnor Clinic",
        address: "Dhampur Road, Bijnor, Uttar Pradesh",
        phone: "+91-9997954989",
        doctors: [
            { id: "bnd", name: "Dr. B. N. Dwivedy", photo: "/doctor.jpeg", spec: "Classical Homoeopathy" },
        ],
    },
]

const STEPS = ["Clinic", "Doctor", "Details", "Consultation", "Schedule"]

export default function AppointmentPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedClinic, setSelectedClinic] = useState<ClinicId | null>(null)
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [form, setForm] = useState({ name: "", phone: "", email: "", healthConcern: "" })
    const [consultationType, setConsultationType] = useState<ConsultationType | null>(null)
    const [preferredDay, setPreferredDay] = useState("")
    const [preferredSession, setPreferredSession] = useState<Session | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const clinic = CLINICS.find(c => c.id === selectedClinic)

    const goNext = () => setStep(s => s + 1)
    const goBack = () => setStep(s => s - 1)

    const handleClinicSelect = (id: ClinicId) => {
        setSelectedClinic(id)
        if (id === "bijnor") {
            setSelectedDoctor("Dr. B. N. Dwivedy")
            setStep(3)
        } else {
            setSelectedDoctor("")
            setStep(2)
        }
    }

    const handleConfirm = async () => {
        setSubmitting(true)
        try {
            await supabase.from("public_appointments").insert({
                patient_name: form.name,
                patient_phone: form.phone,
                patient_email: form.email,
                health_concern: form.healthConcern,
                clinic: selectedClinic,
                doctor_name: selectedDoctor,
                consultation_type: consultationType,
                preferred_day: preferredDay,
                preferred_session: preferredSession,
                status: "pending",
            })
        } catch {
            // proceed even if DB fails
        }

        const msg = `Hello Dr. BND's Clinic! 🌿\n\nNew Appointment Request:\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📧 Email: ${form.email}\n\n🏥 Clinic: ${clinic?.name}\n👨‍⚕️ Doctor: ${selectedDoctor}\n💬 Consultation: ${consultationType}\n📅 Preferred Day: ${preferredDay} (${sessionLabel(preferredSession)})\n\n🩺 Health Concern:\n${form.healthConcern}\n\nPlease confirm my appointment. Thank you!`

        window.open(`https://wa.me/918191919949?text=${encodeURIComponent(msg)}`, "_blank")
        router.push("/appointment/success")
    }

    const isBijnor = selectedClinic === "bijnor"
    const isSunday = preferredDay === "Sunday"
    const availableDays = isBijnor ? BIJNOR_DAYS : DEHRADUN_DAYS
    const canConfirm = preferredDay && preferredSession && !submitting

    const sessionLabel = (s: Session | null) => {
        if (!s) return ""
        if (s === "morning") return "10 AM – 1:30 PM"
        if (s === "evening") return "5 PM – 8 PM"
        return "3 PM – 7 PM"
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-3">
                        {STEPS.map((label, i) => {
                            const n = i + 1
                            const active = n === step
                            const done = n < step
                            return (
                                <div key={label} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] transition-all duration-300"
                                        style={{
                                            background: done ? "var(--forest, #1a3a2a)" : active ? "var(--gold, #c9a84c)" : "#e5e7eb",
                                            color: done || active ? "white" : "#9ca3af",
                                        }}
                                    >
                                        {done ? <CheckCircle size={16} /> : n}
                                    </div>
                                    <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest" style={{ color: active ? "var(--forest)" : "#9ca3af" }}>
                                        {label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="relative h-1.5 bg-gray-100 rounded-full">
                        <div
                            className="absolute left-0 top-0 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((step - 1) / 4) * 100}%`, background: "var(--forest, #1a3a2a)" }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-[#1a3a2a10] p-6 md:p-10 shadow-[0_4px_40px_rgba(26,58,42,0.06)]">

                    {/* STEP 1 — Choose Clinic */}
                    {step === 1 && (
                        <div>
                            <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Choose a Clinic</h2>
                            <p className="text-[#1a3a2a70] text-[14px] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Select the clinic you'd like to visit</p>
                            <div className="flex flex-col gap-4">
                                {CLINICS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleClinicSelect(c.id)}
                                        className="text-left p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md"
                                        style={{
                                            borderColor: selectedClinic === c.id ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                            background: selectedClinic === c.id ? "rgba(26,58,42,0.04)" : "white",
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(26,58,42,0.08)" }}>
                                                <MapPin size={18} className="text-[#1a3a2a]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1a3a2a] text-[16px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{c.name}</p>
                                                <p className="text-[#1a3a2a70] text-[13px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{c.address}</p>
                                                <p className="text-[#1a3a2a70] text-[13px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>{c.phone}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2 — Choose Doctor */}
                    {step === 2 && (
                        <div>
                            <button onClick={goBack} className="flex items-center gap-2 text-[#1a3a2a60] hover:text-[#1a3a2a] mb-6 text-[13px] font-semibold cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <ArrowLeft size={15} /> Back
                            </button>
                            <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Choose a Doctor</h2>
                            <p className="text-[#1a3a2a70] text-[14px] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Select the doctor you'd like to consult</p>
                            <div className="flex flex-col gap-4">
                                {clinic?.doctors.map(d => (
                                    <button
                                        key={d.id}
                                        onClick={() => { setSelectedDoctor(d.name); goNext() }}
                                        className="text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md flex items-center gap-5"
                                        style={{
                                            borderColor: selectedDoctor === d.name ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                            background: selectedDoctor === d.name ? "rgba(26,58,42,0.04)" : "white",
                                        }}
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#f5f0e8]">
                                            <img src={d.photo} alt={d.name} className="w-full h-full object-cover object-top" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1a3a2a] text-[16px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{d.name}</p>
                                            <p className="text-[#1a3a2a70] text-[13px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{d.spec}</p>
                                        </div>
                                        <ArrowRight size={16} className="ml-auto text-[#1a3a2a40]" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3 — Your Details */}
                    {step === 3 && (
                        <div>
                            <button onClick={() => setStep(selectedClinic === "bijnor" ? 1 : 2)} className="flex items-center gap-2 text-[#1a3a2a60] hover:text-[#1a3a2a] mb-6 text-[13px] font-semibold cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <ArrowLeft size={15} /> Back
                            </button>
                            <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Your Details</h2>
                            <p className="text-[#1a3a2a70] text-[14px] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Tell us a bit about yourself</p>
                            <div className="flex flex-col gap-5">
                                {[
                                    { key: "name", label: "Full Name", type: "text", placeholder: "e.g. Rahul Sharma" },
                                    { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91-XXXXXXXXXX" },
                                    { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a70] mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>{f.label}</label>
                                        <input
                                            type={f.type}
                                            value={form[f.key as keyof typeof form]}
                                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder={f.placeholder}
                                            className="w-full px-4 py-3 rounded-xl border border-[#1a3a2a15] text-[14px] text-[#1a3a2a] focus:outline-none focus:border-[#1a3a2a40] transition-colors"
                                            style={{ fontFamily: "var(--font-dm-sans)", background: "#fafaf7" }}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a70] mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        Health Concern <span className="normal-case tracking-normal font-normal">({form.healthConcern.length}/300)</span>
                                    </label>
                                    <textarea
                                        value={form.healthConcern}
                                        onChange={e => setForm(p => ({ ...p, healthConcern: e.target.value.slice(0, 300) }))}
                                        placeholder="Briefly describe your symptoms or health concern..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-[#1a3a2a15] text-[14px] text-[#1a3a2a] focus:outline-none focus:border-[#1a3a2a40] transition-colors resize-none"
                                        style={{ fontFamily: "var(--font-dm-sans)", background: "#fafaf7" }}
                                    />
                                </div>
                                <button
                                    onClick={goNext}
                                    disabled={!form.name || !form.phone || !form.email || !form.healthConcern}
                                    className="w-full py-3.5 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    style={{ background: "var(--forest, #1a3a2a)", color: "white", fontFamily: "var(--font-dm-sans)" }}
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 — Consultation Type */}
                    {step === 4 && (
                        <div>
                            <button onClick={goBack} className="flex items-center gap-2 text-[#1a3a2a60] hover:text-[#1a3a2a] mb-6 text-[13px] font-semibold cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <ArrowLeft size={15} /> Back
                            </button>
                            <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Consultation Type</h2>
                            <p className="text-[#1a3a2a70] text-[14px] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>How would you like to consult?</p>
                            <div className="flex flex-col gap-4">
                                {[
                                    { id: "in-clinic" as ConsultationType, icon: Building2, label: "In-Clinic Visit", desc: "Visit us at the clinic in person" },
                                    { id: "phone" as ConsultationType, icon: Phone, label: "Phone Call", desc: "Consult over a phone call" },
                                    { id: "video" as ConsultationType, icon: Video, label: "Video Call", desc: "Consult via video conference" },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setConsultationType(opt.id); goNext() }}
                                        className="text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md flex items-center gap-4"
                                        style={{
                                            borderColor: consultationType === opt.id ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                            background: consultationType === opt.id ? "rgba(26,58,42,0.04)" : "white",
                                        }}
                                    >
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(26,58,42,0.08)" }}>
                                            <opt.icon size={20} className="text-[#1a3a2a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[#1a3a2a] text-[15px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{opt.label}</p>
                                            <p className="text-[#1a3a2a60] text-[13px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>{opt.desc}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-[#1a3a2a40]" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 5 — Schedule */}
                    {step === 5 && (
                        <div>
                            <button onClick={goBack} className="flex items-center gap-2 text-[#1a3a2a60] hover:text-[#1a3a2a] mb-6 text-[13px] font-semibold cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <ArrowLeft size={15} /> Back
                            </button>
                            <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Preferred Schedule</h2>
                            <p className="text-[#1a3a2a70] text-[14px] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>Choose your preferred day and session</p>

                            <div className="mb-8">
                                <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a70] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Day</p>
                                {isBijnor && (
                                    <p className="text-[12px] text-[#b45309] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        ⚠️ Dr. Dwivedy visits Bijnor only on Tuesday & Wednesday (3 PM – 7 PM)
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {availableDays.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => {
                                                setPreferredDay(day)
                                                if (isBijnor) setPreferredSession("afternoon")
                                                else setPreferredSession(null)
                                            }}
                                            className="px-4 py-2.5 rounded-xl font-semibold text-[13px] transition-all cursor-pointer border"
                                            style={{
                                                background: preferredDay === day ? "var(--forest, #1a3a2a)" : "white",
                                                color: preferredDay === day ? "white" : "#1a3a2a",
                                                borderColor: preferredDay === day ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                                fontFamily: "var(--font-dm-sans)",
                                            }}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {preferredDay && !isBijnor && (
                                <div className="mb-8">
                                    <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a70] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Session</p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setPreferredSession("morning")}
                                            className="p-4 rounded-2xl border-2 text-left cursor-pointer transition-all"
                                            style={{
                                                borderColor: preferredSession === "morning" ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                                background: preferredSession === "morning" ? "rgba(26,58,42,0.04)" : "white",
                                            }}
                                        >
                                            <p className="font-bold text-[#1a3a2a] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>🌅 Morning</p>
                                            <p className="text-[#1a3a2a60] text-[13px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>10:00 AM – 1:30 PM</p>
                                        </button>
                                        {!isSunday && (
                                            <button
                                                onClick={() => setPreferredSession("evening")}
                                                className="p-4 rounded-2xl border-2 text-left cursor-pointer transition-all"
                                                style={{
                                                    borderColor: preferredSession === "evening" ? "var(--forest, #1a3a2a)" : "#e5e7eb",
                                                    background: preferredSession === "evening" ? "rgba(26,58,42,0.04)" : "white",
                                                }}
                                            >
                                                <p className="font-bold text-[#1a3a2a] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>🌆 Evening</p>
                                                <p className="text-[#1a3a2a60] text-[13px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>5:00 PM – 8:00 PM</p>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {preferredDay && isBijnor && (
                                <div className="mb-8 p-4 rounded-2xl border border-[#1a3a2a15]" style={{ background: "rgba(26,58,42,0.03)" }}>
                                    <p className="font-bold text-[#1a3a2a] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>🕒 Afternoon</p>
                                    <p className="text-[#1a3a2a60] text-[13px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>3:00 PM – 7:00 PM</p>
                                </div>
                            )}

                            {/* Summary */}
                            {canConfirm && (
                                <div className="mb-6 p-5 rounded-2xl" style={{ background: "rgba(26,58,42,0.04)", border: "1px solid rgba(26,58,42,0.1)" }}>
                                    <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a70] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Summary</p>
                                    <div className="flex flex-col gap-1.5 text-[13px]" style={{ fontFamily: "var(--font-dm-sans)", color: "#1a3a2a" }}>
                                        <p><span className="opacity-60">Patient:</span> {form.name}</p>
                                        <p><span className="opacity-60">Clinic:</span> {clinic?.name}</p>
                                        <p><span className="opacity-60">Doctor:</span> {selectedDoctor}</p>
                                        <p><span className="opacity-60">Type:</span> {consultationType}</p>
                                        <p><span className="opacity-60">Schedule:</span> {preferredDay}, {sessionLabel(preferredSession)}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={!canConfirm}
                                className="w-full py-4 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                style={{ background: "var(--forest, #1a3a2a)", color: "white", fontFamily: "var(--font-dm-sans)" }}
                            >
                                {submitting ? "Sending..." : "Confirm & Send via WhatsApp"}
                                {!submitting && <ArrowRight size={16} />}
                            </button>
                            <p className="text-center text-[12px] text-[#1a3a2a50] mt-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                This will open WhatsApp to send your appointment request
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
