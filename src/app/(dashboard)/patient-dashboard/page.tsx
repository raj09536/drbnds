"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import {
    Calendar,
    LogOut,
    Plus,
    Clock,
    Video,
    MapPin,
    User,
    ChevronRight,
    Loader2,
    LayoutDashboard,
    AlertCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { AppointmentModal } from "@/components/AppointmentModal"

interface Profile {
    full_name: string
    role: string
}

interface Appointment {
    id: string
    appointment_date: string
    appointment_time: string
    mode: 'online_video' | 'online_audio' | 'offline_clinic'
    status: 'pending' | 'confirmed' | 'cancelled'
}

export default function PatientDashboard() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [, setError] = useState<string | null>(null)
    const [greeting, setGreeting] = useState("Welcome")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good Morning")
        else if (hour < 17) setGreeting("Good Afternoon")
        else setGreeting("Good Evening")
    }, [])

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true)

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("full_name, role")
                .eq("id", user?.id)
                .maybeSingle()

            if (profileError) throw profileError

            if (!profileData) {
                // If profile is missing, we shouldn't allow dashboard access
                throw new Error("Profile not found. Please re-login or contact support.")
            }

            if (profileData?.role === 'doctor') {
                router.push('/doctor-dashboard')
                return
            }

            setProfile(profileData)

            // Fetch Appointments
            const { data: appointmentsData, error: apptError } = await supabase
                .from("appointments")
                .select("*")
                .eq("patient_id", user?.id)
                .order("appointment_date", { ascending: true })

            if (apptError) throw apptError
            setAppointments(appointmentsData || [])

        } catch (err: unknown) {
            const error = err as Error
            console.error("Dashboard Fetch Error:", error.message || JSON.stringify(error))
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [user, router])

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }

        if (user) {
            fetchDashboardData()
        }
    }, [user, authLoading, router, fetchDashboardData])

    const handleLogout = async () => {
        await signOut()
        router.push("/")
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-mint/20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-deep-teal animate-spin" />
                    <p className="text-sage-green font-medium animate-pulse">Healing starts here...</p>
                </div>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    return (
        <div className="min-h-screen bg-[#FBFDFF]">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full border-b border-deep-teal/5 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center group hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/logo.jpeg"
                            alt="Dr. BND's Clinic"
                            width={160}
                            height={45}
                            className="object-contain h-9 w-auto"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-soft-mint/50 text-deep-teal border-deep-teal/10 px-3 py-1 rounded-full">
                            Patient Portal
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-cool-grey hover:text-destructive gap-2 rounded-full"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10 max-w-6xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    {/* Welcome Banner */}
                    <motion.div variants={itemVariants}>
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-deep-teal to-accent-teal p-8 md:p-12 text-white shadow-2xl shadow-deep-teal/10">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className="text-white/60 font-semibold tracking-widest uppercase text-xs">{greeting}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                                        {profile?.full_name?.split(' ')[0] || 'User'}
                                    </h1>
                                    <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                                        Step into your sanctuary of wellness. Manage your journey with ease and clarity.
                                    </p>
                                </div>
                                <AppointmentModal onSuccess={fetchDashboardData}>
                                    <Button className="bg-white text-deep-teal hover:bg-soft-mint h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-black/10 transition-all hover:-translate-y-1 active:scale-95 group cursor-pointer">
                                        <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                        Book Appointment
                                    </Button>
                                </AppointmentModal>
                            </div>

                            {/* Decorative background patterns */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-teal/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Dashboard Content */}
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Stats/Quick Access */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
                            <Card className="border-deep-teal/5 bg-white shadow-sm overflow-hidden rounded-3xl">
                                <CardHeader className="bg-soft-mint/20 pb-4">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-deep-teal">
                                        <div className="w-8 h-8 rounded-full bg-deep-teal/10 flex items-center justify-center">
                                            <LayoutDashboard className="w-4 h-4" />
                                        </div>
                                        Dashboard Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-3xl bg-[#fafafa] border border-transparent hover:border-deep-teal/5 transition-colors">
                                        <span className="text-sage-green font-bold text-sm">Active Appointments</span>
                                        <span className="text-deep-teal font-black text-xl">{appointments.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-3xl bg-[#fafafa] border border-transparent hover:border-deep-teal/5 transition-colors">
                                        <span className="text-sage-green font-bold text-sm">Account Status</span>
                                        <Badge className="bg-emerald-500 text-white border-0 px-3 font-bold">Verified</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 bg-soft-mint shadow-none rounded-3xl p-4">
                                <CardContent className="pt-4 flex flex-col items-center text-center space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-deep-teal shadow-sm">
                                        <AlertCircle className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-deep-teal text-lg">Need Assistance?</h4>
                                        <p className="text-sm text-sage-green mt-1">Our clinic concierge is available for any queries.</p>
                                    </div>
                                    <Button
                                        onClick={() => toast.info("Clinic Support", {
                                            description: "Call: +91-8191919949, 9997954989 or Email: drbndclinic@gmail.com",
                                            duration: 6000,
                                        })}
                                        variant="outline"
                                        className="w-full h-12 rounded-full border-white/40 bg-white/20 text-deep-teal hover:bg-white hover:text-deep-teal font-bold transition-all cursor-pointer"
                                    >
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Appointments Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-deep-teal flex items-center gap-3">
                                    Recent Schedules
                                    <span className="px-3 py-1 bg-soft-mint text-deep-teal rounded-full text-xs font-black">
                                        {appointments.length}
                                    </span>
                                </h2>
                                <Button variant="ghost" className="text-accent-teal hover:text-deep-teal font-bold gap-2">
                                    History <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <AnimatePresence mode="wait">
                                {appointments.length > 0 ? (
                                    <div className="grid gap-6">
                                        {appointments.map((appt) => (
                                            <motion.div
                                                key={appt.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group"
                                            >
                                                <Card className="border-deep-teal/5 hover:border-accent-teal/20 hover:shadow-2xl hover:shadow-deep-teal/5 transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl bg-white">
                                                    <CardContent className="p-0 flex flex-col sm:flex-row">
                                                        <div className="p-6 flex-1 flex flex-col sm:flex-row items-center gap-8">
                                                            <div className="w-20 h-20 rounded-3xl bg-soft-mint flex flex-col items-center justify-center text-deep-teal border border-deep-teal/5 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                                                <span className="text-xs uppercase font-black opacity-40">
                                                                    {new Date(appt.appointment_date).toLocaleString('default', { month: 'short' })}
                                                                </span>
                                                                <span className="text-3xl font-black">{new Date(appt.appointment_date).getDate()}</span>
                                                            </div>

                                                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                                                    <h3 className="font-black text-xl text-deep-teal">Private Consultation</h3>
                                                                    <Badge
                                                                        className={cn(
                                                                            "capitalize rounded-full px-4 border-0 font-bold",
                                                                            appt.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" :
                                                                                appt.status === 'pending' ? "bg-amber-100 text-amber-700" :
                                                                                    "bg-rose-100 text-rose-700"
                                                                        )}
                                                                    >
                                                                        {appt.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sage-green">
                                                                    <span className="flex items-center gap-2 text-sm font-bold bg-[#fafafa] px-3 py-1.5 rounded-lg border border-deep-teal/5">
                                                                        <Clock className="w-4 h-4" />
                                                                        {appt.appointment_time}
                                                                    </span>
                                                                    <span className="flex items-center gap-2 text-sm font-bold bg-[#fafafa] px-3 py-1.5 rounded-lg border border-deep-teal/5">
                                                                        {appt.mode.includes('online') ? (
                                                                            <><Video className="w-4 h-4" /> Virtual Hub</>
                                                                        ) : (
                                                                            <><MapPin className="w-4 h-4" /> Clinic Sanctuary</>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-soft-mint/20 sm:w-16 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-deep-teal/5 group-hover:bg-deep-teal group-hover:text-white transition-all duration-500">
                                                            <ChevronRight className="w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-20 px-10 rounded-[3rem] bg-white border-2 border-dashed border-deep-teal/10 relative overflow-hidden group hover:border-accent-teal/30 transition-colors"
                                    >
                                        <div className="relative z-10">
                                            <div className="w-24 h-24 bg-soft-mint rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-6 transition-transform shadow-xl shadow-deep-teal/5">
                                                <Calendar className="w-12 h-12 text-deep-teal" />
                                            </div>
                                            <h3 className="text-3xl font-black text-deep-teal mb-3">Begin Your Healing</h3>
                                            <p className="text-sage-green mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                                                You haven&apos;t scheduled any consultations yet. Your first dedicated session is just a click away.
                                            </p>
                                            <AppointmentModal onSuccess={fetchDashboardData}>
                                                <Button variant="premium-glow" className="h-16 px-12 text-lg hover:scale-105 transition-transform active:scale-95 shadow-2xl shadow-deep-teal/20">
                                                    Start Your Journey
                                                </Button>
                                            </AppointmentModal>
                                        </div>
                                        {/* Abstract background blobs for empty state */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-soft-mint/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
