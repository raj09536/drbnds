"use client"

import { motion, Variants } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Brain,
    CheckCircle2,
    Heart,
    MessageCircle,
    Zap,
    ArrowRight,
    Users
} from "lucide-react"
import Link from "next/link"

export default function PsychotherapyPage() {

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    return (
        <main className="min-h-screen bg-[#FBFDFF]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_0%,rgba(0,121,121,0.05)_0%,rgba(252,250,242,0)_100%)]" />

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-teal text-white text-sm font-semibold mb-6 shadow-xl shadow-deep-teal/10"
                    >
                        <Brain className="w-4 h-4" />
                        <span>Holistic Psychotherapy</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-deep-teal mb-6 tracking-tight"
                    >
                        Compassionate Care for <br />
                        <span className="text-accent-teal italic font-serif">Emotional Wellness</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-cool-grey max-w-3xl mx-auto leading-relaxed"
                    >
                        Psychotherapy is more than just talk. It is a collaborative process based
                        on the relationship between an individual and a therapist. It provides a
                        supportive environment that allows you to talk openly with someone who is objective.
                    </motion.p>
                </div>
            </section>

            {/* Core Pillars Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MessageCircle,
                                title: "Dialogue Based",
                                desc: "Safe, confidential space to explore thoughts, feelings, and behaviors that are causing distress."
                            },
                            {
                                icon: Zap,
                                title: "CBT Techniques",
                                desc: "Evidence-based strategies to identify and change destructive or disturbing thought patterns."
                            },
                            {
                                icon: Heart,
                                title: "Emotional Resilience",
                                desc: "Building the tools and mindset required to navigate life's challenges with strength and clarity."
                            }
                        ].map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={itemVariants}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border-0 bg-soft-mint/10 p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                                    <CardContent className="p-0 space-y-4">
                                        <div className="w-14 h-14 rounded-2xl bg-deep-teal flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <benefit.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-deep-teal">{benefit.title}</h3>
                                        <p className="text-cool-grey leading-relaxed">{benefit.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-24 bg-[#FBFDFF]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="aspect-square bg-deep-teal rounded-[3rem] overflow-hidden relative group">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.2),transparent)]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Users className="w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-[2s]" />
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <p className="text-xl font-medium italic opacity-90 leading-relaxed mb-4">
                                        &quot;The curious paradox is that when I accept myself just as I am, then I can change.&quot;
                                    </p>
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">— Carl Rogers</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <h2 className="text-4xl font-bold text-deep-teal mb-6">Your Path to Clarity</h2>
                            <div className="space-y-6">
                                {[
                                    "Individual one-on-one therapy sessions",
                                    "Family and Relationship counseling",
                                    "Stress & Anxiety management programs",
                                    "Adolescent mental health support",
                                    "Grief and Trauma recovery counseling"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-deep-teal flex items-center justify-center shrink-0 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-cool-grey font-medium text-lg">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-linear-to-br from-soft-mint to-white border-2 border-deep-teal/5 rounded-[3rem] p-12 text-center shadow-2xl shadow-deep-teal/5"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-deep-teal mb-6">Ready to prioritize your mind?</h2>
                        <p className="text-cool-grey text-lg mb-10 max-w-xl mx-auto">
                            Embark on a transformative journey toward inner peace and emotional balance
                            with guided professional psychotherapy.
                        </p>

                        <Link href="/appointment">
                            <Button size="lg" className="bg-deep-teal text-white hover:bg-deep-teal/90 h-16 px-12 rounded-2xl text-xl font-bold group shadow-xl">
                                Book Now
                                <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
