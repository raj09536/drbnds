"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, ArrowUpRight, Facebook, Instagram } from "lucide-react"
import { toast } from "sonner"

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.936H5.059z"></path>
    </svg>
)

export function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            icon: Facebook,
            href: "https://www.facebook.com/p/Drbnds-Homoeopathy-Psychotherapy-Clinic-61554772615218/",
            label: "Facebook"
        },
        {
            icon: Instagram,
            href: "https://www.instagram.com/drbndhomoeopathy/",
            label: "Instagram"
        },
        {
            icon: XIcon,
            href: "#",
            label: "X",
            comingSoon: true
        },
    ]

    return (
        <footer id="location" className="bg-foreground text-background py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="mb-8 block"
                        >
                            <Image
                                src="/logo.jpeg"
                                alt="Dr. BND Clinic Logo"
                                width={180}
                                height={60}
                                className="object-contain h-10 w-auto md:h-12"
                            />
                        </Link>
                        <p className="text-white/60 text-lg mb-8 max-w-md leading-relaxed">
                            Leading the way in holistic healthcare through classical Homoeopathy
                            and compassionate Psychotherapy. Dedicated to your long-term
                            wellness and mental clarity.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target={social.comingSoon ? undefined : "_blank"}
                                    rel={social.comingSoon ? undefined : "noopener noreferrer"}
                                    title={social.comingSoon ? "Coming Soon" : social.label}
                                    onClick={(e) => {
                                        if (social.comingSoon) {
                                            e.preventDefault()
                                            toast("Twitter profile coming soon!", { icon: "⏳" })
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-foreground transition-all cursor-pointer"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold mb-8 text-white">Contact Info</h4>
                        <div className="space-y-6">
                            {[
                                { icon: Phone, text: "+91-8191919949", href: "tel:+918191919949" },
                                { icon: Phone, text: "+91-9997954989", href: "tel:+919997954989" },
                                { icon: Mail, text: "drbndclinic@gmail.com", href: "mailto:drbndclinic@gmail.com" },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="flex items-start gap-4 text-white/60 hover:text-accent-teal transition-colors group"
                                >
                                    <div className="mt-1 p-1 bg-white/5 rounded-lg border border-white/5 group-hover:border-accent-teal/30">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">{item.text}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold mb-8 text-white">Our Location</h4>
                        <div className="flex items-start gap-4 text-white/60 leading-relaxed mb-8">
                            <div className="mt-1 p-1 bg-white/5 rounded-lg border border-white/5">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <p className="text-lg">
                                Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower,
                                Dehradun, Uttarakhand, 248005
                            </p>
                        </div>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-accent-teal font-semibold group"
                        >
                            Get Directions
                            <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
                    <p>© {currentYear} Dr. BND&apos;s Clinic. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
