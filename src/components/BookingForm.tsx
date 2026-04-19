"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Video,
    MapPin,
    Check,
    ChevronRight,
    Loader2,
    ArrowLeft,
    Phone,
    ShieldAlert,
    XCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BookingFormProps {
    onSuccess: () => void
    onClose: () => void
}

const TIME_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
]

export function BookingForm({ onSuccess, onClose }: BookingFormProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [doctorId, setDoctorId] = useState<string | null>(null)

    // Form State
    const [mode, setMode] = useState<'online_video' | 'online_audio' | 'offline_clinic' | null>(null)
    const [date, setDate] = useState<string>("")
    const [time, setTime] = useState<string>("")
    const [disabledSlots, setDisabledSlots] = useState<string[]>([])
    const [isAllDayBlocked, setIsAllDayBlocked] = useState(false)
    const [fetchingSlots, setFetchingSlots] = useState(false)

    useEffect(() => {
        // Fetch a doctor ID to assign the appointment to
        const fetchDoctor = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'doctor')
                .limit(1)
                .single()

            if (data) setDoctorId(data.id)
            if (error) console.error("Error fetching doctor:", error)
        }
        fetchDoctor()
    }, [])

    useEffect(() => {
        if (!date) return

        const fetchAvailability = async () => {
            try {
                setFetchingSlots(true)
                setIsAllDayBlocked(false)
                setDisabledSlots([])

                // 1. Fetch Existing Appointments
                const { data: appts, error: apptError } = await supabase
                    .from('appointments')
                    .select('appointment_time')
                    .eq('appointment_date', date)
                    .neq('status', 'cancelled')

                // 2. Fetch Blocked Slots
                const { data: blocks, error: blockError } = await supabase
                    .from('blocked_slots')
                    .select('time_slot')
                    .eq('blocked_date', date)

                if (apptError) throw apptError
                if (blockError) throw blockError

                const newlyDisabled = [
                    ...(appts?.map(a => a.appointment_time) || []),
                    ...(blocks?.filter(b => b.time_slot !== 'All Day').map(b => b.time_slot) || [])
                ]

                const hasAllDay = blocks?.some(b => b.time_slot === 'All Day')

                setDisabledSlots(newlyDisabled)
                setIsAllDayBlocked(!!hasAllDay)

            } catch (err) {
                console.error("Availability Fetch Error:", err)
                toast.error("Failed to check availability")
            } finally {
                setFetchingSlots(false)
            }
        }

        fetchAvailability()
    }, [date])

    const handleSubmit = async () => {
        // Validation check
        if (!mode || !date || !time) {
            toast.error("Please complete all sections of the form.")
            return
        }

        try {
            setLoading(true)

            // Re-fetch user to ensure active session
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                toast.error("Your session has expired. Please login again.")
                return
            }

            const { error: insertError } = await supabase
                .from('appointments')
                .insert({
                    patient_id: user.id,
                    doctor_id: doctorId, // Use the fetched doctorId (may be null if 1-doctor clinic logic applies)
                    appointment_date: date,
                    appointment_time: time,
                    mode: mode,
                    status: 'pending'
                })

            if (insertError) {
                console.error("Supabase Insert Error:", insertError)
                throw insertError
            }

            toast.success("Appointment Booked Successfully!", {
                description: `Your session for ${time} on ${new Date(date).toLocaleDateString()} is confirmed.`
            })

            onSuccess()
            onClose()
        } catch (err: unknown) {
            const error = err as Error
            console.error("Booking Submission Error:", error)
            toast.error("Booking Failed", {
                description: error.message || "An unexpected error occurred. Please try again."
            })
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    // Helper for date formatting (next 14 days)
    const getAvailableDates = () => {
        const dates = []
        for (let i = 1; i <= 14; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i)
            dates.push(d.toISOString().split('T')[0])
        }
        return dates
    }

    return (
        <div className="p-0 overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 sm:p-8"
                    >
                        <h2 className="text-2xl font-bold text-deep-teal mb-2">Select Consultation Type</h2>
                        <p className="text-cool-grey mb-8">Choose how you&apos;d like to connect with Dr. BND.</p>

                        <div className="grid gap-4">
                            {[
                                { id: 'offline_clinic', icon: MapPin, label: 'Clinic Visit', desc: 'In-person at Dehradun' },
                                { id: 'online_video', icon: Video, label: 'Video Call', desc: 'Face-to-face virtual session' },
                                { id: 'online_audio', icon: Phone, label: 'Audio Call', desc: 'Voice-only consultation' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setMode(item.id as 'online_video' | 'online_audio' | 'offline_clinic'); nextStep(); }}
                                    className={cn(
                                        "flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left group cursor-pointer",
                                        mode === item.id
                                            ? "border-accent-teal bg-soft-mint/20 shadow-lg shadow-accent-teal/5"
                                            : "border-deep-teal/5 hover:border-accent-teal/30 bg-white"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                        mode === item.id ? "bg-accent-teal text-white" : "bg-soft-mint text-deep-teal"
                                    )}>
                                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-deep-teal truncate">{item.label}</div>
                                        <div className="text-xs sm:text-sm text-cool-grey truncate">{item.desc}</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-cool-grey group-hover:translate-x-1 transition-transform shrink-0" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 sm:p-8"
                    >
                        <button onClick={prevStep} className="flex items-center gap-2 text-deep-teal mb-6 font-semibold hover:opacity-70 transition-opacity">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <h2 className="text-2xl font-bold text-deep-teal mb-6">Pick Date & Time</h2>

                        <div className="space-y-8">
                            {/* Date Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-sage-green">Select Date</label>
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                                    {getAvailableDates().map((d) => {
                                        const dateObj = new Date(d)
                                        const isSelected = date === d
                                        return (
                                            <button
                                                key={d}
                                                onClick={() => setDate(d)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center min-w-[64px] sm:min-w-[70px] h-20 rounded-2xl border-2 transition-all shrink-0 cursor-pointer",
                                                    isSelected
                                                        ? "border-deep-teal bg-deep-teal text-white shadow-xl"
                                                        : "border-deep-teal/5 bg-white text-deep-teal hover:border-deep-teal/20"
                                                )}
                                            >
                                                <span className="text-[10px] uppercase font-bold opacity-60">
                                                    {dateObj.toLocaleString('default', { weekday: 'short' })}
                                                </span>
                                                <span className="text-lg sm:text-xl font-black">{dateObj.getDate()}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-sage-green">
                                    {isAllDayBlocked ? "No Slots Available" : "Select Time"}
                                </label>

                                {isAllDayBlocked ? (
                                    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                                        <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                                        <p className="text-rose-600 font-bold">Doctor is unavailable on this date.</p>
                                        <p className="text-rose-400 text-xs">Please select another date.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {TIME_SLOTS.map((t) => {
                                            const isSelected = time === t
                                            const isDisabled = disabledSlots.includes(t)

                                            return (
                                                <button
                                                    key={t}
                                                    disabled={isDisabled || fetchingSlots}
                                                    onClick={() => setTime(t)}
                                                    className={cn(
                                                        "py-3 rounded-xl border-2 text-sm font-bold transition-all relative overflow-hidden",
                                                        isSelected
                                                            ? "border-accent-teal bg-accent-teal text-white shadow-lg cursor-pointer"
                                                            : isDisabled
                                                                ? "border-deep-teal/5 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                                                                : "border-deep-teal/5 bg-[#fafafa] text-deep-teal hover:border-accent-teal/30 cursor-pointer"
                                                    )}
                                                >
                                                    {t}
                                                    {isDisabled && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                                            <XCircle className="w-8 h-8 rotate-12" />
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}

                                {fetchingSlots && (
                                    <div className="flex items-center justify-center gap-2 text-sage-green text-xs font-bold animate-pulse">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Updating availability...
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 rounded-2xl mt-12 bg-deep-teal hover:bg-deep-teal/90 text-white font-bold text-lg shadow-xl shadow-deep-teal/20"
                            disabled={!date || !time || loading}
                            onClick={nextStep}
                        >
                            Review Appointment
                        </Button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 sm:p-8 text-center"
                    >
                        <div className="w-20 h-20 bg-soft-mint rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-deep-teal" />
                        </div>
                        <h2 className="text-3xl font-black text-deep-teal mb-2">Final Review</h2>
                        <p className="text-sage-green mb-8 text-sm sm:text-base">Please confirm your appointment details.</p>

                        <div className="bg-[#fafafa] rounded-[2rem] p-5 sm:p-6 border border-deep-teal/5 text-left space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-4 border-b border-deep-teal/5 gap-2">
                                <span className="text-cool-grey font-medium text-sm sm:text-base">Consultation</span>
                                <Badge className="bg-deep-teal text-white capitalize whitespace-nowrap">{mode?.replace('_', ' ')}</Badge>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-deep-teal/5 gap-2">
                                <span className="text-cool-grey font-medium text-sm sm:text-base">Date</span>
                                <span className="text-deep-teal font-bold text-sm sm:text-base text-right">{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-cool-grey font-medium text-sm sm:text-base">Time Slot</span>
                                <span className="text-deep-teal font-bold text-sm sm:text-base">{time}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button
                                variant="outline"
                                className="w-full sm:flex-1 h-14 rounded-2xl border-deep-teal/10 font-bold order-2 sm:order-1 cursor-pointer transition-all hover:bg-gray-50"
                                onClick={prevStep}
                                disabled={loading}
                            >
                                Change
                            </Button>
                            <Button
                                className="w-full sm:flex-2 h-14 rounded-2xl bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-lg shadow-xl shadow-accent-teal/20 order-1 sm:order-2 cursor-pointer transition-all active:scale-95"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Book"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
