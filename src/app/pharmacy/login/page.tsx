"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function PharmacistLoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) { setError('Please enter username and password'); return }
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/pharmacist/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Invalid credentials')
                setLoading(false)
                return
            }

            localStorage.setItem('pharmacist_session', JSON.stringify(data.pharmacist))
            router.push('/pharmacy/dashboard/overview')
        } catch {
            setError('Connection error. Please try again.')
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image src="/logo.jpeg" alt="Dr. BND Clinic" width={140} height={40} style={{ height: '40px', width: 'auto' }} />
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_48px_rgba(26,58,42,0.10)] p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#1a3a2a] flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-dm-sans)" }}>💊</span>
                        </div>
                        <h1
                            className="font-bold text-[#1a3a2a]"
                            style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "26px" }}
                        >
                            Pharmacist Portal
                        </h1>
                        <p className="text-[#1a3a2a60] text-[13px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Sign in to manage products and orders
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-4 py-3 rounded-xl border border-[#1a3a2a15] text-[14px] outline-none focus:border-[#1a3a2a50] transition-all bg-white"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#1a3a2a15] text-[14px] outline-none focus:border-[#1a3a2a50] transition-all bg-white"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3a2a40] hover:text-[#1a3a2a] transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a3a2a] text-white font-bold text-[14px] cursor-pointer hover:brightness-110 transition-all disabled:opacity-60 mt-2"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
