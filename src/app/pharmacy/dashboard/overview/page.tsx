"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ShoppingCart, TrendingUp, Clock, AlertCircle } from "lucide-react"

interface OverviewData {
    totalOrders: number
    revenue: number
    pending: number
    outOfStock: number
    recentOrders: any[]
    lowStockProducts: any[]
}

export default function OverviewPage() {
    const [data, setData] = useState<OverviewData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const [
                { data: orders },
                { data: products },
            ] = await Promise.all([
                supabase.from('orders').select('id, order_number, customer_name, order_status, total, created_at, payment_type').order('created_at', { ascending: false }),
                supabase.from('products').select('id, name, in_stock'),
            ])

            const allOrders = orders || []
            const allProducts = products || []

            setData({
                totalOrders: allOrders.length,
                revenue: allOrders.filter(o => o.order_status === 'delivered').reduce((sum: number, o: any) => sum + (o.total || 0), 0),
                pending: allOrders.filter(o => o.order_status === 'pending').length,
                outOfStock: allProducts.filter(p => !p.in_stock).length,
                recentOrders: allOrders.slice(0, 5),
                lowStockProducts: allProducts.filter(p => !p.in_stock).slice(0, 10),
            })
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div>
                <div className="h-8 bg-gray-100 rounded w-40 mb-6 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            </div>
        )
    }

    if (!data) return null

    const statCards = [
        { label: 'Total Orders', value: data.totalOrders, icon: <ShoppingCart size={18} />, color: 'text-[#1a3a2a]', bg: 'bg-[#1a3a2a10]' },
        { label: 'Total Revenue', value: `₹${data.revenue.toLocaleString()}`, icon: <TrendingUp size={18} />, color: 'text-green-700', bg: 'bg-green-50' },
        { label: 'Pending Orders', value: data.pending, icon: <Clock size={18} />, color: 'text-amber-700', bg: 'bg-amber-50' },
        { label: 'Out of Stock', value: data.outOfStock, icon: <AlertCircle size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
    ]

    return (
        <div>
            <h1 className="font-bold text-[#1a3a2a] mb-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Overview</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-2xl border border-[#1a3a2a08] p-4 md:p-5">
                        <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
                            {card.icon}
                        </div>
                        <p className={`font-bold text-xl md:text-2xl ${card.color}`} style={{ fontFamily: "var(--font-dm-sans)" }}>{card.value}</p>
                        <p className="text-[#1a3a2a50] text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent orders */}
                <div className="bg-white rounded-2xl border border-[#1a3a2a08] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#1a3a2a08]">
                        <h2 className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "18px" }}>Recent Orders</h2>
                    </div>
                    <div className="divide-y divide-[#1a3a2a06]">
                        {data.recentOrders.length === 0 ? (
                            <p className="py-8 text-center text-[#1a3a2a60] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>No orders yet.</p>
                        ) : data.recentOrders.map((order: any) => (
                            <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-[#1a3a2a] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{order.order_number}</p>
                                    <p className="text-[#1a3a2a60] text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{order.customer_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1a3a2a] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>₹{order.total}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.order_status === 'delivered' ? 'bg-green-50 text-green-700' : order.order_status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`} style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        {order.order_status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Out of stock */}
                <div className="bg-white rounded-2xl border border-[#1a3a2a08] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#1a3a2a08]">
                        <h2 className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "18px" }}>Out of Stock Alert</h2>
                    </div>
                    <div className="divide-y divide-[#1a3a2a06]">
                        {data.lowStockProducts.length === 0 ? (
                            <p className="py-8 text-center text-[#1a3a2a60] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>All products are in stock. ✓</p>
                        ) : data.lowStockProducts.map((p: any) => (
                            <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                                <p className="font-semibold text-[#1a3a2a] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{p.name}</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200" style={{ fontFamily: "var(--font-dm-sans)" }}>Out of Stock</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
