"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

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

const CheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "var(--forest)",
    display: "block",
    marginBottom: "8px",
}

const inputBaseStyle: React.CSSProperties = {
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "10px",
    padding: "13px 16px 13px 44px",
    fontFamily: "var(--font-dm-sans)",
    fontSize: "14px",
    color: "var(--charcoal)",
    background: "white",
    width: "100%",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
}

const btnPrimaryStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "var(--forest)",
    color: "white",
    fontFamily: "var(--font-dm-sans)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    boxShadow: "0 8px 24px rgba(26,58,42,0.25)",
    transition: "all 0.2s",
    cursor: "pointer",
}

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    // Supabase listens for the RECOVERY event from the email link
    useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                // User arrived from the reset link — they can now set a new password
            }
        })
    }, [])

    const handleReset = async () => {
        setError("")
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        const { error: updateError } = await supabase.auth.updateUser({ password })
        setLoading(false)

        if (updateError) {
            setError(updateError.message)
        } else {
            setSuccess(true)
            setTimeout(() => router.push("/login"), 3000)
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "var(--sage)"
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,107,82,0.1)"
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"
        e.currentTarget.style.boxShadow = "none"
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: "var(--warm-white)", padding: "24px" }}
        >
            <div style={{ width: "100%", maxWidth: "420px" }}>
                {!success ? (
                    <div>
                        {/* Icon */}
                        <div
                            className="flex items-center justify-center mx-auto"
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "16px",
                                background: "var(--cream)",
                                border: "1px solid var(--gold-light)",
                                color: "var(--forest)",
                                marginBottom: "20px",
                            }}
                        >
                            <LockIcon />
                        </div>

                        <span
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "11px",
                                letterSpacing: "4px",
                                textTransform: "uppercase",
                                color: "var(--mint)",
                                fontWeight: 500,
                            }}
                        >
                            Security
                        </span>
                        <h2
                            className="mt-2"
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "30px",
                                fontWeight: 600,
                                color: "var(--forest)",
                                lineHeight: 1.2,
                            }}
                        >
                            Set a new password
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                color: "var(--muted)",
                                lineHeight: 1.7,
                                marginTop: "8px",
                                marginBottom: "32px",
                            }}
                        >
                            Your new password must be at least 6 characters long.
                        </p>

                        {/* New Password */}
                        <div style={{ marginBottom: "20px" }}>
                            <label htmlFor="new-password" style={labelStyle}>New Password</label>
                            <div className="relative">
                                <span className="absolute pointer-events-none" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                                    <LockIcon />
                                </span>
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError("") }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="Enter new password"
                                    style={{ ...inputBaseStyle, paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute cursor-pointer"
                                    style={{ right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af" }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: "24px" }}>
                            <label htmlFor="confirm-password" style={labelStyle}>Confirm Password</label>
                            <div className="relative">
                                <span className="absolute pointer-events-none" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                                    <LockIcon />
                                </span>
                                <input
                                    id="confirm-password"
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError("") }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    placeholder="Confirm new password"
                                    onKeyDown={(e) => { if (e.key === "Enter") handleReset() }}
                                    style={{ ...inputBaseStyle, paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute cursor-pointer"
                                    style={{ right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af" }}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                style={{
                                    background: "#fde8e4",
                                    border: "1px solid var(--rose)",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "13px",
                                    color: "var(--rose)",
                                    marginBottom: "16px",
                                }}
                            >
                                ⚠ {error}
                            </div>
                        )}

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            style={{
                                ...btnPrimaryStyle,
                                ...(loading ? { background: "#ccc", color: "#999", boxShadow: "none", cursor: "not-allowed" } : {}),
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="inline-block rounded-full" style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
                                    Updating...
                                </span>
                            ) : (
                                "Update Password →"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div
                            className="flex items-center justify-center mx-auto"
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                background: "#e6f4ec",
                                border: "2px solid var(--mint)",
                                marginBottom: "24px",
                            }}
                        >
                            <CheckIcon />
                        </div>
                        <h2
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "30px",
                                fontWeight: 600,
                                color: "var(--forest)",
                            }}
                        >
                            Password Updated!
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                color: "var(--muted)",
                                marginTop: "8px",
                            }}
                        >
                            Redirecting you to login...
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
