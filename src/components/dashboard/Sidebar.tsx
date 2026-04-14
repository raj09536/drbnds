"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Message {
    id: string
    is_read: boolean
}
interface DoctorUnavailability {
    doctor_id: number
    blocked_dates: string[]
    blocked_slots: Record<string, string[]>
    reason: string
    updated_at: string
}

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const OverviewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
)
const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)
const MessagesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)
const TestimonialsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
)
const CaseFilesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
)
const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)
const MenuIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)
const XIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

/* ─── Helper: get today's status ─────────────────────────────────────── */
const todayStr = new Date().toISOString().split("T")[0]

function getDoctorStatus(unavail: DoctorUnavailability | undefined) {
    if (!unavail) return { label: "Available", color: "#22c55e" }
    if (unavail.blocked_dates.includes(todayStr)) return { label: "Off Today", color: "var(--rose)" }
    const todaySlots = unavail.blocked_slots[todayStr]
    if (todaySlots && todaySlots.length > 0) return { label: `Partial — ${todaySlots.length} slots`, color: "#b45309" }
    return { label: "Available", color: "#22c55e" }
}

/* ─── Sidebar ─────────────────────────────────────────────────────────── */
interface SidebarProps {
    doctor?: any
    unavailability?: DoctorUnavailability[]
    messages?: any[]
    onOpenSchedule?: (doctorId: number) => void
}

