"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Calendar, ArrowRight } from "lucide-react"
import { useAppointment } from "@/context/AppointmentContext"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
    { name: "Overview", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Our Team", href: "#doctors" },
    { name: "Case Files", href: "/case-files" },
    { name: "Contact", href: "#contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { openModal } = useAppointment()
    const router = useRouter()
    const pathname = usePathname()

    const handleNavClick = (href: string) => {
        setIsOpen(false)
        
        if (href.startsWith("#")) {
            if (pathname !== "/") {
                router.push("/" + href)
            } else {
                if (href === "#") {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                } else {
                    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })
                }
            }
        }
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isOpen])

    return (
        <header
            className="sticky top-0 z-50 bg-white transition-shadow duration-300"
            style={{
                boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
            }}
        >
            <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between" style={{ height: "72px" }}>
                {/* Logo */}
                <button 
                  onClick={() => {
                    if (pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    } else {
                        router.push("/")
                    }
                  }} 
                  className="flex items-center shrink-0 cursor-pointer bg-transparent border-none p-0"
                >
                    <Image
                        src="/logo.jpeg"
                        alt="Dr. BND Clinic Logo"
                        width={160}
                        height={45}
                        className="object-contain"
                        style={{ height: "45px", width: "auto" }}
                        priority
                    />
                </button>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navItems.map((item) => (
                        item.href.startsWith("#") ? (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className="relative text-charcoal hover:text-forest transition-colors duration-200 bg-transparent border-none cursor-pointer group"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 500, padding: 0 }}
                            >
                                {item.name}
                                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                            </button>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative text-charcoal hover:text-forest transition-colors duration-200 group"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 500 }}
                            >
                                {item.name}
                                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                            </Link>
                        )
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-forest/60 text-xs font-semibold flex items-center gap-1 uppercase tracking-widest hover:text-forest transition-colors"
                    >
                        Staff Login <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-forest text-white rounded-lg hover:bg-sage transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        style={{ padding: "10px 22px", fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 600, border: "none" }}
                    >
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-forest focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center translate-x-2"
                        aria-label="Open Menu"
                    >
                        <Menu className="w-7 h-7" />
                    </button>
                </div>
            </nav>

            {/* Mobile Full Screen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-100 h-full w-full bg-white md:hidden"
                    >
                        <div className="flex flex-col h-full bg-white relative">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between px-6 h-[72px] border-b border-gold-light/20">
                                <Image
                                    src="/logo.jpeg"
                                    alt="Logo"
                                    width={140}
                                    height={40}
                                    style={{ height: "40px", width: "auto" }}
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-charcoal cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center translate-x-2"
                                    aria-label="Close Menu"
                                >
                                    <X className="w-7 h-7" />
                                </button>
                            </div>

                            {/* Mobile Nav Links */}
                            <div className="flex flex-col flex-1 px-8 py-10 gap-8 overflow-y-auto">
                                {navItems.map((item, idx) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                    >
                                        {item.href.startsWith("#") ? (
                                            <button
                                                onClick={() => handleNavClick(item.href)}
                                                className="text-[28px] font-bold text-forest py-2 border-transparent border-b-2 hover:border-gold transition-all w-fit cursor-pointer bg-transparent border-none p-0"
                                                style={{ fontFamily: "var(--font-serif)" }}
                                            >
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-[28px] font-bold text-forest py-2 border-transparent border-b-2 hover:border-gold transition-all w-fit block"
                                                style={{ fontFamily: "var(--font-serif)" }}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mobile Footer Area */}
                            <div className="px-6 py-8 border-t border-gold-light/20 bg-cream/30">
                                <button
                                    onClick={() => { openModal(); setIsOpen(false); }}
                                    className="w-full flex items-center justify-center gap-3 bg-forest text-white py-4 rounded-xl shadow-lg active:scale-95 transition-all text-lg font-bold cursor-pointer"
                                    style={{ fontFamily: "var(--font-dm-sans)", border: "none" }}
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment
                                </button>
                                <div className="mt-8 flex justify-between items-center px-2">
                                    <Link 
                                        href="/login" 
                                        onClick={() => setIsOpen(false)}
                                        className="text-forest/60 text-sm font-semibold flex items-center gap-1 uppercase tracking-widest hover:text-forest transition-colors"
                                    >
                                        Staff Login <ArrowRight className="w-3 h-3" />
                                    </Link>
                                    <p className="text-gray-400 text-xs">Dr. BND Klinik © 2024</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
