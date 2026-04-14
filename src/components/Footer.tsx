"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react"
import { clinics } from "@/data/staticData"
import { useAppointment } from "@/context/AppointmentContext"

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
)

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.855L0 24l6.335-1.509A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.003-1.366l-.36-.214-3.724.976.994-3.624-.235-.373A9.818 9.818 0 1 1 12 21.818z" />
    </svg>
)

/* ─── Legal Modal Content ────────────────────────────────────────────── */
const PrivacyPolicyContent = () => (
    <div style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>
        <p><strong style={{ color: "var(--forest)" }}>Last updated: January 2026</strong></p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Information We Collect</h3>
        <p>We collect information you provide when booking appointments, filling out our contact form, or communicating with us. This includes your name, email address, phone number, and health-related information you choose to share.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>How We Use Your Information</h3>
        <p>Your information is used solely to provide and improve our medical services, respond to your inquiries, and send appointment reminders. We do not sell, trade, or share your personal information with third parties.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Contact Us</h3>
        <p>For any privacy-related concerns, contact us at drbndclinic@gmail.com or call +91-8191919949.</p>
    </div>
)

const TermsContent = () => (
    <div style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>
        <p><strong style={{ color: "var(--forest)" }}>Last updated: January 2026</strong></p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Acceptance of Terms</h3>
        <p>By accessing Dr. BND&apos;s Clinic website, you agree to these terms and conditions. If you do not agree, please do not use our website.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Medical Disclaimer</h3>
        <p>The information on this website is for general informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for medical guidance.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Appointment Policies</h3>
        <p>Appointments are subject to doctor availability. Please provide at least 24 hours notice for cancellations. Walk-ins are welcome subject to availability.</p>
        <br />
        <h3 style={{ color: "var(--forest)", fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "20px", marginBottom: "8px", fontWeight: 600 }}>Limitation of Liability</h3>
        <p>Dr. BND&apos;s Clinic shall not be liable for any damages arising from the use of this website or reliance on any information provided herein.</p>
    </div>
)

const LegalModal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div
        className="fixed inset-0 z-9999 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.7)", padding: "24px" }}
        onClick={onClose}
    >
        <div
            style={{
                background: "white",
                borderRadius: "16px",
                padding: "48px",
                maxWidth: "640px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-start justify-between mb-6">
                <h2
                    style={{
                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                        fontSize: "32px",
                        fontWeight: 600,
                        color: "var(--forest)",
                    }}
                >
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="cursor-pointer hover:text-forest transition-colors"
                    style={{ fontSize: "24px", color: "var(--muted)", background: "none", border: "none" }}
                >
                    ×
                </button>
            </div>
            {title === "Privacy Policy" && <PrivacyPolicyContent />}
            {title === "Terms of Service" && <TermsContent />}
        </div>
    </div>
)

/* ─── Footer Component ───────────────────────────────────────────────── */
export function Footer() {
    const currentYear = new Date().getFullYear()
    const [modal, setModal] = useState<"privacy" | "terms" | null>(null)
    const { openModal } = useAppointment()

    const quickLinks = [
        { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
        { label: "About", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Services", action: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Our Doctors", action: () => document.getElementById("doctors")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Locations", action: () => document.getElementById("location")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "FAQ", action: () => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Book Appointment", action: () => openModal() },
    ]

    const socialLinks = [
        { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/p/Drbnds-Homoeopathy-Psychotherapy-Clinic-61554772615218/" },
        { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/drbndhomoeopathy/" },
        { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/918191919949" },
    ]

    return (
        <footer style={{ background: "var(--charcoal)", color: "white" }}>
            {/* Top Section */}
            <div className="container mx-auto px-6 pt-14 md:pt-20 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {/* Col 1: Brand */}
                    <div>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="inline-block mb-6 cursor-pointer bg-transparent border-none p-0"
                        >
                            <Image
                                src="/logo.jpeg"
                                alt="Dr. BND Clinic Logo"
                                width={160}
                                height={50}
                                className="object-contain"
                                style={{ height: "44px", width: "auto" }}
                            />
                        </button>
                        <p
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.7,
                                maxWidth: "280px",
                            }}
                        >
                            Leading the way in holistic healthcare through classical Homoeopathy and compassionate
                            Psychotherapy.
                        </p>

                        {/* Social Icons — proper SVGs */}
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center rounded-full transition-all duration-200 hover:border-gold hover:text-gold hover:bg-gold/10"
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "rgba(255,255,255,0.7)",
                                    }}
                                    title={s.label}
                                >
                                    <s.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Clinic 1 */}
                    <div>
                        <h4
                            className="mb-5"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "3px",
                                color: "var(--gold)",
                                fontWeight: 600,
                            }}
                        >
                            Dehradun Clinic
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-3.5 h-3.5 mt-1 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                                    {clinics[0].address}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                                    {clinics[0].phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                                    {clinics[0].email}
                                </span>
                            </div>
                            <a
                                href={clinics[0].map_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 hover:underline"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--mint)", fontWeight: 500 }}
                            >
                                Get Directions <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Col 3: Clinic 2 */}
                    <div>
                        <h4
                            className="mb-5"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "3px",
                                color: "var(--gold)",
                                fontWeight: 600,
                            }}
                        >
                            Bijnor Clinic
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-3.5 h-3.5 mt-1 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                                    {clinics[1].address}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                                    {clinics[1].phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
                                    {clinics[1].email}
                                </span>
                            </div>
                            <a
                                href={clinics[1].map_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 hover:underline"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--mint)", fontWeight: 500 }}
                            >
                                Get Directions <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Col 4: Quick Links — smooth scroll */}
                    <div>
                        <h4
                            className="mb-5"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "3px",
                                color: "var(--gold)",
                                fontWeight: 600,
                            }}
                        >
                            Quick Links
                        </h4>
                        <div className="flex flex-col gap-2.5">
                            {quickLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={link.action}
                                    className="text-left transition-all duration-200 hover:text-gold hover:translate-x-1 cursor-pointer"
                                    style={{
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "13px",
                                        color: "rgba(255,255,255,0.65)",
                                        background: "none",
                                        border: "none",
                                        padding: "4px 0",
                                    }}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-6 border-t border-white/10 mt-2">
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                        © {currentYear} Dr. BND&apos;s Clinic. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <button
                            onClick={() => setModal("privacy")}
                            className="hover:text-white transition-colors cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "none", border: "none" }}
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setModal("terms")}
                            className="hover:text-white transition-colors cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "none", border: "none" }}
                        >
                            Terms of Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Legal Modal */}
            {modal && (
                <LegalModal
                    title={modal === "privacy" ? "Privacy Policy" : "Terms of Service"}
                    onClose={() => setModal(null)}
                />
            )}
        </footer>
    )
}
