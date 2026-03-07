"use client"

import { useScrollReveal } from "@/hooks/useScrollReveal"
import { useCountUp } from "@/hooks/useCountUp"
import { stats } from "@/data/staticData"

function StatItem({ number, suffix, label, isVisible }: { number: number; suffix: string; label: string; isVisible: boolean }) {
    const count = useCountUp(number, 2000, isVisible)

    return (
        <div className="text-center">
            <div style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "56px", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>
                {count.toLocaleString()}{suffix}
            </div>
            <div
                className="mt-2"
                style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    color: "rgba(255,255,255,0.6)",
                }}
            >
                {label}
            </div>
        </div>
    )
}

export function StatsBar() {
    const { ref, isVisible } = useScrollReveal(0.3)

    return (
        <section
            ref={ref}
            style={{
                background: "var(--forest)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                padding: "48px 0",
            }}
        >
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="relative flex justify-center">
                            <StatItem
                                number={stat.number}
                                suffix={stat.suffix}
                                label={stat.label}
                                isVisible={isVisible}
                            />
                            {/* Vertical divider — hidden on mobile and after last item */}
                            {i < stats.length - 1 && (
                                <div
                                    className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2"
                                    style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.15)" }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
