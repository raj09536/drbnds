"use client"

import { useState } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { faqs } from "@/data/staticData"

export function FAQ() {
    const { ref, isVisible } = useScrollReveal(0.1)
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    const [showAll, setShowAll] = useState(false)

    const toggle = (i: number) => {
        setOpenIdx(openIdx === i ? null : i)
    }

    const visibleFaqs = showAll ? faqs : faqs.slice(0, 5)

    return (
        <section id="faq" ref={ref} className="section-padding" style={{ background: "var(--cream)" }}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
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
                        Got Questions?
                    </span>
                    <h2
                        className={`mt-4 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        style={{
                            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                            fontSize: "clamp(28px, 3.5vw, 40px)",
                            fontWeight: 600,
                            color: "var(--forest)",
                            lineHeight: 1.2,
                            transitionDelay: "100ms",
                        }}
                    >
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* Accordion */}
                <div className="max-w-[800px] mx-auto flex flex-col gap-2">
                    {visibleFaqs.map((faq, i) => {
                        const isOpen = openIdx === i
                        return (
                            <div
                                key={i}
                                className={`overflow-hidden transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                style={{
                                    background: "white",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    transitionDelay: `${200 + i * 60}ms`,
                                }}
                            >
                                {/* Header */}
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-center justify-between cursor-pointer hover:bg-black/2 transition-colors duration-200"
                                    style={{ padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 24px)" }}
                                >
                                    <span
                                        className="text-left"
                                        style={{
                                            fontFamily: "var(--font-dm-sans)",
                                            fontSize: "clamp(13px, 2vw, 15px)",
                                            fontWeight: 500,
                                            color: "var(--charcoal)",
                                        }}
                                    >
                                        {faq.q}
                                    </span>
                                    <span
                                        className="shrink-0 ml-4 transition-transform duration-300"
                                        style={{
                                            color: "var(--gold)",
                                            fontSize: "24px",
                                            fontWeight: 300,
                                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                        }}
                                    >
                                        +
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    className="transition-all duration-350 ease-in-out"
                                    style={{
                                        maxHeight: isOpen ? "500px" : "0",
                                        opacity: isOpen ? 1 : 0,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "0 clamp(16px, 4vw, 24px) clamp(14px, 3vw, 20px)",
                                            borderTop: "1px solid rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        <p
                                            className="pt-4"
                                            style={{
                                                fontFamily: "var(--font-dm-sans)",
                                                fontSize: "14px",
                                                color: "var(--muted)",
                                                lineHeight: 1.75,
                                            }}
                                        >
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {faqs.length > 5 && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="view-all-btn"
                        >
                            {showAll ? "Show Less ↑" : "View More Questions ↓"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
