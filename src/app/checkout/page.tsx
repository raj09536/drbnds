"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useCart } from "@/context/CartContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { AlertCircle, Banknote, Smartphone, ShoppingBag, Copy, Check } from "lucide-react"
import Link from "next/link"

type PaymentType = 'cod' | 'upi'

const UPI_ID = "dhms9412175651@iob"

function buildWhatsAppUrl(
    orderNumber: string,
    name: string,
    phone: string,
    address: string,
    items: { name: string; qty: number; price: number }[],
    subtotal: number,
    paymentType: PaymentType
) {
    const itemLines = items.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n')

    const codMsg = `🆕 NEW ORDER ${orderNumber}
━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

📦 ITEMS:
${itemLines}

💰 Subtotal: ₹${subtotal}
🚚 Delivery: Please confirm charge
💵 Payment: CASH ON DELIVERY

⚠️ Kindly confirm delivery charge and contact the customer.`

    const upiMsg = `🆕 NEW ORDER ${orderNumber}
━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

📦 ITEMS:
${itemLines}

💰 Subtotal: ₹${subtotal}
🚚 Delivery: To be confirmed
💳 Payment: UPI / PREPAID

📸 PAYMENT SCREENSHOT ATTACHED
UPI ID: ${UPI_ID}

⚠️ Please confirm order & delivery charge.`

    const message = paymentType === 'cod' ? codMsg : upiMsg
    return `https://wa.me/918191919949?text=${encodeURIComponent(message)}`
}

