"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Phone, ChevronDown, ChevronUp, X, Package } from "lucide-react"

type OrderStatus = 'pending' | 'packed' | 'delivered' | 'cancelled'
type PaymentType = 'cod' | 'upi'
type FilterTab = 'all' | OrderStatus

interface OrderItem {
    id: string
    product_name: string
    quantity: number
    price: number
}

interface Order {
    id: string
    order_number: string
    customer_name: string
    customer_phone: string
    delivery_address: string
    payment_type: PaymentType
    payment_status: string
    order_status: OrderStatus
    subtotal: number
    delivery_charge: number
    total: number
    upi_screenshot_url?: string
    notes?: string
    created_at: string
    order_items: OrderItem[]
}

const STATUS_OPTS: OrderStatus[] = ['pending', 'packed', 'delivered', 'cancelled']
const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    packed: 'bg-blue-50 text-blue-700 border-blue-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterTab>('all')
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [screenshotModal, setScreenshotModal] = useState<string | null>(null)
    const [deliveryCharge, setDeliveryCharge] = useState<Record<string, string>>({})

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false })
        setOrders((data as Order[]) || [])
        setLoading(false)
    }

    useEffect(() => { fetchOrders() }, [])

    const today = new Date().toDateString()
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today)
    const pendingCount = orders.filter(o => o.order_status === 'pending').length
    const deliveredToday = todayOrders.filter(o => o.order_status === 'delivered').length

    const filtered = filter === 'all' ? orders : orders.filter(o => o.order_status === filter)

    const toggleExpand = (id: string) => {
        setExpanded(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const updateStatus = async (id: string, status: OrderStatus) => {
        const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id)
        if (error) { toast.error(error.message); return }
        setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o))
        toast.success(`Status updated to ${status}`)
    }

    const updateDeliveryCharge = async (order: Order) => {
        const charge = Number(deliveryCharge[order.id] || 0)
        const newTotal = order.subtotal + charge
        const { error } = await supabase.from('orders').update({ delivery_charge: charge, total: newTotal }).eq('id', order.id)
        if (error) { toast.error(error.message); return }
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, delivery_charge: charge, total: newTotal } : o))
        setDeliveryCharge(prev => ({ ...prev, [order.id]: '' }))
        toast.success('Delivery charge updated')
    }

    return (
        <div>
            <h1 className="font-bold text-[#1a3a2a] mb-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Manage Orders</h1>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Today\'s Orders', value: todayOrders.length, color: 'text-[#1a3a2a]' },
                    { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
                    { label: 'Delivered Today', value: deliveredToday, color: 'text-green-600' },
                ].map(card => (
                    <div key={card.label} className="bg-white rounded-2xl border border-[#1a3a2a08] p-4 text-center">
                        <p className={`font-bold text-2xl ${card.color}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{card.value}</p>
                        <p className="text-[#1a3a2a60] text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {(['all', ...STATUS_OPTS] as FilterTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className="px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide cursor-pointer transition-all"
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            background: filter === tab ? '#1a3a2a' : 'white',
                            color: filter === tab ? 'white' : '#1a3a2a80',
                            border: filter === tab ? '1.5px solid #1a3a2a' : '1.5px solid #1a3a2a20',
                        }}
                    >
                        {tab === 'all' ? 'All' : tab}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-[#1a3a2a08]" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-[#1a3a2a60]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px" }}>
                    No orders found.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-[#1a3a2a08] overflow-hidden">
                            <div className="p-4 md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-[#1a3a2a] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{order.order_number}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.payment_type === 'cod' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                                                {order.payment_type === 'cod' ? 'COD' : 'UPI'}
                                            </span>
                                            {order.payment_type === 'upi' && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.payment_status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : order.payment_status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                                                    {order.payment_status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[#1a3a2a60] text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{formatDate(order.created_at)}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-[#1a3a2a] text-[16px]" style={{ fontFamily: "var(--font-dm-sans)" }}>₹{order.total}</p>
                                        <p className="text-[#1a3a2a60] text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>Subtotal: ₹{order.subtotal}</p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-[#1a3a2a] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{order.customer_name}</p>
                                        <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1 text-[#3d6b52] text-[12px] font-medium hover:underline" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                            <Phone size={11} />{order.customer_phone}
                                        </a>
                                        <p className="text-[#1a3a2a50] text-[11px] mt-0.5 max-w-xs truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>{order.delivery_address}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Status dropdown */}
                                        <div className="relative">
                                            <select
                                                value={order.order_status}
                                                onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                                                className={`appearance-none px-3 py-1.5 pr-7 rounded-full text-[11px] font-bold border cursor-pointer outline-none ${STATUS_COLORS[order.order_status]}`}
                                                style={{ fontFamily: "var(--font-dm-sans)" }}
                                            >
                                                {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>

                                        {/* UPI screenshot */}
                                        {order.payment_type === 'upi' && order.upi_screenshot_url && (
                                            <button
                                                onClick={() => setScreenshotModal(order.upi_screenshot_url!)}
                                                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 cursor-pointer"
                                                style={{ fontFamily: "var(--font-dm-sans)" }}
                                            >
                                                View Screenshot
                                            </button>
                                        )}

                                        {/* Expand */}
                                        <button onClick={() => toggleExpand(order.id)} className="p-1.5 text-[#1a3a2a60] hover:text-[#1a3a2a] cursor-pointer">
                                            {expanded.has(order.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery charge */}
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-[12px] text-[#1a3a2a60]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        Delivery: ₹{order.delivery_charge || 0}
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="Add charge ₹"
                                        value={deliveryCharge[order.id] || ''}
                                        onChange={e => setDeliveryCharge(prev => ({ ...prev, [order.id]: e.target.value }))}
                                        className="w-24 px-2 py-1 rounded-lg border border-[#1a3a2a15] text-[12px] outline-none"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    />
                                    <button
                                        onClick={() => updateDeliveryCharge(order)}
                                        className="px-3 py-1 rounded-lg bg-[#1a3a2a] text-white text-[11px] font-bold cursor-pointer hover:brightness-110"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Expanded items */}
                            {expanded.has(order.id) && (
                                <div className="border-t border-[#1a3a2a08] px-4 md:px-5 py-3 bg-[#1a3a2a04]">
                                    <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Items</p>
                                    <div className="space-y-1.5">
                                        {order.order_items?.map(item => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-[13px] text-[#1a3a2a]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                                    <Package size={12} className="text-[#1a3a2a40]" />
                                                    {item.product_name} × {item.quantity}
                                                </span>
                                                <span className="font-semibold text-[#1a3a2a] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Screenshot modal */}
            {screenshotModal && (
                <>
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setScreenshotModal(null)}>
                        <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setScreenshotModal(null)} className="absolute -top-10 right-0 text-white cursor-pointer"><X size={24} /></button>
                            <img src={screenshotModal} alt="UPI screenshot" className="w-full rounded-2xl shadow-2xl" />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
