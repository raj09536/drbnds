"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Calendar } from "lucide-react"
import { useAppointment } from "@/context/AppointmentContext"

const navItems = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Doctors", href: "#doctors" },
    { name: "Case Files", href: "/case-files" }, // External Link
    { name: "Location", href: "#location" },
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
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className="sticky top-0 z-50 bg-white transition-shadow duration-300"
            style={{
                boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
            }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between" style={{ height: "72px" }}>
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
                        width={180}
                        height={50}
                        className="object-contain cursor-pointer"
                        style={{ height: "50px", width: "auto" }}
                        priority
                    />
                </button>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-8">
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
                <div className="hidden lg:flex items-center gap-3">
                    <Link href="/login">
                        <button
                            className="cursor-pointer transition-all duration-200 hover:bg-forest hover:text-white"
                            style={{
                                padding: "9px 20px",
                                borderRadius: "8px",
                                border: "1.5px solid var(--forest)",
                                background: "transparent",
                                color: "var(--forest)",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                fontWeight: 600,
                                letterSpacing: "0.3px",
                            }}
                        >
                            Staff Login
                        </button>
                    </Link>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-forest text-white rounded-lg hover:bg-sage transition-colors duration-200 cursor-pointer"
                        style={{ padding: "10px 22px", fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 600, border: "none" }}
                    >
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center gap-3">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-1.5 bg-forest text-white rounded-lg cursor-pointer"
                        style={{ padding: "8px 14px", fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 600, border: "none" }}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Book
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-forest focus:outline-none bg-cream rounded-lg cursor-pointer hover:bg-gold-light transition-colors duration-200"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 py-6 bg-white border-t border-gold-light/50 flex flex-col gap-1">
                    {navItems.map((item) => (
                        item.href.startsWith("#") ? (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className="text-charcoal/80 hover:text-forest hover:bg-cream px-4 py-3 rounded-xl transition-all duration-200 bg-transparent border-none cursor-pointer text-left"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", fontWeight: 500 }}
                            >
                                {item.name}
                            </button>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-charcoal/80 hover:text-forest hover:bg-cream px-4 py-3 rounded-xl transition-all duration-200 text-left block"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", fontWeight: 500 }}
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                    <div className="mt-4 pt-4 border-t border-gold-light/30 flex flex-col gap-2">
                        <button
                            onClick={() => { openModal(); setIsOpen(false); }}
                            className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3.5 rounded-xl hover:bg-sage transition-colors duration-200 cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", fontWeight: 600, border: "none" }}
                        >
                            <Calendar className="w-4 h-4" />
                            Book Appointment
                        </button>
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="block text-center"
                            style={{
                                padding: "11px",
                                border: "1.5px solid var(--forest)",
                                borderRadius: "8px",
                                color: "var(--forest)",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                fontWeight: 600,
                                marginTop: "4px",
                            }}
                        >
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
