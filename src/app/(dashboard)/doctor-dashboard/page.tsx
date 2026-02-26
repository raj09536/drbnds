"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    LogOut,
    Clock,
    Loader2,
    LayoutDashboard,
    CheckCircle2,
    ShieldAlert,
    Plus,
    Trash2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"

interface Profile {
    full_name: string
    phone: string
}

interface Appointment {
    id: string
    appointment_date: string
    appointment_time: string
    mode: 'online_video' | 'online_audio' | 'offline_clinic'
    status: 'pending' | 'confirmed' | 'cancelled'
    profiles: Profile
}

interface BlockedSlot {
    id: string
    blocked_date: string
    time_slot: string
    reason: string
}

const TIME_OPTIONS = [
    "All Day",
    "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
]

export default function DoctorDashboard() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()

    // State
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
    const [loading, setLoading] = useState(true)
    const [, setActionLoading] = useState<string | null>(null)
    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        today: 0
    })

    // Blocking Form State
    const [blockDate, setBlockDate] = useState("")
    const [blockTime, setBlockTime] = useState("All Day")
    const [blockReason, setBlockReason] = useState("")

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true)

            // 1. Verify Role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user?.id)
                .single()

            if (profileError || profile?.role !== 'doctor') {
                router.push('/patient-dashboard')
                return
            }

            // 2. Fetch Appointments
            const { data: apptData, error: apptError } = await supabase
                .from('appointments')
                .select(`
                    *,
                    profiles!patient_id(full_name, phone)
                `)
                .order('appointment_date', { ascending: false })

            if (apptError) throw apptError
            const typedAppts = (apptData || []) as unknown as Appointment[]
            setAppointments(typedAppts)

            // 3. Fetch Blocked Slots
            const { data: blockData, error: blockError } = await supabase
                .from('blocked_slots')
                .select('*')
                .order('blocked_date', { ascending: true })

            if (blockError) throw blockError
            setBlockedSlots(blockData || [])

            // 4. Calculate Stats
            const todayStr = new Date().toISOString().split('T')[0]
            setStats({
                pending: typedAppts.filter(a => a.status === 'pending').length,
                confirmed: typedAppts.filter(a => a.status === 'confirmed').length,
                today: typedAppts.filter(a => a.appointment_date === todayStr).length
            })

        } catch (err: unknown) {
            const error = err as Error
            console.error("Doctor Dashboard Error:", error.message || error)
            toast.error("Failed to load dashboard data.")
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
    }, [user, authLoading, fetchDashboardData, router])

    const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
        try {
            setActionLoading(id)
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id)

            if (error) throw error

            toast.success(`Appointment ${status === 'confirmed' ? 'Confirmed' : 'Cancelled'}`)
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
        } catch {
            toast.error("Failed to update status")
        } finally {
            setActionLoading(null)
        }
    }

    const handleBlockSlot = async () => {
        if (!blockDate || !blockTime) {
            toast.error("Please select a date and time to block")
            return
        }

        try {
            setLoading(true)
            const { error } = await supabase
                .from('blocked_slots')
                .insert({
                    blocked_date: blockDate,
                    time_slot: blockTime,
                    reason: blockReason || 'Manual Block'
                })

            if (error) throw error

            toast.success("Availability Updated", { description: `Slot blocked for ${blockDate}` })
            setBlockDate("")
            setBlockReason("")
            fetchDashboardData()
        } catch {
            toast.error("Failed to block slot")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveBlock = async (id: string) => {
        try {
            const { error } = await supabase
                .from('blocked_slots')
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success("Block Removed")
            setBlockedSlots(prev => prev.filter(s => s.id !== id))
        } catch {
            toast.error("Failed to remove block")
        }
    }

    const handleLogout = async () => {
        await signOut()
        router.push("/")
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-mint/10">
                <Loader2 className="w-10 h-10 text-deep-teal animate-spin" />
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-[#FBFDFF]">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-deep-teal/5 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center group hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.jpeg"
                            alt="Dr. BND Clinic Logo"
                            width={160}
                            height={45}
                            className="object-contain h-10 w-auto"
                            priority
                        />
                        <span className="text-xl font-bold text-deep-teal tracking-tight ml-2">Admin</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-deep-teal/5 text-deep-teal border-deep-teal/10 px-3 py-1 rounded-full">
                            Doctor Portal
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-cool-grey hover:text-destructive gap-2 cursor-pointer transition-colors rounded-full"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10 max-w-7xl">
                <Tabs defaultValue="overview" className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">Workspace Overview</h1>
                            <p className="text-cool-grey leading-relaxed">Manage your patient appointments and schedules from your central control room.</p>
                        </div>
                        <TabsList className="bg-soft-mint/20 p-1 rounded-full h-14 border border-deep-teal/5">
                            <TabsTrigger value="overview" className="rounded-full px-8 h-full data-[state=active]:bg-deep-teal data-[state=active]:text-white transition-all cursor-pointer">
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
                            </TabsTrigger>
                            <TabsTrigger value="availability" className="rounded-full px-8 h-full data-[state=active]:bg-deep-teal data-[state=active]:text-white transition-all cursor-pointer">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Availability
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-10 mt-0">
                        {/* Stats */}
                        <motion.div initial="hidden" animate="visible" className="grid sm:grid-cols-3 gap-6">
                            {[
                                { label: "Pending Requests", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
                                { label: "Confirmed Today", value: stats.today, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
                                { label: "Total Confirmed", value: stats.confirmed, icon: LayoutDashboard, color: "text-deep-teal bg-soft-mint/30" }
                            ].map((stat, i) => (
                                <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all cursor-default">
                                    <CardContent className="p-8 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-cool-grey uppercase tracking-widest mb-1">{stat.label}</p>
                                            <h3 className="text-4xl font-black text-deep-teal">{stat.value}</h3>
                                        </div>
                                        <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", stat.color)}>
                                            <stat.icon className="w-7 h-7" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>

                        {/* Appointments Table */}
                        <Card className="border-0 shadow-xl shadow-deep-teal/3 rounded-3xl bg-white overflow-hidden">
                            <CardHeader className="p-8">
                                <CardTitle className="text-2xl font-bold text-deep-teal">Appointments</CardTitle>
                                <CardDescription>Manage your detailed patient schedule</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-[#fafafa]">
                                        <TableRow className="hover:bg-transparent px-8">
                                            <TableHead className="px-8 py-4">Patient</TableHead>
                                            <TableHead className="px-8 py-4">Date & Time</TableHead>
                                            <TableHead className="px-8 py-4 text-center">Mode</TableHead>
                                            <TableHead className="px-8 py-4 text-center">Status</TableHead>
                                            <TableHead className="px-8 py-4 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appointments.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="h-32 text-center text-cool-grey">No appointments yet.</TableCell></TableRow>
                                        ) : (
                                            appointments.map((appt) => (
                                                <TableRow key={appt.id} className="hover:bg-soft-mint/10 px-8">
                                                    <TableCell className="px-8 py-4 font-bold text-deep-teal">{appt.profiles?.full_name}</TableCell>
                                                    <TableCell className="px-8 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{appt.appointment_date}</span>
                                                            <span className="text-xs text-cool-grey">{appt.appointment_time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-4 text-center">
                                                        <Badge variant="outline" className="capitalize rounded-full">{appt.mode.replace('_', ' ')}</Badge>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-4 text-center">
                                                        <Badge className={cn(
                                                            "capitalize rounded-full",
                                                            appt.status === 'pending' && "bg-amber-100 text-amber-700 hover:bg-amber-100",
                                                            appt.status === 'confirmed' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                                                            appt.status === 'cancelled' && "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                                        )}>
                                                            {appt.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-4 text-right">
                                                        {appt.status === 'pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" onClick={() => updateStatus(appt.id, 'confirmed')} className="bg-deep-teal h-8 cursor-pointer hover:bg-deep-teal/90 transition-all rounded-full px-4">Confirm</Button>
                                                                <Button size="sm" onClick={() => updateStatus(appt.id, 'cancelled')} variant="outline" className="h-8 border-rose-200 text-rose-600 cursor-pointer hover:bg-rose-50 transition-all rounded-full px-4">Cancel</Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="availability" className="space-y-10 mt-0">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Block Form */}
                            <Card className="md:col-span-1 border-0 shadow-xl rounded-3xl bg-white h-fit">
                                <CardHeader className="p-8">
                                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-4">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <CardTitle>Block Availability</CardTitle>
                                    <CardDescription>Mark holidays or specific busy slots</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-sage-green">Date</label>
                                        <Input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="rounded-full border-deep-teal/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-sage-green">Time Slot</label>
                                        <Select value={blockTime} onValueChange={setBlockTime}>
                                            <SelectTrigger className="rounded-full border-deep-teal/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-sage-green">Reason</label>
                                        <Input placeholder="Personal/Holiday/Surgery..." value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="rounded-full border-deep-teal/10" />
                                    </div>
                                    <Button onClick={handleBlockSlot} className="w-full bg-deep-teal h-12 rounded-full shadow-lg shadow-deep-teal/10 cursor-pointer hover:bg-deep-teal/90 transition-all">
                                        <Plus className="w-4 h-4 mr-2" /> Block Slot
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Block List */}
                            <Card className="md:col-span-2 border-0 shadow-xl rounded-3xl bg-white overflow-hidden">
                                <CardHeader className="p-8">
                                    <CardTitle>Currently Blocked</CardTitle>
                                    <CardDescription>Upcoming dates with restrictions</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-[#fafafa]">
                                            <TableRow>
                                                <TableHead className="px-8">Date</TableHead>
                                                <TableHead>Time Slot</TableHead>
                                                <TableHead>Reason</TableHead>
                                                <TableHead className="text-right px-8">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {blockedSlots.length === 0 ? (
                                                <TableRow><TableCell colSpan={4} className="h-32 text-center text-cool-grey">Your schedule is fully open.</TableCell></TableRow>
                                            ) : (
                                                blockedSlots.map((slot) => (
                                                    <TableRow key={slot.id}>
                                                        <TableCell className="px-8 py-4 font-bold text-deep-teal">{slot.blocked_date}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={slot.time_slot === "All Day" ? "default" : "outline"} className={cn("rounded-full", slot.time_slot === "All Day" ? "bg-rose-500 hover:bg-rose-500" : "")}>
                                                                {slot.time_slot}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-cool-grey text-sm italic">{slot.reason}</TableCell>
                                                        <TableCell className="text-right px-8">
                                                            <Button size="sm" variant="ghost" onClick={() => handleRemoveBlock(slot.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
