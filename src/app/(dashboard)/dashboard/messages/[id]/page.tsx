"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopBar } from "@/components/dashboard/TopBar"
import { supabase } from "@/lib/supabase"
import { useDoctor } from "@/hooks/useDoctor"

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

export default function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { doctor, loading } = useDoctor()
    const router = useRouter()
    const [message, setMessage] = useState<Message | null>(null)
    const [loadingMsg, setLoadingMsg] = useState(true)

    useEffect(() => {
        if (!loading && !doctor) {
            router.push('/login')
            return
        }
        if (doctor) {
            fetchMessage()
        }
    }, [doctor, loading, id])

    const fetchMessage = async () => {
        setLoadingMsg(true)
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .eq('id', id)
            .single()

        if (data) {
            setMessage(data)
            if (!data.is_read) {
                await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
            }
        }
        setLoadingMsg(false)
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to mark this complete and remove it?")) return
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
        if (!error) router.push('/dashboard/messages')
    }

    if (loading || loadingMsg) return <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">🌿 Loading...</div>
    if (!doctor || !message) return null

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex">
            <Sidebar />
            <div className="flex-1 lg:ml-[240px] flex flex-col h-screen overflow-hidden">
                <DashboardTopBar title="Message Details" breadcrumb="Dashboard / Messages / Detail" doctor={doctor} />

                <main className="flex-1 overflow-y-auto bg-[#f9fafb]">
                    <div className="max-w-4xl mx-auto p-4 md:p-8">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/dashboard/messages')}
                            className="bg-transparent border-none text-forest font-bold mb-6 flex items-center gap-2 cursor-pointer hover:opacity-70"
                        >
                            ← Back to Messages
                        </button>

                        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
                            {/* Header */}
                            <div className="p-8 border-b border-black/5 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-forest/10">
                                    {message.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>{message.name}</h2>
                                    <p className="text-sm text-gray-400 font-medium mt-1">
                                        Received on {new Date(message.created_at).toLocaleDateString('en-IN', {
                                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info Grid */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#fafafa]">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                                    <a href={`tel:${message.phone}`} className="text-lg font-bold text-forest no-underline hover:underline block">{message.phone}</a>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                                    <a href={`mailto:${message.email}`} className="text-lg font-bold text-forest no-underline hover:underline block">{message.email}</a>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="p-8">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-4">Message Body</p>
                                <div className="bg-[#fcfcfc] p-6 rounded-xl border border-black/5">
                                    <p className="text-[16px] text-gray-700 leading-[1.8] whitespace-pre-wrap font-medium">
                                        {message.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-8 bg-white border-t border-black/5 flex flex-wrap gap-3">
                                <a
                                    href={`tel:${message.phone}`}
                                    className="px-8 py-3 bg-forest text-white rounded-xl text-center text-sm font-bold shadow-lg shadow-forest/10 transition-all hover:-translate-y-0.5 no-underline flex items-center gap-2"
                                >
                                    📞 Call Patient
                                </a>
                                <a
                                    href={`mailto:${message.email}`}
                                    className="px-8 py-3 border border-forest text-forest rounded-xl text-center text-sm font-bold transition-all hover:bg-forest/5 no-underline flex items-center gap-2"
                                >
                                    📧 Send Email
                                </a>
                                <button
                                    onClick={handleDelete}
                                    className="px-8 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm font-bold cursor-pointer transition-all hover:bg-gray-50 ml-auto flex items-center gap-2"
                                >
                                    ✓ Mark Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
