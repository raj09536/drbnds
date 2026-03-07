"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface DoctorUnavailability {
    doctor_id: number
    blocked_dates: string[]
    blocked_slots: Record<string, string[]>
    reason: string
    updated_at: string
}

const allTimeSlots = [
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM",
    "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
    "08:00 PM", "08:15 PM", "08:30 PM",
]

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const ChevLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)
const ChevRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

/* ─── Helpers ────────────────────────────────────────────────────────── */
const toDateStr = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

const todayStr = toDateStr(new Date())

const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

/* ─── Component ──────────────────────────────────────────────────────── */
interface Props {
    doctorId: number
    unavailability: DoctorUnavailability
    onSave: (data: DoctorUnavailability) => void
    onClose: () => void
}

export function ScheduleModal({ doctorId, unavailability, onSave, onClose }: Props) {
    const [doctor, setDoctor] = useState<{ id: number; name: string; photo: string; clinic_name: string } | null>(null)

    useEffect(() => {
        supabase
            .from("doctors")
            .select("id, name, photo, clinic_name")
            .eq("id", doctorId)
            .maybeSingle()
            .then(({ data }) => { if (data) setDoctor(data) })
    }, [doctorId])
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string>(todayStr)
    const [blockedDates, setBlockedDates] = useState<string[]>(unavailability.blocked_dates)
    const [blockedSlots, setBlockedSlots] = useState<Record<string, string[]>>(unavailability.blocked_slots)
    const [reason, setReason] = useState(unavailability.reason)

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    // ESC to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
    }, [onClose])
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const { firstDay, daysInMonth } = getMonthDays(year, month)

    const toggleDate = (dateStr: string) => {
        setBlockedDates((prev) =>
            prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
        )
    }

    const toggleSlot = (dateStr: string, slot: string) => {
        setBlockedSlots((prev) => {
            const existing = prev[dateStr] || []
            return {
                ...prev,
                [dateStr]: existing.includes(slot) ? existing.filter((s) => s !== slot) : [...existing, slot],
            }
        })
    }

    const handleSave = () => {
        onSave({ doctor_id: doctorId, blocked_dates: blockedDates, blocked_slots: blockedSlots, reason, updated_at: new Date().toISOString() })
    }

    const isPast = (dateStr: string) => dateStr < todayStr
    const isDateBlocked = (dateStr: string) => blockedDates.includes(dateStr)
    const selectedDateBlocked = isDateBlocked(selectedDate)
    const slotsForDate = blockedSlots[selectedDate] || []

    if (!doctor) return null

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 9999, background: "rgba(26,58,42,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative"
                style={{
                    width: "480px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
                    background: "white", borderRadius: "20px",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── HEADER ── */}
                <div
                    className="relative"
                    style={{
                        background: "var(--forest)",
                        borderRadius: "20px 20px 0 0",
                        padding: "20px 24px",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-full overflow-hidden" style={{ width: "40px", height: "40px" }}>
                            <Image src={doctor.photo} alt={doctor.name} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h3 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "22px", fontWeight: 600, color: "white" }}>
                                {doctor.name}
                            </h3>
                            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
                                {doctor.clinic_name} · Schedule Manager
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute flex items-center justify-center cursor-pointer"
                        style={{
                            top: "16px", right: "16px", width: "32px", height: "32px",
                            borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                            border: "none", color: "white", fontSize: "18px",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* ── BODY ── */}
                <div style={{ padding: "20px 24px" }}>
                    {/* Section 1: BLOCK ENTIRE DATES */}
                    <div style={{ marginBottom: "28px" }}>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
                            Block Entire Date(s)
                        </p>

                        {/* Month nav */}
                        <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                            <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="cursor-pointer flex items-center justify-center" style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)", background: "white", color: "var(--forest)" }}>
                                <ChevLeft />
                            </button>
                            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 600, color: "var(--forest)" }}>
                                {MONTHS[month]} {year}
                            </span>
                            <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="cursor-pointer flex items-center justify-center" style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)", background: "white", color: "var(--forest)" }}>
                                <ChevRight />
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                <div key={i} className="text-center" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 600, color: "var(--muted)", padding: "4px 0" }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells before first day */}
                            {Array.from({ length: firstDay }, (_, i) => (
                                <div key={`e-${i}`} style={{ width: "100%", aspectRatio: "1" }} />
                            ))}
                            {/* Day cells */}
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const day = i + 1
                                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                                const past = isPast(dateStr)
                                const blocked = isDateBlocked(dateStr)
                                const isToday = dateStr === todayStr
                                const isSelected = dateStr === selectedDate

                                return (
                                    <button
                                        key={dateStr}
                                        disabled={past}
                                        onClick={() => {
                                            if (!past) {
                                                setSelectedDate(dateStr)
                                                if (isSelected) toggleDate(dateStr) // double click = toggle block
                                            }
                                        }}
                                        onDoubleClick={() => { if (!past) toggleDate(dateStr) }}
                                        className="relative flex items-center justify-center cursor-pointer transition-all duration-150"
                                        style={{
                                            width: "100%",
                                            aspectRatio: "1",
                                            borderRadius: "8px",
                                            fontFamily: "var(--font-dm-sans)",
                                            fontSize: "12px",
                                            fontWeight: isToday ? 700 : 500,
                                            border: blocked
                                                ? "1.5px solid rgba(196,113,90,0.3)"
                                                : isSelected
                                                    ? "1.5px solid var(--sage)"
                                                    : "1.5px solid transparent",
                                            background: blocked
                                                ? "#fde8e4"
                                                : isToday
                                                    ? "rgba(26,58,42,0.08)"
                                                    : isSelected
                                                        ? "rgba(61,107,82,0.06)"
                                                        : "transparent",
                                            color: past ? "rgba(0,0,0,0.2)" : blocked ? "var(--rose)" : isToday ? "var(--forest)" : "var(--charcoal)",
                                            cursor: past ? "not-allowed" : "pointer",
                                            opacity: past ? 0.3 : 1,
                                        }}
                                    >
                                        {day}
                                        {blocked && (
                                            <span className="absolute" style={{ top: "2px", right: "3px", fontSize: "8px", color: "var(--rose)", lineHeight: 1 }}>×</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3">
                            {[
                                { label: "Today", bg: "rgba(26,58,42,0.08)", border: "transparent" },
                                { label: "Blocked", bg: "#fde8e4", border: "rgba(196,113,90,0.3)" },
                                { label: "Available", bg: "white", border: "rgba(0,0,0,0.1)" },
                            ].map((l) => (
                                <div key={l.label} className="flex items-center gap-1.5">
                                    <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: l.bg, border: `1px solid ${l.border}`, display: "block" }} />
                                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "var(--muted)" }}>{l.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quick actions for selected date */}
                        <div className="flex items-center gap-2 mt-3" style={{ padding: "8px 12px", background: "var(--cream)", borderRadius: "8px", border: "1px solid var(--gold-light)" }}>
                            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--forest)", fontWeight: 600 }}>
                                Selected: {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <button
                                onClick={() => toggleDate(selectedDate)}
                                className="ml-auto cursor-pointer"
                                style={{
                                    fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 600,
                                    padding: "4px 10px", borderRadius: "6px", border: "none",
                                    background: isDateBlocked(selectedDate) ? "var(--sage)" : "var(--rose)",
                                    color: "white",
                                }}
                            >
                                {isDateBlocked(selectedDate) ? "Unblock Date" : "Block Full Day"}
                            </button>
                        </div>
                    </div>

                    {/* Section 2: BLOCK SPECIFIC SLOTS */}
                    <div style={{ marginBottom: "24px" }}>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>
                            Block Specific Time Slots
                        </p>

                        {selectedDateBlocked ? (
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    padding: "20px", borderRadius: "10px",
                                    background: "#fde8e4", border: "1px solid rgba(196,113,90,0.2)",
                                }}
                            >
                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--rose)", fontWeight: 500 }}>
                                    ⚠ Full day is blocked — unblock the date to manage individual slots
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2">
                                {allTimeSlots.map((slot) => {
                                    const isBlocked = slotsForDate.includes(slot)
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => toggleSlot(selectedDate, slot)}
                                            className="cursor-pointer transition-all duration-150 text-center"
                                            style={{
                                                padding: "8px 4px",
                                                borderRadius: "8px",
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "11px",
                                                fontWeight: 500,
                                                border: isBlocked ? "1.5px solid rgba(196,113,90,0.3)" : "1.5px solid rgba(0,0,0,0.1)",
                                                background: isBlocked ? "#fde8e4" : "white",
                                                color: isBlocked ? "var(--rose)" : "var(--charcoal)",
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Section 3: REASON */}
                    <div>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
                            Reason (Optional)
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Conference, personal leave, public holiday..."
                            rows={3}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--sage)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,107,82,0.1)" }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.boxShadow = "none" }}
                            style={{
                                width: "100%",
                                border: "1.5px solid rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                color: "var(--charcoal)",
                                resize: "none",
                                outline: "none",
                                transition: "border 0.2s, box-shadow 0.2s",
                            }}
                        />
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div
                    className="flex items-center justify-end gap-3"
                    style={{
                        borderTop: "1px solid rgba(0,0,0,0.07)",
                        padding: "16px 24px",
                    }}
                >
                    <button
                        onClick={onClose}
                        className="cursor-pointer transition-colors duration-200"
                        style={{
                            padding: "10px 20px", borderRadius: "8px",
                            border: "1px solid rgba(0,0,0,0.1)", background: "white",
                            fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 600,
                            color: "var(--muted)",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="cursor-pointer transition-all duration-200 hover:opacity-90"
                        style={{
                            padding: "10px 20px", borderRadius: "8px",
                            border: "none", background: "var(--forest)",
                            fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 700,
                            color: "white",
                        }}
                    >
                        Save Schedule ✓
                    </button>
                </div>
            </div>
        </div>
    )
}
