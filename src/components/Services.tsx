"use client"

import { motion } from "framer-motion"
import { Pill, Trees, Brain, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import Link from "next/link"

const services = [
    {
        title: "Homoeopathy",
        description: "Holistically treating the root cause of ailments using dilute natural substances to trigger the body's self-healing mechanisms.",
        icon: Pill,
        color: "bg-soft-mint text-deep-teal",
        benefits: ["Natural & Safe", "No Side Effects", "Personalized Treatment"],
        href: "/services/homoeopathy"
    },
    {
        title: "Psychotherapy",
        description: "Supportive guidance and evidence-based techniques to help you navigate mental health challenges and emotional well-being.",
        icon: Brain,
        color: "bg-deep-teal text-white",
        benefits: ["Cognitive Therapy", "Stress Management", "Emotional Support"],
        href: "/services/psychotherapy"
    }
]

export function Services() {
    return (
        <section id="services" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 text-accent-teal font-semibold mb-3"
                    >
                        <Trees className="w-5 h-5" />
                        <span className="uppercase tracking-widest text-xs">Our Services</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-deep-teal mb-4"
                    >
                        Nurturing Recovery & Growth
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-cool-grey text-lg"
                    >
                        We combine traditional healing with modern therapeutic practices
                        to ensure a comprehensive wellness journey.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {services.map((service, index) => (
                        <Link key={service.title} href={service.href} className="group cursor-pointer">
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative p-8 rounded-3xl border border-deep-teal/5 bg-[#fafafa] group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-deep-teal/10 transition-all duration-500 overflow-hidden h-full"
                            >
                                <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                                    <service.icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-3xl font-bold text-deep-teal mb-4">{service.title}</h3>
                                <p className="text-cool-grey text-lg mb-8 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-4 mb-8">
                                    {service.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center gap-3 text-deep-teal/80">
                                            <CheckCircle2 className="w-5 h-5 text-accent-teal" />
                                            <span className="font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button variant={index === 0 ? "outline" : "default"} className="w-full h-12 pointer-events-none group-hover:scale-[1.02] transition-transform">
                                    Learn More
                                </Button>

                                {/* Decorative side element */}
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <service.icon className="w-24 h-24" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
