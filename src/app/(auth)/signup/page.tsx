"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, User, Mail, Lock, Phone, Key, ChevronLeft, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

function PatientAuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [mode, setMode] = useState<"login" | "signup">("login")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")

    useEffect(() => {
        const m = searchParams.get("mode")
        setMode(m === "signup" ? "signup" : "login")
    }, [searchParams])

    const switchMode = (m: "login" | "signup") => {
        setMode(m)
        setError(null)
        setIsOtpSent(false)
        setOtp("")
    }

    // ── LOGIN ──────────────────────────────────────────────────────
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const fd = new FormData(e.currentTarget)
        const { error: err } = await supabase.auth.signInWithPassword({
            email: (fd.get("email") as string).trim(),
            password: fd.get("password") as string,
        })
        if (err) {
            setError(err.message)
            setLoading(false)
            return
        }
        toast.success("Welcome back!")
        router.push("/")
    }

    // ── SIGNUP ─────────────────────────────────────────────────────
    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const fd = new FormData(e.currentTarget)
        const userEmail = (fd.get("email") as string).trim()
        const { data, error: err } = await supabase.auth.signUp({
            email: userEmail,
            password: fd.get("password") as string,
            options: {
                data: {
                    full_name: (fd.get("fullName") as string).trim(),
                    phone: (fd.get("phone") as string).trim(),
                    role: "patient",
                },
            },
        })
        if (err) { setError(err.message); setLoading(false); return }
        if (data.user) {
            setEmail(userEmail)
            setIsOtpSent(true)
            toast.success("Verification code sent! Check your email.")
        }
        setLoading(false)
    }

    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault()
        if (otp.length !== 6) { toast.error("Enter a valid 6-digit code."); return }
        setLoading(true)
        const { data, error: err } = await supabase.auth.verifyOtp({ email, token: otp, type: "signup" })
        if (err) { setError(err.message); setLoading(false); return }
        if (data.user) {
            toast.success("Account verified! Welcome.")
            router.push("/")
        }
    }

    const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl border border-[#1a3a2a15] text-[14px] outline-none focus:border-[#1a3a2a40] focus:shadow-[0_0_0_3px_rgba(26,58,42,0.08)] transition-all bg-white"
    const labelCls = "block text-[12px] font-semibold text-[#1a3a2a] mb-1.5"

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--cream, #f5f0e8)" }}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#1a3a2a08]">
                    {/* Top accent */}
                    <div className="h-1.5" style={{ background: "linear-gradient(to right, #1a3a2a, #3d6b52, #7fb99a)" }} />

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="flex justify-center mb-4">
                            <Image src="/logo.jpeg" alt="Dr. BND Clinic" width={90} height={90} className="object-contain rounded-xl" />
                        </div>
                        <h1 className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>
                            {isOtpSent ? "Verify Email" : mode === "login" ? "Patient Login" : "Create Account"}
                        </h1>
                        <p className="text-[#1a3a2a60] text-[13px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            {isOtpSent
                                ? `We sent a 6-digit code to ${email}`
                                : mode === "login"
                                ? "Sign in to access your health records"
                                : "Join Dr. BND's Clinic for personalised care"}
                        </p>
                    </div>

                    {/* Form area */}
                    <div className="px-8 pb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        <AnimatePresence mode="wait">

                            {/* ── LOGIN FORM ── */}
                            {mode === "login" && !isOtpSent && (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }}
                                    onSubmit={handleLogin}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className={labelCls}>Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="email" type="email" required placeholder="name@example.com" className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className={inputCls} style={{ paddingRight: "44px" }} />
                                            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3a2a40] hover:text-[#1a3a2a] cursor-pointer">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                                        style={{ background: "var(--forest, #1a3a2a)" }}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </motion.form>
                            )}

                            {/* ── SIGNUP FORM ── */}
                            {mode === "signup" && !isOtpSent && (
                                <motion.form
                                    key="signup"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    onSubmit={handleSignup}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className={labelCls}>Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="fullName" type="text" required placeholder="Enter your full name" className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="phone" type="tel" required placeholder="+91 00000 00000" className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="email" type="email" required placeholder="name@example.com" className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className={inputCls} style={{ paddingRight: "44px" }} />
                                            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3a2a40] hover:text-[#1a3a2a] cursor-pointer">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                                        style={{ background: "var(--forest, #1a3a2a)" }}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </motion.form>
                            )}

                            {/* ── OTP FORM ── */}
                            {isOtpSent && (
                                <motion.form
                                    key="otp"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    onSubmit={handleVerifyOtp}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className={labelCls + " text-center block"}>Enter 6-Digit Code</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a2a40]" />
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="000000"
                                                value={otp}
                                                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                                                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-[#1a3a2a20] text-2xl tracking-[0.5em] font-black text-center outline-none focus:border-[#1a3a2a50] bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl text-center">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                                        style={{ background: "var(--forest, #1a3a2a)" }}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsOtpSent(false)}
                                        className="w-full flex items-center justify-center gap-1 text-[#1a3a2a60] hover:text-[#1a3a2a] text-[13px] font-semibold py-2 cursor-pointer transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back to Sign Up
                                    </button>
                                </motion.form>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer toggle */}
                    {!isOtpSent && (
                        <div className="px-8 py-5 border-t border-[#1a3a2a08] bg-[#1a3a2a04] text-center" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            {mode === "login" ? (
                                <p className="text-[13px] text-[#1a3a2a80]">
                                    Don&apos;t have an account?{" "}
                                    <button onClick={() => switchMode("signup")} className="text-[#1a3a2a] font-bold hover:underline cursor-pointer bg-transparent border-none">
                                        Create one here
                                    </button>
                                </p>
                            ) : (
                                <p className="text-[13px] text-[#1a3a2a80]">
                                    Already have an account?{" "}
                                    <button onClick={() => switchMode("login")} className="text-[#1a3a2a] font-bold hover:underline cursor-pointer bg-transparent border-none">
                                        Sign in here
                                    </button>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function SignupPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}><div className="w-8 h-8 rounded-full border-2 border-[#1a3a2a] border-t-transparent animate-spin" /></div>}>
            <PatientAuthPage />
        </Suspense>
    )
}
