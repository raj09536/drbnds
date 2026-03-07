"use client"

import Image from "next/image"

import { useScrollReveal } from "@/hooks/useScrollReveal"

export function AboutUs() {
    const { ref, isVisible } = useScrollReveal(0.15)

    return (
        <section
            id="about"
            ref={ref}
            style={{ background: "var(--cream)", padding: "96px 0" }}
        >
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Image */}
                    <div
                        className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: "4/5" }}>
                            <Image
                                src="/doctor.jpeg"
                                alt="Dr. BND's Clinic"
                                fill
                                className="object-cover"
                            />
                            {/* Badge */}
                            <div
                                className="absolute top-6 left-6 rounded-full"
                                style={{
                                    background: "var(--forest)",
                                    color: "white",
                                    padding: "6px 16px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                }}
                            >
                                Est. 2009
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div
                        className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        {/* Eyebrow */}
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
                            Our Story
                        </span>

                        {/* H2 */}
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
                            Two Clinics. One Mission.
                        </h2>

                        {/* Body */}
                        <p
                            className="mt-5"
                            style={{
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "15px",
                                color: "var(--muted)",
                                lineHeight: 1.75,
                            }}
                        >
                            Dr. BND&apos;s Clinic was founded on a simple yet powerful belief — true healing
                            addresses both the physical body and the mind. Today, across our two locations
                            in Dehradun and Bijnor, we continue that mission with the same dedication and compassion.
                        </p>

                        {/* Quote Block */}
                        <blockquote
                            className="mt-8"
                            style={{
                                borderLeft: "3px solid var(--gold)",
                                paddingLeft: "20px",
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                    fontSize: "18px",
                                    fontStyle: "italic",
                                    color: "var(--forest)",
                                    lineHeight: 1.7,
                                }}
                            >
                                &ldquo;True healing begins when we address both the physical symptoms and the
                                emotional landscape. My mission is to restore balance and vitality through a
                                compassionate, holistic approach.&rdquo;
                            </p>
                            <footer
                                className="mt-3"
                                style={{
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "13px",
                                    color: "var(--muted)",
                                    fontWeight: 500,
                                }}
                            >
                                — Dr. B. N. Dwivedy
                            </footer>
                        </blockquote>

                        {/* CTA */}
                        <button
                            onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 mt-8 rounded-lg transition-all duration-200 hover:bg-forest hover:text-white cursor-pointer"
                            style={{
                                border: "2px solid var(--forest)",
                                color: "var(--forest)",
                                padding: "12px 28px",
                                fontFamily: "var(--font-dm-sans)",
                                fontSize: "14px",
                                fontWeight: 600,
                                background: "transparent",
                            }}
                        >
                            Meet Our Doctors →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
