"use client"

import Link from "next/link"
import { Phone, Mail, ArrowRight } from "lucide-react"

export function TopBar() {
    return (
        <div className="hidden md:flex items-center justify-between bg-forest text-white px-6 py-2.5">
            {/* Left: Phone + Email */}
            <div className="flex items-center gap-6">
                <a
                    href="tel:+918191919949"
                    className="flex items-center gap-2 hover:text-gold-light transition-colors duration-200"
                >
                    <Phone className="w-3.5 h-3.5" />
                    <span style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontSize: "13px", fontWeight: 500 }}>
                        +91-8191919949
                    </span>
                </a>
                <a
                    href="mailto:drbndclinic@gmail.com"
                    className="flex items-center gap-2 hover:text-gold-light transition-colors duration-200"
                >
                    <Mail className="w-3.5 h-3.5" />
                    <span style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontSize: "13px", fontWeight: 500 }}>
                        drbndclinic@gmail.com
                    </span>
                </a>
            </div>

            {/* Right: CTA */}
            <Link
                href="/appointment"
                className="flex items-center gap-2 bg-gold text-forest rounded-full hover:brightness-110 transition-all duration-200"
                style={{ padding: "6px 18px", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontSize: "13px", fontWeight: 600 }}
            >
                Book an Appointment
                <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    )
}
