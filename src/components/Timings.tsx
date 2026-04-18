"use client"

import { useState } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { clinics } from "@/data/staticData"

export function WorkingHours() {
    const { ref, isVisible } = useScrollReveal(0.15)
    const [activeTab, setActiveTab] = useState(0)

    const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

    return (
        <section ref={ref} className="section-padding" style={{ background: "var(--forest)" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span
                        className={`block transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "11px",
                            letterSpacing: "5px",
                            textTransform: "uppercase",
                            color: "var(--mint)",
                            fontWeight: 500,
                        }}
                    >
                        Plan Your Visit
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(28px, 3.5vw, 40px)",
                            fontWeight: 600,
                            color: "white",
                            lineHeight: 1.2,
                            transitionDelay: "100ms",
                        }}
                    >
                        Clinic Timings
                    </h2>
                </div>

                {/* Tab Bar */}
                <div className="flex justify-center mb-10">
                    <div
                        className="inline-flex rounded-full"
                        style={{ background: "rgba(255,255,255,0.08)", padding: "6px" }}
                    >
                        {clinics.map((clinic, i) => (
                            <button
                                key={clinic.id}
                                onClick={() => setActiveTab(i)}
                                className="rounded-full cursor-pointer transition-all duration-300"
                                style={{
                                    padding: "10px 24px",
                                    fontFamily: "var(--font-dm-sans)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    background: activeTab === i ? "var(--gold)" : "transparent",
                                    color: activeTab === i ? "var(--forest)" : "rgba(255,255,255,0.6)",
                                }}
                            >
                                {clinic.name.length > 25
                                    ? `Clinic ${i + 1} — ${clinic.location.split(",")[0]}`
                                    : clinic.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timing Table */}
                <div className="max-w-[600px] mx-auto">
                    {clinics[activeTab].timings.map((row, i) => {
                        const isToday = row.day === currentDay
                        return (
                            <div
                                key={row.day}
                                className={`flex items-center justify-between transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    padding: "16px 20px",
                                    borderBottom: i < clinics[activeTab].timings.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                    background: isToday ? "rgba(201,168,76,0.15)" : "transparent",
                                    borderLeft: isToday ? "3px solid var(--gold)" : "3px solid transparent",
                                    borderRadius: isToday ? "4px" : "0",
                                    transitionDelay: `${300 + i * 60}ms`,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-dm-sans)",
                                        fontSize: "clamp(12px, 2vw, 14px)",
                                        color: isToday ? "var(--gold)" : "rgba(255,255,255,0.7)",
                                        fontWeight: isToday ? 600 : 400,
                                    }}
                                >
                                    {row.day}
                                    {isToday && (
                                        <span
                                            className="ml-2 rounded-full"
                                            style={{
                                                background: "var(--gold)",
                                                color: "var(--forest)",
                                                padding: "2px 8px",
                                                fontSize: "10px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            TODAY
                                        </span>
                                    )}
                                </span>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {row.closed ? (
                                        <span
                                            className="rounded-full px-3 py-1"
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                background: "rgba(220,38,38,0.15)",
                                                color: "#f87171",
                                            }}
                                        >
                                            Closed
                                        </span>
                                    ) : (row.slots as string[]).map((slot, si) => (
                                        <span
                                            key={si}
                                            className="rounded-full px-3 py-1"
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "clamp(11px, 1.8vw, 13px)",
                                                fontWeight: 500,
                                                background: "rgba(127,185,154,0.15)",
                                                color: "white",
                                                border: "1px solid rgba(127,185,154,0.3)",
                                            }}
                                        >
                                            {slot}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Urgent CTA */}
                <div className="text-center mt-10">
                    <p
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.6)",
                        }}
                    >
                        Urgent? Call Now:{" "}
                        <a
                            href="tel:+918191919949"
                            className="hover:underline"
                            style={{ color: "white", fontWeight: 600 }}
                        >
                            +91-8191919949
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}
