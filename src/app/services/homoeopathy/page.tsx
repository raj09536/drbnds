"use client"

import { motion, Variants } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Pill,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    Stethoscope,
    Leaf,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { AppointmentModal } from "@/components/AppointmentModal"

export default function HomoeopathyPage() {
    const { user } = useAuth()

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
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,77,77,0.05)_0%,rgba(252,250,242,0)_100%)]" />

                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-mint text-deep-teal text-sm font-semibold mb-6 border border-deep-teal/10"
                    >
                        <Pill className="w-4 h-4" />
                        <span>Classical Homoeopathy</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-deep-teal mb-6 tracking-tight"
                    >
                        Gentle Healing for <br />
                        <span className="text-accent-teal italic font-serif">Modern Ailments</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-cool-grey max-w-3xl mx-auto leading-relaxed"
                    >
                        Classical Homoeopathy is a holistic system of medicine which is based on individualization
                        as its core principle. It treats the person as a whole, addressing the physical, mental,
                        and emotional levels simultaneously.
                    </motion.p>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Leaf,
                                title: "100% Natural",
                                desc: "Derived from natural substances, our remedies work in harmony with your body's vital force."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Zero Side Effects",
                                desc: "Safe for all ages, from infants to the elderly, without the risk of dependency or toxicity."
                            },
                            {
                                icon: Stethoscope,
                                title: "Root Cause Focused",
                                desc: "We don't just suppress symptoms; we aim for deep, permanent recovery by addressing the origin."
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
                                <Card className="border-0 bg-[#fafafa] p-8 rounded-[2rem] hover:shadow-xl transition-shadow duration-500">
                                    <CardContent className="p-0 space-y-4">
                                        <div className="w-14 h-14 rounded-2xl bg-soft-mint flex items-center justify-center text-deep-teal">
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

            {/* Detailed Content */}
            <section className="py-24 bg-[#FBFDFF]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-deep-teal mb-6">What to Expect</h2>
                            <div className="space-y-6">
                                {[
                                    "Detailed initial consultation (60-90 minutes)",
                                    "In-depth analysis of your physical and emotional history",
                                    "Custom-formulated remedies specific to your symptoms",
                                    "Regular follow-ups to monitor progression",
                                    "Support for chronic and acute conditions"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-soft-mint flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-accent-teal" />
                                        </div>
                                        <p className="text-cool-grey font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square bg-linear-to-br from-soft-mint to-white rounded-[3rem] border-2 border-deep-teal/5 flex items-center justify-center p-12 shadow-inner">
                                <Sparkles className="w-full h-full text-deep-teal/10" />
                                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                                    <p className="text-deep-teal font-serif italic text-2xl leading-relaxed">
                                        &quot;Similia Similibus Curentur&quot; <br />
                                        <span className="text-sm font-sans not-italic text-cool-grey uppercase tracking-widest mt-4 block">Let likes be cured by likes</span>
                                    </p>
                                </div>
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
                        className="bg-deep-teal rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-deep-teal/20"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start your healing journey?</h2>
                        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                            Connect with Dr. BND for a personalized classical homoeopathy session
                            designed for your unique constitution.
                        </p>

                        {user ? (
                            <Link href="/patient-dashboard">
                                <Button size="lg" className="bg-white text-deep-teal hover:bg-white/90 h-16 px-12 rounded-2xl text-xl font-bold group">
                                    Go to Dashboard
                                    <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <AppointmentModal>
                                    <Button size="lg" className="bg-white text-deep-teal hover:bg-white/90 h-16 px-12 rounded-2xl text-xl font-bold group">
                                        Book Now
                                        <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </AppointmentModal>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 h-16 px-12 rounded-2xl text-xl font-bold">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