export function Sidebar({ unavailability = [], onOpenSchedule }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const { doctor } = useDoctor()

    const [counts, setCounts] = useState({ unreadMsgs: 0, pendingAppts: 0, pendingTestimonials: 0 })

    const fetchCounts = useCallback(async () => {
        if (!doctor) return

        // Pending Appointments
        const { count: apptCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctor.doctor_id || doctor.id)
            .eq('status', 'pending')

        // Unread Messages
        const { count: msgCount } = await supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('clinic_id', doctor.clinic_id)
            .eq('is_read', false)

        // Get all doctor IDs for this clinic
        const { data: clinicDoctors } = await supabase
            .from('doctors')
            .select('id')
            .eq('clinic_id', doctor.clinic_id)
        const doctorIds = (clinicDoctors || []).map((d: any) => d.id)
        const doctorIdFilter = doctorIds.length > 0 ? doctorIds : [-1]

        // Pending text feedback
        const { data: feedbackRaw } = await supabase
            .from('feedback')
            .select('id, is_rejected')
            .eq('clinic_id', doctor.clinic_id)
            .eq('is_approved', false)

        // Pending video/audio — by doctor_id
        const { data: mediaRaw } = await supabase
            .from('testimonials')
            .select('id, is_rejected')
            .in('doctor_id', doctorIdFilter)
            .eq('is_active', false)
            .in('type', ['video', 'audio'])

        const pendingText = (feedbackRaw || []).filter((f: any) => !f.is_rejected).length
        const pendingMedia = (mediaRaw || []).filter((t: any) => !t.is_rejected).length

        setCounts({
            unreadMsgs: msgCount || 0,
            pendingAppts: apptCount || 0,
            pendingTestimonials: pendingText + pendingMedia
        })
    }, [doctor])

    useEffect(() => {
        if (doctor) {
            fetchCounts()

            // Subscriptions for badges
            const msgSub = supabase.channel('msg-counts').on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => fetchCounts()).subscribe()
            const apptSub = supabase.channel('appt-counts').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchCounts()).subscribe()
            const feedSub = supabase.channel('feed-counts').on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => fetchCounts()).subscribe()

            return () => {
                supabase.removeChannel(msgSub)
                supabase.removeChannel(apptSub)
                supabase.removeChannel(feedSub)
            }
        }
    }, [doctor, fetchCounts])

    // Resolved values with fallbacks
    const docId = doctor?.doctor_id || doctor?.id
    const docName = doctor?.doctor_name || doctor?.name || 'Doctor'
    const docPhoto = doctor?.photo_url || doctor?.photo || '/doctor.jpeg'
    const docClinic = doctor?.clinic_name || 'Clinic'

    const handleLogout = () => {
        localStorage.removeItem('doctor_session')
        router.push("/")
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard"
        return pathname.startsWith(href)
    }

    const navItems = [
        { label: "Overview", href: "/dashboard", icon: OverviewIcon, badge: 0 },
        { label: "Appointments", href: "/dashboard/appointments", icon: CalendarIcon, badge: counts.pendingAppts },
        { label: "Messages", href: "/dashboard/messages", icon: MessagesIcon, badge: counts.unreadMsgs },
        { label: "Testimonials", href: "/dashboard/testimonials", icon: TestimonialsIcon, badge: counts.pendingTestimonials },
        { label: "Case Files", href: "/dashboard/case-files", icon: CaseFilesIcon, badge: 0 },
    ]

    const docUnavail = docId ? unavailability.find((u) => u.doctor_id === docId) : undefined
    const docStatus = getDoctorStatus(docUnavail)

    const sidebarContent = (
        <div className="flex flex-col h-full" style={{ background: "var(--forest)" }}>
            {/* Logo */}
            <div style={{ padding: "24px 20px" }}>
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                            width: "38px", height: "38px", borderRadius: "10px",
                            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                            fontSize: "18px",
                        }}
                    >
                        🌿
                    </div>
                    <div>
                        <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "16px", fontWeight: 600, color: "white" }}>
                            Dr. BND&apos;s
                        </p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "var(--mint)" }}>
                            Dashboard
                        </p>
                    </div>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "16px 0 0" }} />
            </div>

            {/* Nav */}
            <nav style={{ padding: "0 12px" }}>
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 transition-all duration-200"
                                style={{
                                    padding: "11px 14px",
                                    borderRadius: "10px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    background: active ? "rgba(255,255,255,0.12)" : "transparent",
                                    color: active ? "white" : "rgba(255,255,255,0.55)",
                                }}
                            >
                                <span style={{ color: active ? "var(--gold)" : "inherit" }}>
                                    <item.icon />
                                </span>
                                {item.label}
                                {item.badge > 0 && (
                                    <span
                                        className="ml-auto flex items-center justify-center rounded-full"
                                        style={{
                                            minWidth: "18px", height: "18px", padding: "0 5px",
                                            background: active ? "white" : "var(--gold)",
                                            color: active ? "var(--forest)" : "white",
                                            fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 800,
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* ── Schedule Manager Section ── */}
            <div
                style={{
                    margin: "16px 12px 0",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    overflow: "hidden",
                }}
            >
                <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--mint)", marginBottom: "2px", fontWeight: 600 }}>
                        Schedule Manager
                    </div>
                </div>

                <div
                    className="flex items-center gap-2.5 cursor-pointer transition-all duration-150 hover:bg-white/5"
                    style={{ padding: "10px 14px" }}
                    onClick={() => docId && onOpenSchedule?.(docId)}
                >
                    <div className="shrink-0 rounded-full overflow-hidden" style={{ width: "28px", height: "28px" }}>
                        <Image src={docPhoto} alt={docName} width={28} height={28} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", fontWeight: 600, color: "white" }}>
                            {docName.replace("Dr. ", "")}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="rounded-full" style={{ width: "5px", height: "5px", background: docStatus.color, display: "block" }} />
                            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: docStatus.color }}>
                                {docStatus.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom — Doctor Info */}
            <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="shrink-0 rounded-full overflow-hidden" style={{ width: "36px", height: "36px", border: "2px solid rgba(255,255,255,0.2)" }}>
                        <Image src={docPhoto} alt={docName} width={36} height={36} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "white", fontWeight: 500 }}>
                            {docName}
                        </p>
                        <p className="truncate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>
                            {docClinic.split("—")[0]?.trim()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:text-rose-400 group"
                    style={{
                        fontFamily: "var(--font-dm-sans)", fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                        background: "none", border: "none",
                    }}
                >
                    <LogoutIcon /> Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed left-0 top-0 h-full" style={{ width: "240px", zIndex: 50 }}>
                {sidebarContent}
            </aside>

            {/* Mobile Hamburger */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center cursor-pointer shadow-lg"
                style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--forest)", border: "none", color: "white" }}
            >
                {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <aside className="absolute left-0 top-0 h-full shadow-2xl" style={{ width: "260px" }} onClick={(e) => e.stopPropagation()}>
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    )
}
