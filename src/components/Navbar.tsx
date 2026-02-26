"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/AppointmentModal"

import { useAuth } from "@/hooks/use-auth"

import { useRouter } from "next/navigation"

const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "Timings", href: "#timings" },
    { name: "Location", href: "#location" },
]

export function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const { scrollY } = useScroll()
    const { user, role, signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
        setIsOpen(false)
        router.push("/")
        router.refresh()
    }

    const backgroundColor = useTransform(
        scrollY,
        [0, 50],
        ["rgba(252, 250, 242, 0)", "rgba(252, 250, 242, 0.9)"]
    )

    const backdropBlur = useTransform(
        scrollY,
        [0, 50],
        ["blur(0px)", "blur(12px)"]
    )

    const borderOpacity = useTransform(
        scrollY,
        [0, 50],
        ["rgba(0, 77, 77, 0)", "rgba(0, 77, 77, 0.1)"]
    )

    return (
        <motion.nav
            style={{
                backgroundColor,
                backdropFilter: backdropBlur,
                borderBottom: `1px solid ${borderOpacity}`
            }}
            className="fixed top-0 left-0 right-0 z-50 py-4 transition-all"
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center"
                >
                    <Image
                        src="/logo.jpeg"
                        alt="Dr. BND Clinic Logo"
                        width={180}
                        height={60}
                        className="object-contain cursor-pointer h-10 w-auto md:h-12"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-8 mr-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-cool-grey hover:text-deep-teal transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 border-l border-deep-teal/10 pl-6 h-8">
                        {user ? (
                            <>
                                <Link href={role === 'doctor' ? "/doctor-dashboard" : "/patient-dashboard"}>
                                    <Button variant="outline" size="sm" className="h-9">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-cool-grey hover:text-destructive transition-colors"
                                >
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-deep-teal font-medium">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="premium-glow" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                        <div className="w-px h-4 bg-deep-teal/10 mx-1" />
                        <AppointmentModal>
                            <Button size="sm" className="bg-deep-teal hover:bg-deep-teal/90 text-white gap-2 h-9 px-4">
                                <Calendar className="w-4 h-4" />
                                <span className="hidden lg:inline">Book Appointment</span>
                                <span className="lg:hidden">Book</span>
                            </Button>
                        </AppointmentModal>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    {user && (
                        <Link href={role === 'doctor' ? "/doctor-dashboard" : "/patient-dashboard"}>
                            <Button variant="outline" size="sm" className="h-9 px-3">
                                Dashboard
                            </Button>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-deep-teal focus:outline-none bg-soft-mint/50 rounded-full cursor-pointer hover:bg-soft-mint transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden bg-warm-cream border-t border-deep-teal/5"
            >
                <div className="px-6 py-8 flex flex-col gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-cool-grey hover:text-deep-teal"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div className="pt-4 border-t border-deep-teal/5 flex flex-col gap-4">
                        {user ? (
                            <Button
                                variant="ghost"
                                className="w-full h-12 text-destructive justify-start px-0"
                                onClick={handleLogout}
                            >
                                Log out from Account
                            </Button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full h-12 text-base">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsOpen(false)}>
                                    <Button variant="premium-glow" className="w-full h-12 text-base">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <AppointmentModal>
                            <Button
                                className="w-full h-14 text-lg gap-2 bg-deep-teal text-white shadow-xl shadow-deep-teal/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <Calendar className="w-5 h-5" />
                                Book Appointment
                            </Button>
                        </AppointmentModal>
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    )
}
