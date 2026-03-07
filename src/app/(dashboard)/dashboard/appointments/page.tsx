"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Appointment {
    id: string
    patient_name: string
    patient_phone: string
    patient_email: string
    patient_location: string
    reason: string
    appointment_date: string
    time_slot: string
    mode: string
    status: string
    doctor_id: number
    clinic_id: number
    reschedule_date?: string
    reschedule_slot?: string
    cancel_reason?: string
    created_at: string
}

/* ─── Icons ──────────────────────────────────────────────────────────── */
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)

export default function AppointmentsPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [filter, setFilter] = useState("all")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [cancelId, setCancelId] = useState<string | null>(null)
    const [cancelReason, setCancelReason] = useState("")
    const [rescheduleData, setRescheduleData] = useState<{ id: string, date: string, slot: string } | null>(null)

    const fetchAppointments = useCallback(async () => {
        if (!doctor) return
        const { data } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctor.doctor_id || doctor.id)
            .order('appointment_date', { ascending: true })
            .order('time_slot', { ascending: true })
        setAppointments(data || [])
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchAppointments()

        // Realtime
        const channel = supabase
            .channel(`all-appts-${doctor?.doctor_id || doctor?.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `doctor_id=eq.${doctor?.doctor_id || doctor?.id}` },
                () => fetchAppointments())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [doctor, loading, router, fetchAppointments])

    /* ── Actions ── */
    const updateStatus = async (id: string, status: string, extra = {}) => {
        const { error } = await supabase
            .from("appointments")
            .update({ status, ...extra })
            .eq("id", id)
        if (!error) fetchAppointments()
        setCancelId(null)
        setRescheduleData(null)
    }

    /* ── Filtering ── */
    const todayStr = new Date().toISOString().split('T')[0]
    const filteredAppts = appointments.filter(a => {
        if (filter === "all") return true
        if (filter === "today") return a.appointment_date === todayStr
        if (filter === "upcoming") return a.appointment_date > todayStr
        return a.status === filter
    })

    const tabs = [
        { id: "all", label: "All" },
        { id: "today", label: "Today" },
        { id: "upcoming", label: "Upcoming" },
        { id: "pending", label: "Pending" },
        { id: "confirmed", label: "Confirmed" },
        { id: "completed", label: "Completed" },
        { id: "cancelled", label: "Cancelled" },
    ]

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: '#fef3e2', color: '#b45309', label: 'Pending' }
            case 'confirmed': return { bg: '#e6f4ec', color: '#1a5e34', label: 'Confirmed' }
            case 'completed': return { bg: '#1a3a2a', color: 'white', label: 'Completed' }
            case 'cancelled': return { bg: '#fde8e4', color: '#c4715a', label: 'Cancelled' }
            case 'rescheduled': return { bg: '#f3f0ff', color: '#7c3aed', label: 'Rescheduled' }
            default: return { bg: '#f3f4f6', color: '#6b7280', label: status }
        }
    }

    const toggleExpand = (id: string) => {
        const next = new Set(expandedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setExpandedIds(next)
    }

    if (loading) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">🌿 Loading...</div>
    if (!doctor) return null

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar title="Appointments" breadcrumb="Dashboard / Appointments" doctor={doctor} />

                <main className="p-6">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-white rounded-xl border border-black/5 shadow-sm overflow-x-auto no-scrollbar">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border-none"
                                style={{
                                    background: filter === t.id ? "var(--forest)" : "transparent",
                                    color: filter === t.id ? "white" : "#6b7280"
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-4">
                        {filteredAppts.map(appt => {
                            const status = getStatusStyle(appt.status)
                            const isExpanded = expandedIds.has(appt.id)
                            const date = new Date(appt.appointment_date)
                            const day = date.getDate()
                            const month = date.toLocaleString('default', { month: 'short' })

                            const modeData = {
                                color: appt.mode === 'in_person' ? 'var(--forest)' : appt.mode === 'video' ? '#7c3aed' : '#2563eb',
                                icon: appt.mode === 'in_person' ? '🏥' : appt.mode === 'video' ? '📹' : '📞',
                                label: appt.mode === 'in_person' ? 'In Person' : appt.mode === 'video' ? 'Video' : 'Audio'
                            }

                            return (
                                <div key={appt.id} className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center p-4 gap-4">
                                        {/* Left: Date/Time */}
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-forest text-white shrink-0">
                                                <span className="text-lg font-bold leading-none">{day}</span>
                                                <span className="text-[10px] uppercase font-bold tracking-wider">{month}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-forest">{appt.time_slot}</span>
                                                <span className="text-[11px] font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block" style={{ background: `${modeData.color}15`, color: modeData.color }}>
                                                    {modeData.icon} {modeData.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Middle: Info */}
                                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(appt.id)}>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="text-[14px] font-bold text-[#111827] truncate">{appt.patient_name}</h4>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight" style={{ background: status.bg, color: status.color }}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-[12px] text-[#6b7280] flex items-center gap-1.5">
                                                📱 {appt.patient_phone}
                                                {appt.reason && <span className="text-[#9ca3af] hidden sm:inline">|</span>}
                                                {appt.reason && <span className="italic text-[#9ca3af] truncate max-w-[200px]">{appt.reason}</span>}
                                            </p>

                                            {isExpanded && (
                                                <div className="mt-3 pt-3 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-bold mb-0.5">Email</p>
                                                        <p className="text-[12px] text-[#4b5563]">{appt.patient_email || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-bold mb-0.5">Location</p>
                                                        <p className="text-[12px] text-[#4b5563]">{appt.patient_location || 'Not provided'}</p>
                                                    </div>
                                                    {appt.status === 'rescheduled' && (
                                                        <div className="col-span-1 sm:col-span-2 mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                            <p className="text-[11px] font-bold text-purple-700">Rescheduled from original date to:</p>
                                                            <p className="text-[13px] font-bold text-purple-900 mt-0.5">🗓️ {appt.reschedule_date} &nbsp; ⏰ {appt.reschedule_slot}</p>
                                                        </div>
                                                    )}
                                                    {appt.status === 'cancelled' && appt.cancel_reason && (
                                                        <div className="col-span-1 sm:col-span-2 mt-2 p-3 bg-rose-50 rounded-lg border border-rose-100">
                                                            <p className="text-[11px] font-bold text-rose-700">Cancellation Reason:</p>
                                                            <p className="text-[12px] text-rose-900 italic mt-0.5">"{appt.cancel_reason}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {appt.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateStatus(appt.id, 'confirmed')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer"
                                                        style={{ background: '#e6f4ec', color: '#1a5e34', border: '1.5px solid #22c55e' }}
                                                    >
                                                        <CheckIcon /> Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setCancelId(appt.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer"
                                                        style={{ background: '#fde8e4', color: '#c4715a', border: '1.5px solid #ef4444' }}
                                                    >
                                                        <XIcon /> Cancel
                                                    </button>
                                                </div>
                                            )}

                                            {appt.status === 'confirmed' && (
                                                <>
                                                    <button onClick={() => updateStatus(appt.id, 'completed')} className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-xs font-bold hover:brightness-110 border-none cursor-pointer">
                                                        <CheckIcon /> Complete
                                                    </button>
                                                    <button onClick={() => setRescheduleData({ id: appt.id, date: appt.appointment_date, slot: appt.time_slot })} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#b45309] text-[#b45309] bg-white rounded-lg text-xs font-bold hover:bg-amber-50 cursor-pointer">
                                                        <ClockIcon /> Reschedule
                                                    </button>
                                                    <button onClick={() => setCancelId(appt.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ef4444] text-[#ef4444] bg-white rounded-lg text-xs font-bold hover:bg-rose-50 cursor-pointer">
                                                        <XIcon /> Cancel
                                                    </button>
                                                </>
                                            )}

                                            {appt.status === 'rescheduled' && (
                                                <>
                                                    <button onClick={() => updateStatus(appt.id, 'completed')} className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-xs font-bold hover:brightness-110 border-none cursor-pointer">
                                                        <CheckIcon /> Complete
                                                    </button>
                                                    <button onClick={() => setCancelId(appt.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ef4444] text-[#ef4444] bg-white rounded-lg text-xs font-bold hover:bg-rose-50 cursor-pointer">
                                                        <XIcon /> Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inline Flows */}
                                    {cancelId === appt.id && (
                                        <div className="p-4 bg-rose-50 border-t border-rose-100 flex flex-col gap-3">
                                            <label className="text-xs font-bold text-rose-900">Reason for cancellation (optional)</label>
                                            <input
                                                value={cancelReason}
                                                onChange={e => setCancelReason(e.target.value)}
                                                placeholder="Enter reason..."
                                                className="w-full p-2 text-sm rounded-lg border border-rose-200 outline-none focus:ring-2 focus:ring-rose-500"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => updateStatus(appt.id, 'cancelled', { cancel_reason: cancelReason })} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold border-none cursor-pointer">Confirm Cancel</button>
                                                <button onClick={() => setCancelId(null)} className="px-4 py-2 bg-white text-rose-900 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer">Go Back</button>
                                            </div>
                                        </div>
                                    )}

                                    {rescheduleData?.id === appt.id && (
                                        <div className="p-4 bg-amber-50 border-t border-amber-100 flex flex-col gap-4">
                                            <p className="text-xs font-bold text-amber-900">Select new Date & Time</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input
                                                    type="date"
                                                    value={rescheduleData.date}
                                                    onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                                    className="p-2 text-sm rounded-lg border border-amber-200 outline-none"
                                                />
                                                <select
                                                    value={rescheduleData.slot}
                                                    onChange={e => setRescheduleData({ ...rescheduleData, slot: e.target.value })}
                                                    className="p-2 text-sm rounded-lg border border-amber-200 outline-none"
                                                >
                                                    {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateStatus(appt.id, 'rescheduled', { reschedule_date: rescheduleData.date, reschedule_slot: rescheduleData.slot })} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold border-none cursor-pointer">Confirm Reschedule</button>
                                                <button onClick={() => setRescheduleData(null)} className="px-4 py-2 bg-white text-amber-900 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer">Go Back</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {filteredAppts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-5xl mb-4">🗓️</div>
                                <h3 className="text-lg font-bold text-[#111827] mb-1">No appointments found</h3>
                                <p className="text-sm text-[#6b7280]">Try changing your filter to see more.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
