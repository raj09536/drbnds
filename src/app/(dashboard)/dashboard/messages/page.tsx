"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Message {
    id: string
    name: string
    email: string
    phone: string
    clinic_name: string
    message: string
    clinic_id: number
    is_read: boolean
    created_at: string
}

const AVATAR_COLORS = [
    { bg: "#e6f4ec", text: "#2d7a4f" }, // forest
    { bg: "#f0fdf4", text: "#166534" }, // sage
    { bg: "#fef3e2", text: "#b45309" }, // gold
    { bg: "#f3f0ff", text: "#7c3aed" }, // purple
    { bg: "#fdf2f8", text: "#be185d" }, // rose
]

export default function MessagesPage() {
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState("all")
    const [loadingMessages, setLoadingMessages] = useState(true)

    const fetchMessages = useCallback(async () => {
        if (!doctor) return
        setLoadingMessages(true)
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('clinic_id', doctor.clinic_id)
            .order('created_at', { ascending: false })
        setMessages(data || [])
        setLoadingMessages(false)
    }, [doctor])

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) fetchMessages()

        // Realtime
        const channel = supabase
            .channel(`clinic-msgs-${doctor?.clinic_id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages', filter: `clinic_id=eq.${doctor?.clinic_id}` },
                () => fetchMessages())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [doctor, loading, router, fetchMessages])

    const selectMessage = async (msg: Message) => {
        setSelectedId(msg.id)
        if (!msg.is_read) {
            await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
        }
    }

    const filteredMessages = messages.filter(m => {
        if (filter === "unread") return !m.is_read
        if (filter === "read") return m.is_read
        return true
    })

    const selectedMsg = messages.find(m => m.id === selectedId)

    if (loading) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">🌿 Loading...</div>
    if (!doctor) return null

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex">
            <Sidebar />
            <div className="flex-1 lg:ml-[240px] flex flex-col h-screen overflow-hidden">
                <DashboardTopBar title="Messages" breadcrumb="Dashboard / Messages" doctor={doctor} />

                <main className="flex-1 flex overflow-hidden">
                    {/* Left Column: List */}
                    <div className="w-full border-r border-black/5 bg-white flex flex-col h-full">
                        <div className="p-4 border-bottom border-black/5">
                            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                {["all", "unread", "read"].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className="flex-1 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all"
                                        style={{
                                            background: filter === f ? "white" : "transparent",
                                            color: filter === f ? "var(--forest)" : "#6b7280",
                                            boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredMessages.map((msg, idx) => {
                                const color = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                                const isSelected = selectedId === msg.id
                                const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                return (
                                    <div
                                        key={msg.id}
                                        onClick={() => router.push(`/dashboard/messages/${msg.id}`)}
                                        className={`p-4 border-b border-black/5 cursor-pointer transition-all hover:bg-gray-50 flex items-start gap-3 relative ${isSelected ? 'bg-gray-50' : ''}`}
                                    >
                                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-forest" />}
                                        <div
                                            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                                            style={{ background: color.bg, color: color.text }}
                                        >
                                            {msg.name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className={`text-[13px] truncate ${!msg.is_read ? 'font-bold text-black' : 'font-semibold text-gray-700'}`}>{msg.name}</h4>
                                                <span className="text-[10px] text-gray-400 font-medium">{time}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-400 truncate leading-tight">{msg.message}</p>
                                        </div>
                                        {!msg.is_read && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-gold mt-2 shrink-0 border-2 border-white" />
                                        )}
                                    </div>
                                )
                            })}
                            {filteredMessages.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                    <div className="text-4xl mb-2">📬</div>
                                    <p className="text-xs font-bold">No messages found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
