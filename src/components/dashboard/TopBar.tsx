"use client"

import Image from "next/image"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Doctor {
    doctor_id?: number
    id?: number
    doctor_name?: string
    name?: string
    photo_url?: string
    photo?: string
    clinic_name?: string
}

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
}

function getLastName(name: string) {
    if (!name) return 'Doctor'
    const parts = name.replace("Dr. ", "").split(" ")
    return parts[parts.length - 1]
}

import { useDoctor } from "@/hooks/useDoctor"

export function DashboardTopBar({ title, breadcrumb, doctor: propDoctor, doctorName: propDoctorName }: { title: string; breadcrumb: string; doctor?: Doctor | null; doctorName?: string }) {
    const { doctor: hookDoctor } = useDoctor()
    const doctor = propDoctor || hookDoctor

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    const nameToUse = propDoctorName || doctor?.doctor_name || doctor?.name || ""
    const greeting = nameToUse
        ? `${getGreeting()}, Dr. ${getLastName(nameToUse)} 👋`
        : `${getGreeting()} 👋`
    const clinicShort = doctor?.clinic_name?.split("—")[0]?.trim() || "Dashboard"
    const photoToUse = doctor?.photo_url || doctor?.photo || "/doctor.jpeg"

    return (
        <div
            className="sticky top-0 flex items-center justify-between"
            style={{
                height: "64px",
                background: "var(--warm-white)",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                padding: "0 32px",
                zIndex: 40,
            }}
        >
            {/* Left */}
            <div>
                <h1
                    style={{
                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "var(--forest)",
                        lineHeight: 1,
                    }}
                >
                    {title === "Overview" ? greeting : title}
                </h1>
                <p
                    style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "12px",
                        color: "var(--muted)",
                        marginTop: "2px",
                    }}
                >
                    {title === "Overview" ? clinicShort : breadcrumb}
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <span
                    className="hidden sm:block"
                    style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "13px",
                        color: "var(--muted)",
                    }}
                >
                    {today}
                </span>

                {/* Bell */}
                <button
                    className="relative cursor-pointer"
                    style={{ background: "none", border: "none", color: "var(--muted)" }}
                >
                    <BellIcon />
                    <span
                        className="absolute rounded-full"
                        style={{ width: "7px", height: "7px", background: "var(--rose)", top: "0", right: "0" }}
                    />
                </button>

                {/* Avatar — doctor photo */}
                {nameToUse ? (
                    <div className="shrink-0 rounded-full overflow-hidden" style={{ width: "34px", height: "34px", border: "2px solid var(--forest)" }}>
                        <Image src={photoToUse} alt={nameToUse} width={34} height={34} className="object-cover w-full h-full" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: "34px", height: "34px", background: "var(--forest)", color: "white", fontFamily: "var(--font-dm-sans)", fontSize: "12px", fontWeight: 600 }}>
                        DR
                    </div>
                )}
            </div>
        </div>
    )
}
