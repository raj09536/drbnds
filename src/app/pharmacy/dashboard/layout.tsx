"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { usePharmacist } from "@/hooks/usePharmacist"
import { Package, ShoppingCart, BarChart3, LogOut, Menu, X } from "lucide-react"

const navLinks = [
    { href: '/pharmacy/dashboard/products', label: 'Products', icon: Package },
    { href: '/pharmacy/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/pharmacy/dashboard/overview', label: 'Overview', icon: BarChart3 },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
    const { pharmacist, logout } = usePharmacist()
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-[#1a3a2a] text-white w-64 shrink-0">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                    <p className="text-white font-semibold" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "18px", lineHeight: 1.2 }}>
                        Dr. BND&apos;s Clinic
                    </p>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        Pharmacist Panel
                    </p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-white/60 hover:text-white cursor-pointer md:hidden">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Pharmacist info */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img src="/amit-kumar.jpg" alt="Amit Kumar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                    <p className="text-white font-semibold text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {pharmacist?.name || 'Pharmacist'}
                    </p>
                    <p className="text-white/40 text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        @{pharmacist?.username}
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navLinks.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-150"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                background: active ? 'var(--gold, #c9a84c)' : 'transparent',
                                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* Sign out */}
            <div className="px-4 py-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-all w-full cursor-pointer"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default function PharmacyDashboardLayout({ children }: { children: React.ReactNode }) {
    const { pharmacist, isLoading } = usePharmacist()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (!isLoading && !pharmacist) {
            router.push('/pharmacy/login')
        }
    }, [pharmacist, isLoading, router])

    if (isLoading || !pharmacist) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#1a3a2a] border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-[#FAFAF7] overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
                    <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex">
                        <Sidebar onClose={() => setMobileOpen(false)} />
                    </div>
                </>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#1a3a2a08]">
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-[#1a3a2a] cursor-pointer">
                        <Menu size={22} />
                    </button>
                    <span className="font-bold text-[#1a3a2a] text-[15px]" style={{ fontFamily: "var(--font-cormorant, serif)" }}>
                        Pharmacist Panel
                    </span>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
