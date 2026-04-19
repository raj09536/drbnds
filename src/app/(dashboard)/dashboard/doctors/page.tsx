"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDoctor } from "@/hooks/useDoctor"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"

interface PublicAppointment {
    id: string
    patient_name: string
    patient_phone: string
    patient_email: string
    health_concern: string
    clinic: string
    doctor_name: string
    consultation_type: string
    preferred_day: string
    preferred_session: string
    status: string
    created_at: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg: "#fef3e2", color: "#b45309", label: "Pending" },
    confirmed: { bg: "#e6f4ec", color: "#1a5e34", label: "Confirmed" },
    cancelled: { bg: "#fde8e4", color: "#c4715a", label: "Cancelled" },
}

const CONSULT_ICON: Record<string, string> = {
    "in-clinic": "🏥",
    phone: "📞",
    video: "📹",
}

export default function DoctorsPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [appointments, setAppointments] = useState<PublicAppointment[]>([])
    const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const fetchAppointments = useCallback(async () => {
        const { data } = await supabase
            .from("public_appointments")
            .select("*")
            .order("created_at", { ascending: false })
        setAppointments(data || [])
    }, [])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push("/login")
            return
        }
        if (doctor) fetchAppointments()
    }, [doctor, loading, router, fetchAppointments])

    const updateStatus = async (id: string, status: string) => {
        await supabase.from("public_appointments").update({ status }).eq("id", id)
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    }

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const filtered = filter === "all" ? appointments : appointments.filter(a => a.status === filter)

    const todayCount = appointments.filter(a => new Date(a.created_at).toDateString() === new Date().toDateString()).length
    const pendingCount = appointments.filter(a => a.status === "pending").length
    const confirmedCount = appointments.filter(a => a.status === "confirmed").length

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f0e8" }}>
            <div className="text-center">
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
                <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "#6b7280" }}>Loading...</div>
            </div>
        </div>
    )

    if (!doctor) return null

    return (
        <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar
                    title="Appointments"
                    breadcrumb="Dashboard / Appointments"
                    doctor={doctor}
                    doctorName={doctor.doctor_name || doctor.name}
                />
                <main className="p-6">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label: "Today", value: todayCount, color: "#1a3a2a" },
                            { label: "Pending", value: pendingCount, color: "#b45309" },
                            { label: "Confirmed", value: confirmedCount, color: "#1a5e34" },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl p-5 border border-black/5 shadow-sm text-center">
                                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[12px] text-[#6b7280] font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 p-1.5 bg-white rounded-xl border border-black/5 shadow-sm overflow-x-auto">
                        {(["all", "pending", "confirmed", "cancelled"] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border-none capitalize"
                                style={{
                                    background: filter === t ? "var(--forest, #1a3a2a)" : "transparent",
                                    color: filter === t ? "white" : "#6b7280",
                                }}
                            >
                                {t === "all" ? `All (${appointments.length})` : `${t.charAt(0).toUpperCase() + t.slice(1)} (${appointments.filter(a => a.status === t).length})`}
                            </button>
                        ))}
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-4">
                        {filtered.map(appt => {
                            const st = STATUS_STYLES[appt.status] || { bg: "#f3f4f6", color: "#6b7280", label: appt.status }
                            const isExpanded = expandedIds.has(appt.id)
                            const icon = CONSULT_ICON[appt.consultation_type] || "💬"

                            return (
                                <div key={appt.id} className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-[#111827] text-[15px]">{appt.patient_name}</h4>
                                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1a3a2a10] text-[#1a3a2a] font-semibold">
                                                        {icon} {appt.consultation_type}
                                                    </span>
                                                </div>
                                                <a href={`tel:${appt.patient_phone}`} className="text-[13px] text-[#2563eb] hover:underline font-medium">
                                                    📱 {appt.patient_phone}
                                                </a>
                                                <div className="flex flex-wrap gap-3 mt-2 text-[12px] text-[#6b7280]">
                                                    <span>🏥 {appt.clinic === "dehradun" ? "Dehradun Clinic" : "Bijnor Clinic"}</span>
                                                    <span>👨‍⚕️ {appt.doctor_name}</span>
                                                    <span>📅 {appt.preferred_day} · {appt.preferred_session === "morning" ? "10 AM–1:30 PM" : "5 PM–8 PM"}</span>
                                                </div>
                                            </div>

                                            <select
                                                value={appt.status}
                                                onChange={e => updateStatus(appt.id, e.target.value)}
                                                className="text-xs font-semibold rounded-lg px-3 py-2 border border-black/10 cursor-pointer focus:outline-none shrink-0"
                                                style={{ background: st.bg, color: st.color }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => toggleExpand(appt.id)}
                                            className="mt-3 text-[12px] text-[#1a3a2a] font-semibold underline cursor-pointer bg-transparent border-none"
                                        >
                                            {isExpanded ? "Hide" : "Show"} health concern
                                        </button>

                                        {isExpanded && (
                                            <div className="mt-3 p-4 rounded-xl text-[13px] text-[#374151] leading-relaxed" style={{ background: "rgba(26,58,42,0.04)", border: "1px solid rgba(26,58,42,0.1)" }}>
                                                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-2">Health Concern</p>
                                                {appt.health_concern}
                                            </div>
                                        )}

                                        <p className="mt-3 text-[11px] text-[#9ca3af]">
                                            Received: {new Date(appt.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}

                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-5xl mb-4">🗓️</div>
                                <h3 className="text-lg font-bold text-[#111827] mb-1">No appointments found</h3>
                                <p className="text-sm text-[#6b7280]">Appointments booked via the website will appear here.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
