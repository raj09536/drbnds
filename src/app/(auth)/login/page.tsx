"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const UserIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
)

const LockIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const MailIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
)

/* ─── Shared Styles ──────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans)", fontSize: "11px", fontWeight: 700,
    letterSpacing: "3px", textTransform: "uppercase", color: "var(--forest)",
    display: "block", marginBottom: "8px",
}

const inputBaseStyle: React.CSSProperties = {
    border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "10px",
    padding: "13px 16px 13px 44px", fontFamily: "var(--font-dm-sans)",
    fontSize: "14px", color: "var(--charcoal)", background: "white",
    width: "100%", outline: "none", transition: "border 0.2s, box-shadow 0.2s",
}

const btnPrimaryStyle: React.CSSProperties = {
    width: "100%", padding: "14px", borderRadius: "10px", border: "none",
    background: "var(--forest)", color: "white", fontFamily: "var(--font-dm-sans)",
    fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px",
    boxShadow: "0 8px 24px rgba(26,58,42,0.25)", transition: "all 0.2s", cursor: "pointer",
}

/* ─── Page Component ─────────────────────────────────────────────────── */
export default function LoginPage() {
    const router = useRouter()
    const [view, setView] = useState<"login" | "forgot" | "sent">("login")
    const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const doctors = [
        { id: 1, name: "Dr. B. N. Dwivedy", image: "/doctor.jpeg" as string | null, specialization: "MD (Homeopathy)" },
        { id: 2, name: "Dr. Himanshu Bhandari", image: "/second_doctor.jpeg" as string | null, specialization: "B.H.M.S (H.P.U)" },
        { id: 3, name: "Amit Kumar", image: "/amit-kumar.jpg" as string | null, specialization: "Pharmacist" },
    ]

    const handleLogin = async () => {
        if (!password) { setErrors({ password: 'Please enter your password' }); return }
        setLoading(true)
        setErrors({})

        // Pharmacist login via API route
        if (selectedDoctor === 3) {
            try {
                const res = await fetch('/api/pharmacist/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'amit', password }),
                })
                if (!res.ok) {
                    setErrors({ password: 'Invalid credentials. Please try again.' })
                    setLoading(false)
                    return
                }
                const data = await res.json()
                localStorage.setItem('pharmacist_session', JSON.stringify(data))
                router.push('/pharmacy/dashboard/overview')
            } catch {
                setErrors({ password: 'Something went wrong. Please try again.' })
                setLoading(false)
            }
            return
        }

        const { data, error } = await supabase
            .rpc('verify_doctor_login', {
                p_doctor_id: selectedDoctor,
                p_password: password,
            })

        if (error) {
            setErrors({ password: 'Something went wrong. Please try again.' })
            setLoading(false)
            return
        }

        // data is an ARRAY — first row
        const result = Array.isArray(data) ? data[0] : data

        if (!result || result.success === false || result.success === 'false') {
            setErrors({ password: 'Invalid password. Please try again.' })
            setLoading(false)
            return
        }

        // Save session
        localStorage.setItem('doctor_session', JSON.stringify({
            doctor_id: result.doctor_id,
            clinic_id: result.clinic_id,
            username: result.username,
            doctor_name: result.doctor_name,
            clinic_name: result.clinic_name,
            photo_url: result.photo_url,
        }))

        router.push('/dashboard')
    }

    const handleForgot = () => {
        if (!selectedDoctor) {
            setErrors({ password: "Please select a doctor first" })
            return
        }
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setView("sent")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* ═══════════ LEFT PANEL ═══════════ */}
            <div className="relative overflow-hidden flex flex-col justify-between" style={{ background: "var(--forest)", width: "45%", padding: "48px", minHeight: "100vh" }}>
                <div className="absolute pointer-events-none" style={{ width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,185,154,0.2), transparent 70%)", top: "-80px", right: "-80px" }} />
                <div className="absolute pointer-events-none" style={{ width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)", bottom: "-60px", left: "-60px" }} />

                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center" style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: "22px" }}>🌿</div>
                        <div>
                            <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "18px", fontWeight: 600, color: "white" }}>Dr. BND&apos;s Clinic</p>
                            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "var(--mint)" }}>Staff Portal</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center" style={{ maxWidth: "400px" }}>
                        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: "var(--mint)", marginBottom: "16px", fontWeight: 500 }}>Internal Management</span>
                        <h1 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "42px", fontWeight: 300, color: "white", lineHeight: 1.1 }}>
                            Welcome to the <br />
                            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Doctor&apos;s Workspace</em>
                        </h1>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "24px" }}>
                            Secure access to patient health records, appointment scheduling, and clinic diagnostics.
                        </p>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>© 2026 Dr. BND&apos;s Clinic • Clinical Excellence</p>
                    </div>
                </div>
            </div>

            {/* ═══════════ RIGHT PANEL ═══════════ */}
            <div className="flex-1 flex items-center justify-center" style={{ background: "var(--warm-white)", padding: "40px", minHeight: "100vh" }}>
                <div style={{ width: "100%", maxWidth: "420px" }}>
                    <AnimatePresence mode="wait">
                        {view === "login" ? (
                            <motion.div
                                key="login-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "var(--mint)", fontWeight: 500 }}>Secure Login</span>
                                <h2 className="mt-2 mb-8" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "32px", fontWeight: 600, color: "var(--forest)" }}>Sign in to Dashboard</h2>

                                {/* Email Field (Locked) */}
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={labelStyle}>Clinic Email</label>
                                    <div className="relative">
                                        <span className="absolute" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--forest)", opacity: 0.5 }}><MailIcon /></span>
                                        <input
                                            type="text"
                                            value="drbndclinic@gmail.com"
                                            readOnly
                                            style={{ ...inputBaseStyle, background: "rgba(0,0,0,0.03)", color: "rgba(0,0,0,0.4)", cursor: "not-allowed" }}
                                        />
                                        <span className="absolute" style={{ right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--sage)" }}><CheckCircleIcon /></span>
                                    </div>
                                </div>

                                {/* Staff Selection */}
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={labelStyle}>Select Staff Member</label>
                                    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                                        {doctors.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => { setSelectedDoctor(doc.id); setErrors({}) }}
                                                style={{
                                                    background: "white",
                                                    border: selectedDoctor === doc.id ? "2px solid var(--forest)" : "1.5px solid rgba(0,0,0,0.08)",
                                                    borderRadius: "12px",
                                                    padding: "12px 8px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    boxShadow: selectedDoctor === doc.id ? "0 4px 12px rgba(26,58,42,0.1)" : "none",
                                                    position: "relative",
                                                    overflow: "visible",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    minWidth: "0"
                                                }}
                                            >
                                                <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", border: "1.5px solid var(--cream)", flexShrink: 0, background: doc.image ? undefined : "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {doc.image ? (
                                                        <img src={doc.image} alt={doc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    ) : (
                                                        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "16px", fontWeight: 700, color: "white" }}>AK</span>
                                                    )}
                                                </div>
                                                <p style={{
                                                    fontFamily: "var(--font-dm-sans)",
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    color: "var(--charcoal)",
                                                    lineHeight: 1.2,
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word"
                                                }}>{doc.name}</p>
                                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", color: "var(--muted)", marginTop: "2px" }}>{doc.specialization.split(' (')[0]}</p>

                                                {selectedDoctor === doc.id && (
                                                    <motion.div
                                                        layoutId="active-doc"
                                                        className="absolute top-0 right-0 p-1"
                                                        style={{ background: "var(--forest)", color: "white", borderBottomLeftRadius: "8px", zIndex: 1 }}
                                                    >
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: "12px" }}>
                                    <label style={labelStyle}>Access Code / Password</label>
                                    <div className="relative">
                                        <span className="absolute" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--forest)", opacity: 0.5 }}><LockIcon /></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setErrors({}) }}
                                            placeholder="••••••••"
                                            style={{ ...inputBaseStyle, paddingRight: "48px" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right", marginBottom: "32px" }}>
                                    <button
                                        onClick={() => { setView("forgot"); setErrors({}) }}
                                        style={{ background: "none", border: "none", fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 600, color: "var(--sage)", cursor: "pointer" }}
                                    >
                                        Forgot credentials?
                                    </button>
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ background: "#fdf2f2", color: "#9b1c1c", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", fontFamily: "var(--font-dm-sans)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #f8d4d4" }}
                                    >
                                        <span style={{ fontSize: "16px" }}>⚠️</span> {Object.values(errors)[0]}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleLogin}
                                    disabled={loading}
                                    style={{
                                        ...btnPrimaryStyle,
                                        opacity: loading ? 0.7 : 1,
                                        cursor: loading ? "wait" : "pointer",
                                    }}
                                >
                                    {loading ? "Verifying..." : "Access Dashboard →"}
                                </button>
                            </motion.div>
                        ) : view === "forgot" ? (
                            <motion.div
                                key="forgot-view"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <button
                                    onClick={() => setView("login")}
                                    style={{ background: "none", border: "none", fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)", marginBottom: "32px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                    ← Back to Login
                                </button>
                                <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "30px", fontWeight: 600, color: "var(--forest)", marginBottom: "12px" }}>Restore Access</h2>
                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "32px" }}>
                                    Please select your profile. We will send a secure reset link to the clinic administrator email: <strong style={{ color: "var(--forest)" }}>drbndclinic@gmail.com</strong>
                                </p>

                                {/* Staff Selection (Forgot Mode) */}
                                <div style={{ marginBottom: "32px" }}>
                                    <div className="grid grid-cols-3 gap-3">
                                        {doctors.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => { setSelectedDoctor(doc.id); setErrors({}) }}
                                                style={{
                                                    background: "white",
                                                    border: selectedDoctor === doc.id ? "2px solid var(--forest)" : "1.5px solid rgba(0,0,0,0.08)",
                                                    borderRadius: "12px",
                                                    padding: "12px 8px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", background: doc.image ? undefined : "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {doc.image ? (
                                                        <img src={doc.image} alt={doc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    ) : (
                                                        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 700, color: "white" }}>AK</span>
                                                    )}
                                                </div>
                                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", fontWeight: 600, color: "var(--charcoal)" }}>{doc.name.split(' ').slice(0, 2).join(' ')}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {Object.keys(errors).length > 0 && (
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "#9b1c1c", marginBottom: "16px" }}>{Object.values(errors)[0]}</p>
                                )}

                                <button
                                    onClick={handleForgot}
                                    disabled={loading}
                                    style={btnPrimaryStyle}
                                >
                                    {loading ? "Sending..." : "Send Reset Link →"}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sent-view"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: "center" }}
                            >
                                <div style={{ width: "64px", height: "64px", background: "var(--cream)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--forest)" }}>
                                    <CheckCircleIcon />
                                </div>
                                <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "28px", fontWeight: 600, color: "var(--forest)", marginBottom: "12px" }}>Request Sent</h2>
                                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "32px" }}>
                                    A secure access link has been sent to <strong>drbndclinic@gmail.com</strong>. Please check the inbox to continue.
                                </p>
                                <button
                                    onClick={() => setView("login")}
                                    style={btnPrimaryStyle}
                                >
                                    Return to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    )
}
