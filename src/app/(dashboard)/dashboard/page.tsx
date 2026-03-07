"use client"

import { Fragment, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { ScheduleModal } from "@/components/dashboard/ScheduleModal"
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
    created_at: string
}
interface Message {
    id: string
    name: string
    email: string
    phone: string
    clinic: string
    message: string
    clinic_id: number
    is_read: boolean
    created_at: string
}
interface DoctorUnavailability {
    doctor_id: number
    blocked_dates: string[]
    blocked_slots: Record<string, string[]>
    reason: string
    updated_at: string
}

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const CalIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const ConfirmIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)
const PendingIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const MsgIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

/* ─── Helpers ────────────────────────────────────────────────────────── */
const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hr ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
}

const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
        confirmed: { bg: "#e6f4ec", color: "#1a5e34" },
        pending: { bg: "#fef3e2", color: "#b45309" },
        cancelled: { bg: "#fde8e4", color: "#c4715a" },
        completed: { bg: "#1a3a2a", color: "white" },
        rescheduled: { bg: "#f3f0ff", color: "#7c3aed" },
    }
    const s = styles[status] || styles.pending
    return (
        <span
            className="rounded-full capitalize whitespace-nowrap"
            style={{
                background: s.bg,
                color: s.color,
                padding: "4px 10px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                fontWeight: 600,
                border: status === 'completed' ? 'none' : `1px solid ${s.color}20`
            }}
        >
            {status}
        </span>
    )
}