export default function CheckoutPage() {
    const router = useRouter()
    const { items, cartTotal, clearCart } = useCart()

    const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' })
    const [paymentType, setPaymentType] = useState<PaymentType>('cod')
    const [errors, setErrors] = useState<Partial<typeof form>>({})
    const [submitting, setSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)

    const copyUpiId = () => {
        navigator.clipboard.writeText(UPI_ID)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const validate = () => {
        const errs: Partial<typeof form> = {}
        if (!form.name.trim()) errs.name = 'Required'
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit number'
        if (!form.address.trim()) errs.address = 'Required'
        if (!form.city.trim()) errs.city = 'Required'
        if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Enter a valid 6-digit pincode'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (items.length === 0) { toast.error('Your cart is empty'); return }
        if (!validate()) return

        setSubmitting(true)
        try {
            const orderNumber = 'ORD' + Date.now()
            const deliveryAddress = `${form.address.trim()}, ${form.city.trim()} - ${form.pincode.trim()}`

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    customer_name: form.name.trim(),
                    customer_phone: form.phone.trim(),
                    delivery_address: deliveryAddress,
                    payment_type: paymentType,
                    payment_status: 'pending',
                    order_status: 'pending',
                    subtotal: cartTotal,
                    delivery_charge: 0,
                    total: cartTotal,
                })
                .select()
                .single()

            if (orderError) throw orderError

            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
            if (itemsError) throw itemsError

            const waItems = items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price }))
            const waUrl = buildWhatsAppUrl(orderNumber, form.name.trim(), form.phone.trim(), deliveryAddress, waItems, cartTotal, paymentType)
            window.open(waUrl, '_blank')

            clearCart()
            router.push(`/order-confirmation?id=${orderNumber}&type=${paymentType}`)
        } catch (err: any) {
            toast.error(err?.message || 'Failed to place order. Please try again.')
            setSubmitting(false)
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#FAFAF7]">
                <TopBar /><Navbar />
                <div className="container mx-auto px-6 py-32 text-center">
                    <ShoppingBag size={48} className="mx-auto text-[#1a3a2a20] mb-4" />
                    <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Your cart is empty</h2>
                    <p className="text-[#1a3a2a60] mb-6" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px" }}>Add some products before checking out.</p>
                    <Link href="/shop" className="inline-flex px-6 py-3 bg-[#1a3a2a] text-white rounded-full font-bold text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>Browse Products</Link>
                </div>
                <Footer />
            </main>
        )
    }

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all bg-white ${err ? 'border-red-400 focus:border-red-500' : 'border-[#1a3a2a15] focus:border-[#1a3a2a40]'}`

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar /><Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-20 pb-16">
                <h1 className="font-bold text-[#1a3a2a] mb-8 mt-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(28px, 4vw, 40px)" }}>
                    Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
                        {/* Left — Form */}
                        <div className="space-y-8">
                            {/* Delivery Details */}
                            <div className="bg-white rounded-2xl border border-[#1a3a2a08] p-6 md:p-8">
                                <h2 className="font-bold text-[#1a3a2a] mb-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>Delivery Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Full Name</label>
                                        <input className={inputCls(errors.name)} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="e.g. Ramesh Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                        {errors.name && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Phone Number</label>
                                        <input className={inputCls(errors.phone)} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} maxLength={10} />
                                        {errors.phone && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{errors.phone}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Full Address</label>
                                        <input className={inputCls(errors.address)} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="House no., Street, Locality" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                        {errors.address && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>City</label>
                                        <input className={inputCls(errors.city)} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="e.g. Dehradun" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                                        {errors.city && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Pincode</label>
                                        <input className={inputCls(errors.pincode)} style={{ fontFamily: "var(--font-dm-sans)" }} placeholder="6-digit pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} maxLength={6} />
                                        {errors.pincode && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>{errors.pincode}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-[#1a3a2a08] p-6 md:p-8">
                                <h2 className="font-bold text-[#1a3a2a] mb-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>Payment Method</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {([
                                        { type: 'cod' as PaymentType, icon: <Banknote size={22} />, title: 'Cash on Delivery', subtitle: 'Pay when your order arrives' },
                                        { type: 'upi' as PaymentType, icon: <Smartphone size={22} />, title: 'Pay via UPI', subtitle: 'Scan & pay, then upload screenshot' },
                                    ]).map(opt => (
                                        <button
                                            key={opt.type}
                                            type="button"
                                            onClick={() => setPaymentType(opt.type)}
                                            className="flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer text-left"
                                            style={{
                                                borderColor: paymentType === opt.type ? 'var(--forest, #1a3a2a)' : '#1a3a2a15',
                                                background: paymentType === opt.type ? '#1a3a2a08' : 'white',
                                            }}
                                        >
                                            <span className={`mt-0.5 ${paymentType === opt.type ? 'text-[#1a3a2a]' : 'text-[#1a3a2a60]'}`}>{opt.icon}</span>
                                            <div>
                                                <p className="font-bold text-[#1a3a2a] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{opt.title}</p>
                                                <p className="text-[#1a3a2a60] text-[12px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>{opt.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* UPI QR Section */}
                            {paymentType === 'upi' && (
                                <div className="bg-white rounded-2xl border border-[#1a3a2a08] p-6 md:p-8">
                                    <h2 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>Scan & Pay</h2>
                                    <p className="text-[#1a3a2a70] text-[13px] mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        Scan the QR code below using any UPI app (PhonePe, GPay, Paytm, etc.)
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                                        {/* QR Code */}
                                        <div className="shrink-0 p-3 border-2 border-[#1a3a2a15] rounded-2xl bg-white">
                                            <img
                                                src="/upi-qr.png"
                                                alt="UPI QR Code"
                                                width={180}
                                                height={180}
                                                className="rounded-xl"
                                            />
                                        </div>

                                        {/* UPI ID + Steps */}
                                        <div className="flex-1 w-full">
                                            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>UPI ID</p>
                                            <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-[#f5f0e8] border border-[#1a3a2a10]">
                                                <span className="flex-1 text-[14px] font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-dm-sans)" }}>{UPI_ID}</span>
                                                <button type="button" onClick={copyUpiId} className="shrink-0 p-1.5 rounded-lg hover:bg-[#1a3a2a10] transition-colors cursor-pointer">
                                                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-[#1a3a2a60]" />}
                                                </button>
                                            </div>

                                            <div className="space-y-2.5">
                                                {[
                                                    { n: "1", t: "Scan QR or copy UPI ID above" },
                                                    { n: "2", t: "Pay the subtotal amount" },
                                                    { n: "3", t: "Take a screenshot of payment" },
                                                    { n: "4", t: "Click \"Place Order\" — WhatsApp opens, send your screenshot there" },
                                                ].map(s => (
                                                    <div key={s.n} className="flex items-start gap-3">
                                                        <span className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--forest, #1a3a2a)", fontFamily: "var(--font-dm-sans)" }}>{s.n}</span>
                                                        <p className="text-[13px] text-[#1a3a2a]" style={{ fontFamily: "var(--font-dm-sans)" }}>{s.t}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit button — mobile only */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="lg:hidden w-full py-4 rounded-2xl bg-[#1a3a2a] text-white font-bold text-[15px] cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>

                        {/* Right — Order Summary */}
                        <div>
                            <div className="bg-white rounded-2xl border border-[#1a3a2a08] p-6 sticky top-24">
                                <h2 className="font-bold text-[#1a3a2a] mb-5" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>Order Summary</h2>

                                <div className="divide-y divide-[#1a3a2a08]">
                                    {items.map(item => (
                                        <div key={item.product.id} className="flex gap-3 py-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0">
                                                <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#1a3a2a] text-[13px] font-semibold leading-snug truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>{item.product.name}</p>
                                                <p className="text-[#1a3a2a60] text-[11px] mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-[#1a3a2a] text-[13px] shrink-0" style={{ fontFamily: "var(--font-dm-sans)" }}>₹{item.product.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#1a3a2a08] space-y-2">
                                    <div className="flex justify-between text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        <span className="text-[#1a3a2a80]">Subtotal</span>
                                        <span className="font-semibold text-[#1a3a2a]">₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        <span className="text-[#1a3a2a80]">Delivery charge</span>
                                        <span className="text-[#1a3a2a60] italic">To be confirmed</span>
                                    </div>
                                </div>

                                {/* Amber info box */}
                                <div className="mt-4 flex gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                                    <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-amber-700 text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        Our team will contact you to confirm the delivery charge based on your location.
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#1a3a2a08] flex justify-between">
                                    <span className="font-bold text-[#1a3a2a] text-[15px]" style={{ fontFamily: "var(--font-dm-sans)" }}>Total</span>
                                    <span className="font-bold text-[#1a3a2a] text-[18px]" style={{ fontFamily: "var(--font-dm-sans)" }}>₹{cartTotal}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="hidden lg:block w-full mt-5 py-4 rounded-2xl bg-[#1a3a2a] text-white font-bold text-[15px] cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </main>
    )
}
