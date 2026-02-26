"use client"

import { motion } from "framer-motion"
import { Clock, CalendarCheck, Sun, Moon } from "lucide-react"

const schedule = [
    { day: "Monday - Saturday", time: "10:00 AM - 8:30 PM", icon: Sun, status: "Full Day" },
    { day: "Sunday", time: "10:00 AM - 1:00 PM", icon: Moon, status: "Half Day" },
]

export function Timings() {
    return (
        <section id="timings" className="py-24 bg-soft-mint/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-deep-teal/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-deep-teal/5 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-teal text-white text-xs md:text-sm font-semibold mb-6"
                        >
                            <CalendarCheck className="w-4 h-4" />
                            <span>Clinic Availability</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-6">
                            Plan Your Visit
                        </h2>
                        <p className="text-cool-grey text-lg mb-8 leading-relaxed max-w-lg">
                            We provide flexible timings to accommodate your busy schedule.
                            Dr. BND is available for both walk-ins and pre-booked appointments.
                        </p>

                        <div className="flex items-center gap-4 p-4 rounded-full bg-soft-mint text-deep-teal font-semibold border border-deep-teal/10">
                            <Clock className="w-6 h-6" />
                            <span>Urgent? Call: +91-8191919949</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        {schedule.map((item, index) => (
                            <motion.div
                                key={item.day}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-6 rounded-3xl bg-[#fafafa] border border-deep-teal/5 hover:border-accent-teal/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white border border-deep-teal/5 flex items-center justify-center text-deep-teal shadow-sm group-hover:bg-deep-teal group-hover:text-white transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-cool-grey font-medium uppercase tracking-wider">{item.day}</p>
                                        <p className="text-xl font-bold text-deep-teal">{item.time}</p>
                                    </div>
                                </div>
                                <div className={`hidden sm:block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${index === 0 ? "bg-accent-teal/10 text-accent-teal" : "bg-orange-100 text-orange-600"}`}>
                                    {item.status}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