export default function DashboardPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [unavailability, setUnavailability] = useState<DoctorUnavailability[]>([])
    const [scheduleModalDocId, setScheduleModalDocId] = useState<number | null>(null)
    const [loadingData, setLoadingData] = useState(true)

    /* ── Fetch Data ── */
    const fetchData = useCallback(async () => {
        if (!doctor) return
        setLoadingData(true)
        const todayStr = new Date().toISOString().split('T')[0]

        // Fetch Appointments (Today & Upcoming)
        const { data: appts } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctor.doctor_id || doctor.id)
            .gte('appointment_date', todayStr)
            .order('appointment_date', { ascending: true })
            .order('time_slot', { ascending: true })

        // Fetch Messages
        const { data: msgs } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('clinic_id', doctor.clinic_id)
            .order('created_at', { ascending: false })
            .limit(5)

        // Fetch Unavailability
        const { data: unavail } = await supabase
            .from('doctor_unavailability')
            .select('*')

        setAppointments(appts || [])
        setMessages(msgs || [])
        setUnavailability(unavail || [])
        setLoadingData(false)
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchData()
    }, [doctor, loading, router, fetchData])

    /* ── Realtime ── */
    useEffect(() => {
        if (!doctor) return
        const channel = supabase
            .channel(`dash-main-${doctor.doctor_id || doctor.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `doctor_id=eq.${doctor.doctor_id || doctor.id}` }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages', filter: `clinic_id=eq.${doctor.clinic_id}` }, () => fetchData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [doctor, fetchData])

    /* ── Action Functions ── */
    const handleStatusUpdate = async (id: string, status: string) => {
        if (status === 'cancelled') {
            if (!window.confirm('Cancel this appointment?')) return
        }

        const { error } = await supabase
            .from("appointments")
            .update({ status })
            .eq("id", id)

        if (!error) {
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
        }
    }

    /* ── UI Constants ── */
    const btnBase: React.CSSProperties = {
        padding: '5px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'var(--font-dm-sans)',
        cursor: 'pointer',
        border: '1.5px solid',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        transition: 'all 0.2s'
    }

    /* ── Stats ── */
    const todayTotal = appointments.length
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length
    const pendingCount = appointments.filter(a => a.status === 'pending').length
    const unreadMessages = messages.filter(m => !m.is_read).length

    const statCards = [
        { label: "Today's Appointments", value: todayTotal, icon: CalIcon, iconBg: "rgba(26,58,42,0.08)", iconColor: "var(--forest)", numColor: "var(--forest)" },
        { label: "Confirmed", value: confirmedCount, icon: ConfirmIcon, iconBg: "rgba(45,122,79,0.1)", iconColor: "#2d7a4f", numColor: "#2d7a4f" },
        { label: "Pending", value: pendingCount, icon: PendingIcon, iconBg: "rgba(201,168,76,0.1)", iconColor: "var(--gold)", numColor: "var(--gold)" },
        { label: "Unread Messages", value: unreadMessages, icon: MsgIcon, iconBg: "rgba(196,113,90,0.1)", iconColor: "var(--rose)", numColor: "var(--rose)" },
    ]

    if (loading) return (
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
            <div className="text-center">
                <div className="text-3xl mb-3">🌿</div>
                <div className="text-sm text-gray-400 font-medium">Loading Dashboard...</div>
            </div>
        </div>
    )

    if (!doctor) return null

    return (
        <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
            <Sidebar
                doctor={doctor}
                unavailability={unavailability}
                messages={messages}
                onOpenSchedule={(id) => setScheduleModalDocId(id)}
            />

            <div className="lg:ml-[240px]">
                <DashboardTopBar
                    title="Overview"
                    breadcrumb="Dashboard / Overview"
                    doctor={doctor}
                />

                <main className="p-6 lg:p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                        {statCards.map((card) => (
                            <div key={card.label} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                                <div className="flex items-center justify-center rounded-xl mb-4" style={{ width: "44px", height: "44px", background: card.iconBg, color: card.iconColor }}>
                                    <card.icon />
                                </div>
                                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "40px", fontWeight: 700, color: card.numColor, lineHeight: 1 }}>{card.value}</p>
                                <p className="text-[13px] text-gray-400 font-medium mt-1">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                        {/* Today's Appointments */}
                        <div className="xl:col-span-3 bg-white p-6 rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-forest" style={{ fontFamily: "var(--font-cormorant)" }}>Today&apos;s Appointments</h3>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{todayTotal} Total</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-black/5">
                                            {["Time", "Patient", "Actions"].map(h => (
                                                <th key={h} className="text-left py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {appointments.map((appt) => (
                                            <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-2 text-sm font-bold text-forest">{appt.time_slot}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{appt.patient_name}</p>
                                                            <p className="text-[11px] text-gray-400 font-medium">{appt.patient_phone}</p>
                                                        </div>
                                                        {['completed', 'cancelled', 'rescheduled'].includes(appt.status) && statusBadge(appt.status)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {appt.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                                                                    style={{ ...btnBase, background: '#e6f4ec', color: '#1a5e34', borderColor: '#22c55e' }}
                                                                >
                                                                    ✓ Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                                                                    style={{ ...btnBase, background: '#fde8e4', color: '#c4715a', borderColor: '#ef4444' }}
                                                                >
                                                                    ✕ Cancel
                                                                </button>
                                                            </>
                                                        )}

                                                        {appt.status === 'confirmed' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(appt.id, 'completed')}
                                                                    style={{ ...btnBase, background: '#1a3a2a', color: 'white', borderColor: '#1a3a2a' }}
                                                                >
                                                                    ✓ Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => router.push('/dashboard/appointments')}
                                                                    style={{ ...btnBase, background: '#f3f0ff', color: '#7c3aed', borderColor: '#8b5cf6' }}
                                                                >
                                                                    ↺ Reschedule
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                                                                    style={{ ...btnBase, background: '#fde8e4', color: '#c4715a', borderColor: '#ef4444' }}
                                                                >
                                                                    ✕ Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {appointments.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-sm font-bold text-gray-300">No appointments for today.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Messages */}
                        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                            <h3 className="text-xl font-bold text-forest mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>Recent Messages</h3>
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-cream shrink-0 flex items-center justify-center text-forest font-bold text-sm shadow-sm">
                                            {(msg.name || "P")[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-[13px] font-bold text-gray-900 truncate">{msg.name}</p>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">{timeAgo(msg.created_at)}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-400 truncate font-medium">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-sm font-bold text-gray-300">No recent messages.</p>
                                    </div>
                                )}
                            </div>
                            {messages.length > 0 && (
                                <button
                                    onClick={() => router.push('/dashboard/messages')}
                                    className="w-full mt-6 py-3 border border-black/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    View All Messages
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {scheduleModalDocId !== null && (
                <ScheduleModal
                    doctorId={scheduleModalDocId}
                    unavailability={unavailability.find((u) => u.doctor_id === scheduleModalDocId) || { doctor_id: scheduleModalDocId, blocked_dates: [], blocked_slots: {}, reason: "", updated_at: "" }}
                    onSave={() => fetchData()}
                    onClose={() => setScheduleModalDocId(null)}
                />
            )}
        </div>
    )
}
