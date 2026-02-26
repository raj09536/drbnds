"use client"

import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"

export function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,77,77,0.05)_0%,rgba(252,250,242,1)_100%)]" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-soft-mint mix-blend-multiply opacity-20 blur-3xl -z-10"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-20 left-[5%] w-120 h-120 rounded-full bg-deep-teal/5 mix-blend-multiply opacity-20 blur-3xl -z-10"
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-6 text-center max-w-5xl"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-mint text-deep-teal text-xs md:text-sm font-semibold mb-8 border border-deep-teal/10 shadow-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Holistic Path to Modern Wellness</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-deep-teal mb-6 leading-[1.1] md:leading-[1.1] tracking-tight"
                >
                    Healing for the <br />
                    <span className="text-accent-teal italic font-serif">Mind & Body</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-cool-grey mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Experience the synergy of classical Homoeopathy and compassionate Psychotherapy.
                    Dr. BND&apos;s clinic provides a sanctuary for deep, lasting recovery and mental
                    clarity in Dehradun.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <AppointmentModal>
                        <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg group cursor-pointer">
                            Book a Consultation
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </AppointmentModal>
                    <Link href="#services" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full h-14 px-10 text-lg cursor-pointer">
                            Explore Services
                        </Button>
                    </Link>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-deep-teal/20 flex justify-center pt-2"
                    >
                        <div className="w-1 h-2 rounded-full bg-deep-teal/40" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
