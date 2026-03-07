"use client"
import { useDoctor } from "@/hooks/useDoctor"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"

export default function SettingsPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
        }
    }, [doctor, loading, router])

    if (loading) return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#f5f0e8'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
                <div style={{
                    fontFamily: 'var(--font-dm-sans)', fontSize: 13,
                    color: '#6b7280'
                }}>Loading...</div>
            </div>
        </div>
    )

    if (!doctor) return null

    return (
        <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
            <Sidebar />
            <div className="lg:ml-[240px]">
                <DashboardTopBar
                    title="Settings"
                    breadcrumb="Dashboard / Settings"
                    doctor={doctor}
                    doctorName={doctor.doctor_name || doctor.name}
                />
                <main style={{ padding: "24px 28px" }}>
                    <div style={{ background: "white", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                        <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "28px", fontWeight: 600, color: "var(--forest)" }}>
                            Settings
                        </p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)", marginTop: "8px" }}>
                            Clinic settings and configuration coming soon.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}
