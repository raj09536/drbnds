"use client"

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import { Award, BookOpen, Quote } from "lucide-react"

export function DoctorSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    }

    return (
        <section id="about" className="py-24 bg-soft-mint/30 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-deep-teal/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Left Side: Photo Placeholder */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="relative aspect-4/5 md:aspect-square max-w-md mx-auto">
                            {/* Decorative frame */}
                            <div className="absolute inset-0 bg-deep-teal rounded-[3rem] rotate-3 transition-transform group-hover:rotate-6 duration-500" />

                            {/* Main Image Container */}
                            <div className="absolute inset-0 bg-white rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2 duration-500">
                                <Image
                                    src="/doctor.jpeg"
                                    alt="Dr. B. N. Dwivedy"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Glassmorphism Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-3xl bg-black/20 backdrop-blur-md border border-white/30 text-white">
                                    <p className="text-sm font-medium">Expert in Classical Homoeopathy</p>
                                    <p className="text-xs opacity-80">& Clinical Psychotherapy</p>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 border border-deep-teal/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center text-deep-teal text-xl font-bold">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-deep-teal font-bold leading-none">25+ Years</p>
                                    <p className="text-[10px] text-cool-grey font-medium uppercase tracking-wider">Experience</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side: Bio */}
                    <div className="space-y-8">
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal text-xs font-bold tracking-widest uppercase mb-4">
                                <BookOpen className="w-4 h-4" />
                                <span>Meet Your Healer</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6 leading-tight">
                                Dr. B. N. Dwivedy
                            </h2>
                            <div className="relative">
                                <Quote className="absolute -top-4 -left-6 w-12 h-12 text-accent-teal/10 -scale-x-100" />
                                <p className="text-xl text-cool-grey leading-relaxed italic pr-4">
                                    &quot;True healing begins when we address both the physical symptoms and the emotional landscape.
                                    My mission is to restore balance and vitality through a compassionate, holistic approach.&quot;
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-6">
                            <p className="text-lg text-cool-grey leading-relaxed">
                                With over two decades of experience, Dr. Dwivedy has pioneered an integrated model of healthcare
                                that bridges the gap between homoeopathic medicine and modern psychological counseling.
                                His practice in Dehradun is known for its empathetic environment where every patient&apos;s
                                personal journey is respected and understood.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6 pt-4">
                                <div className="p-4 rounded-3xl bg-white border border-deep-teal/5 shadow-sm">
                                    <h4 className="font-bold text-deep-teal mb-2">Homoeopathy</h4>
                                    <p className="text-sm text-cool-grey leading-snug">Classical protocols for chronic and acute ailments with a focus on long-term immunity.</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-white border border-deep-teal/5 shadow-sm">
                                    <h4 className="font-bold text-deep-teal mb-2">Psychotherapy</h4>
                                    <p className="text-sm text-cool-grey leading-snug">Cognitive and behavioral support to manage stress, anxiety, and emotional transitions.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
