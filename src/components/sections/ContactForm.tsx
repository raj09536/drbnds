"use client"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

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

const socialLinks = [
    { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/p/Drbnds-Homoeopathy-Psychotherapy-Clinic-61554772615218/" },
    { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/drbndhomoeopathy/" },
    { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/918191919949" },
]

export function ContactForm() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        clinic: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Map clinic select value to clinic_id
        const clinicIdMap: Record<string, number> = { clinic1: 1, clinic2: 2 }
        const clinicId = clinicIdMap[formData.clinic] || null

        const { error } = await supabase.from("contact_messages").insert({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            message: formData.message,
            clinic_id: clinicId,
        })

        if (error) {
            console.error("Contact form error:", error)
            toast.error("Failed to send message. Please try again.")
        } else {
            toast.success("✓ Message sent! We'll contact you within 24 hours.")
            setFormData({ name: "", email: "", phone: "", clinic: "", message: "" })
        }
        setLoading(false)
    }

    const inputStyle: React.CSSProperties = {
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        padding: "12px 16px",
        fontFamily: "var(--font-dm-sans)",
        fontSize: "14px",
        width: "100%",
        background: "white",
        color: "var(--charcoal)",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
    }

    return (
        <section id="contact" ref={ref} style={{ background: "var(--cream)", padding: "96px 0" }}>
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left: Contact Info */}
                    <div
                        className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "11px",
                                letterSpacing: "5px",
                                textTransform: "uppercase",
                                color: "var(--mint)",
                                fontWeight: 500,
                            }}
                        >
                            Reach Out
                        </span>

                        <h2
                            className="mt-4"
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "clamp(28px, 3.5vw, 40px)",
                                fontWeight: 600,
                                color: "var(--forest)",
                                lineHeight: 1.2,
                            }}
                        >
                            Get in Touch
                        </h2>

                        <p
                            className="mt-4"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "15px",
                                color: "var(--muted)",
                                lineHeight: 1.75,
                                maxWidth: "420px",
                            }}
                        >
                            Have questions? We&apos;d love to hear from you. Send us a message and
                            we&apos;ll respond within 24 hours.
                        </p>

                        <div className="flex flex-col gap-5 mt-8">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--sage)" }} />
                                <div>
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--forest)", fontWeight: 600 }}>
                                        Clinic 1 — Dehradun
                                    </p>
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}>
                                        Jogiwala Ring Road, Upper Nathanpur
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: "var(--sage)" }} />
                                <div>
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--forest)", fontWeight: 600 }}>
                                        Clinic 2 — Bijnor
                                    </p>
                                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--muted)" }}>
                                        Ocean Hospital, Nagina Chauraha, Dhampur
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--sage)" }} />
                                <div className="flex gap-4">
                                    <a href="tel:+918191919949" className="hover:underline" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--forest)", fontWeight: 500 }}>
                                        +91-8191919949
                                    </a>
                                    <a href="tel:+919997954989" className="hover:underline" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--forest)", fontWeight: 500 }}>
                                        +91-9997954989
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--sage)" }} />
                                <a href="mailto:drbndclinic@gmail.com" className="hover:underline" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--forest)", fontWeight: 500 }}>
                                    drbndclinic@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Social Icons — proper SVGs */}
                        <div className="flex gap-3 mt-8">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center rounded-full transition-all duration-200 hover:border-forest hover:text-forest hover:bg-forest/5"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        border: "1px solid rgba(0,0,0,0.15)",
                                        color: "var(--sage)",
                                    }}
                                    title={social.label}
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div
                        className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="shadow-md"
                            style={{
                                background: "white",
                                borderRadius: "20px",
                                padding: "40px",
                            }}
                        >
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}
                                    >
                                        Your Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="mt-2 focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="mt-2 focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91-XXXXXXXXXX"
                                        className="mt-2 focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="clinic"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}
                                    >
                                        Select Clinic
                                    </label>
                                    <select
                                        id="clinic"
                                        name="clinic"
                                        value={formData.clinic}
                                        onChange={handleChange}
                                        className="mt-2 focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                        style={{ ...inputStyle, appearance: "auto" }}
                                    >
                                        <option value="">Choose a clinic...</option>
                                        <option value="clinic1">Clinic 1 — Dehradun (Dr. B. N. Dwivedy)</option>
                                        <option value="clinic2">Clinic 2 — Bijnor (Dr. Himanshu Bhandari)</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your concern..."
                                        className="mt-2 resize-none focus:border-sage focus:shadow-[0_0_0_3px_rgba(61,107,82,0.15)]"
                                        style={inputStyle}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg transition-all duration-200 hover:bg-sage hover:-translate-y-px cursor-pointer disabled:opacity-60"
                                    style={{
                                        background: "var(--forest)",
                                        color: "white",
                                        padding: "14px",
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        border: "none",
                                    }}
                                >
                                    {loading ? "Sending..." : "Send Message →"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
