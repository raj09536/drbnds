"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Calendar, ArrowRight, ShoppingCart, Minus, Plus, Trash2, UserCircle } from "lucide-react"
import { useAppointment } from "@/context/AppointmentContext"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const navItems = [
    { name: "Overview", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Our Team", href: "#doctors" },
    { name: "Shop", href: "/shop" },
    { name: "Case Files", href: "/case-files" },
    { name: "Contact", href: "#contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { openModal } = useAppointment()
    const { items, cartCount, cartTotal, removeFromCart, updateQuantity, isCartOpen, setCartOpen } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    const handleNavClick = (href: string) => {
        setIsOpen(false)
        setCartOpen(false)

        if (href.startsWith("#")) {
            if (pathname !== "/") {
                router.push("/" + href)
            } else {
                if (href === "#") {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                } else {
                    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })
                }
            }
        }
    }

    const openCart = () => {
        setIsOpen(false)
        setCartOpen(true)
    }

    const openMobileMenu = () => {
        setCartOpen(false)
        setIsOpen(true)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })

        if (isOpen || isCartOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => window.removeEventListener("scroll", handleScroll)
    }, [isOpen, isCartOpen])

    return (
        <>
            <header
                className="sticky top-0 z-50 bg-white transition-shadow duration-300"
                style={{
                    boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
                }}
            >
                <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between" style={{ height: "72px" }}>
                    {/* Logo */}
                    <button
                        onClick={() => {
                            if (pathname === "/") {
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            } else {
                                router.push("/")
                            }
                        }}
                        className="flex items-center shrink-0 cursor-pointer bg-transparent border-none p-0"
                    >
                        <Image
                            src="/logo.jpeg"
                            alt="Dr. BND Clinic Logo"
                            width={160}
                            height={45}
                            className="object-contain"
                            style={{ height: "45px", width: "auto" }}
                            priority
                        />
                    </button>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            item.href.startsWith("#") ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item.href)}
                                    className="relative text-charcoal hover:text-forest transition-colors duration-200 bg-transparent border-none cursor-pointer group"
                                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 500, padding: 0 }}
                                >
                                    {item.name}
                                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                                </button>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative text-charcoal hover:text-forest transition-colors duration-200 group"
                                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 500 }}
                                >
                                    {item.name}
                                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/signup?mode=login"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1a3a2a20] text-forest text-[13px] font-semibold hover:bg-[#1a3a2a08] transition-colors"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            <UserCircle className="w-4 h-4" />
                            Patient Login
                        </Link>
                        <Link
                            href="/login"
                            className="text-forest/60 text-xs font-semibold flex items-center gap-1 uppercase tracking-widest hover:text-forest transition-colors"
                        >
                            Staff Login <ArrowRight className="w-3 h-3" />
                        </Link>

                        {/* Cart icon */}
                        <button
                            onClick={openCart}
                            className="relative p-2 text-forest hover:bg-[#1a3a2a08] rounded-full transition-colors cursor-pointer"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#c9a84c] text-white text-[9px] font-bold flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 bg-forest text-white rounded-lg hover:bg-sage transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                            style={{ padding: "10px 22px", fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: 600, border: "none" }}
                        >
                            <Calendar className="w-4 h-4" />
                            Book Appointment
                        </button>
                    </div>

                    {/* Mobile right area: cart + menu toggle */}
                    <div className="md:hidden flex items-center gap-1">
                        <button
                            onClick={openCart}
                            className="relative p-2 text-forest cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c9a84c] text-white text-[9px] font-bold flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={openMobileMenu}
                            className="p-2 text-forest focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center translate-x-2"
                            aria-label="Open Menu"
                        >
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </nav>

                {/* Mobile Full Screen Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-0 z-100 h-full w-full bg-white md:hidden"
                        >
                            <div className="flex flex-col h-full bg-white relative">
                                {/* Mobile Header */}
                                <div className="flex items-center justify-between px-6 h-[72px] border-b border-gold-light/20">
                                    <Image
                                        src="/logo.jpeg"
                                        alt="Logo"
                                        width={140}
                                        height={40}
                                        style={{ height: "40px", width: "auto" }}
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-charcoal cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center translate-x-2"
                                        aria-label="Close Menu"
                                    >
                                        <X className="w-7 h-7" />
                                    </button>
                                </div>

                                {/* Mobile Nav Links */}
                                <div className="flex flex-col flex-1 px-8 py-10 gap-8 overflow-y-auto">
                                    {navItems.map((item, idx) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                        >
                                            {item.href.startsWith("#") ? (
                                                <button
                                                    onClick={() => handleNavClick(item.href)}
                                                    className="text-[28px] font-bold text-forest py-2 border-transparent border-b-2 hover:border-gold transition-all w-fit cursor-pointer bg-transparent border-none p-0"
                                                    style={{ fontFamily: "var(--font-serif)" }}
                                                >
                                                    {item.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-[28px] font-bold text-forest py-2 border-transparent border-b-2 hover:border-gold transition-all w-fit block"
                                                    style={{ fontFamily: "var(--font-serif)" }}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Footer Area */}
                                <div className="px-6 py-8 border-t border-gold-light/20 bg-cream/30">
                                    <button
                                        onClick={() => { openModal(); setIsOpen(false); }}
                                        className="w-full flex items-center justify-center gap-3 bg-forest text-white py-4 rounded-xl shadow-lg active:scale-95 transition-all text-lg font-bold cursor-pointer"
                                        style={{ fontFamily: "var(--font-dm-sans)", border: "none" }}
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book Appointment
                                    </button>
                                    <div className="mt-4 flex flex-col gap-3">
                                        <Link
                                            href="/signup?mode=login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#1a3a2a25] text-forest font-semibold text-[14px] hover:bg-[#1a3a2a08] transition-colors"
                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Patient Login
                                        </Link>
                                        <div className="flex justify-between items-center px-2">
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="text-forest/60 text-sm font-semibold flex items-center gap-1 uppercase tracking-widest hover:text-forest transition-colors"
                                            >
                                                Staff Login <ArrowRight className="w-3 h-3" />
                                            </Link>
                                            <p className="text-gray-400 text-xs">Dr. BND&apos;s Clinic © 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="cart-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/40"
                            onClick={() => setCartOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            key="cart-panel"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 260 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] bg-white flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3a2a10]">
                                <h2
                                    className="font-bold text-[#1a3a2a] flex items-center gap-2"
                                    style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}
                                >
                                    <ShoppingCart size={18} />
                                    Your Cart
                                    {cartCount > 0 && (
                                        <span
                                            className="px-2 py-0.5 bg-[#1a3a2a10] text-[#1a3a2a] rounded-full text-[12px] font-bold"
                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </h2>
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="w-8 h-8 rounded-full bg-[#1a3a2a08] flex items-center justify-center cursor-pointer hover:bg-[#1a3a2a15] transition-colors"
                                >
                                    <X size={16} className="text-[#1a3a2a]" />
                                </button>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-20">
                                        <ShoppingCart size={48} className="text-[#1a3a2a20]" />
                                        <p
                                            className="text-[#1a3a2a60]"
                                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px" }}
                                        >
                                            Your cart is empty
                                        </p>
                                        <button
                                            onClick={() => { setCartOpen(false); router.push('/shop') }}
                                            className="px-5 py-2.5 bg-[#1a3a2a] text-white rounded-full text-[13px] font-semibold cursor-pointer"
                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {items.map(item => (
                                            <div key={item.product.id} className="flex gap-3 items-start">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0">
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="font-semibold text-[#1a3a2a] text-[13px] leading-snug truncate"
                                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                                    >
                                                        {item.product.name}
                                                    </p>
                                                    <p
                                                        className="text-[#1a3a2a60] text-[11px] mt-0.5"
                                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                                    >
                                                        {item.product.weight} · {item.product.brand}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        {/* Qty controls */}
                                                        <div className="flex items-center gap-0 border border-[#1a3a2a15] rounded-full overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer"
                                                            >
                                                                <Minus size={11} />
                                                            </button>
                                                            <span
                                                                className="w-6 text-center text-[12px] font-bold text-[#1a3a2a]"
                                                                style={{ fontFamily: "var(--font-dm-sans)" }}
                                                            >
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer"
                                                            >
                                                                <Plus size={11} />
                                                            </button>
                                                        </div>
                                                        <span
                                                            className="font-bold text-[#1a3a2a] text-[14px]"
                                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                                        >
                                                            ₹{item.product.price * item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="p-1.5 text-[#1a3a2a30] hover:text-red-400 transition-colors cursor-pointer shrink-0 mt-0.5"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="px-6 py-5 border-t border-[#1a3a2a10]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className="text-[#1a3a2a80] text-[13px] font-semibold"
                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                        >
                                            Subtotal
                                        </span>
                                        <span
                                            className="text-[#1a3a2a] font-bold text-[18px]"
                                            style={{ fontFamily: "var(--font-dm-sans)" }}
                                        >
                                            ₹{cartTotal}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => { setCartOpen(false); router.push('/checkout') }}
                                        className="w-full py-3.5 rounded-2xl bg-[#1a3a2a] text-white font-bold text-[14px] cursor-pointer hover:brightness-110 transition-all"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    >
                                        Proceed to Checkout — ₹{cartTotal}
                                    </button>
                                    <button
                                        onClick={() => { setCartOpen(false); router.push('/shop') }}
                                        className="w-full py-2.5 mt-2 rounded-2xl border border-[#1a3a2a20] text-[#1a3a2a] font-semibold text-[13px] cursor-pointer hover:bg-[#1a3a2a08] transition-all"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
