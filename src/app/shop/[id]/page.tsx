"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, CheckCircle, Package, Droplets } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/sections/ProductCard"
import { products } from "@/data/productsData"
import { useCart } from "@/context/CartContext"
import { useAppointment } from "@/context/AppointmentContext"
import { toast } from "sonner"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { addToCart } = useCart()
    const { openModal } = useAppointment()
    const [quantity, setQuantity] = useState(1)

    const product = products.find(p => p.id === id)

    if (!product) {
        return (
            <main className="min-h-screen bg-[#FAFAF7]">
                <TopBar />
                <Navbar />
                <div className="container mx-auto px-6 py-32 text-center">
                    <p
                        className="text-[#1a3a2a60]"
                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "16px" }}
                    >
                        Product not found.
                    </p>
                    <button
                        onClick={() => router.push('/shop')}
                        className="mt-6 px-6 py-3 bg-[#1a3a2a] text-white rounded-full font-semibold text-[14px] cursor-pointer"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                        Back to Shop
                    </button>
                </div>
                <Footer />
            </main>
        )
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addToCart(product)
        toast.success(`${quantity}× ${product.name} added to cart`)
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-8">
                {/* Back link */}
                <button
                    onClick={() => router.push('/shop')}
                    className="flex items-center gap-2 text-[#1a3a2a80] hover:text-[#1a3a2a] transition-colors text-[13px] font-semibold mb-8 cursor-pointer"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                    <ArrowLeft size={16} />
                    Back to Shop
                </button>

                {/* Product layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16 md:mb-24">

                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#f5f0e8] aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.isBestseller && (
                            <span className="absolute top-5 left-5 px-3 py-1.5 bg-[#c9a84c] text-white text-[11px] font-bold uppercase tracking-widest rounded-full">
                                Bestseller
                            </span>
                        )}
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="px-4 py-2 bg-white text-[#1a3a2a] text-[13px] font-bold uppercase tracking-widest rounded-full border border-[#1a3a2a20]">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        {/* Category */}
                        <span
                            className="text-[11px] font-bold uppercase tracking-[3px] text-[#7fb99a] mb-3"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            {product.category}
                        </span>

                        {/* Name */}
                        <h1
                            className="font-bold text-[#1a3a2a] leading-tight mb-2"
                            style={{
                                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                                fontSize: "clamp(28px, 4vw, 42px)",
                            }}
                        >
                            {product.name}
                        </h1>

                        {/* Tagline */}
                        <p
                            className="text-[#1a3a2a80] italic mb-4"
                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px" }}
                        >
                            {product.tagline}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < Math.round(product.rating) ? "#c9a84c" : "transparent"}
                                        stroke={i < Math.round(product.rating) ? "#c9a84c" : "rgba(0,0,0,0.2)"}
                                    />
                                ))}
                            </div>
                            <span
                                className="text-[13px] text-[#1a3a2a60]"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                                {product.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span
                                className="font-bold text-[#1a3a2a]"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "28px" }}
                            >
                                ₹{product.price}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span
                                        className="line-through text-[#1a3a2a40]"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "18px" }}
                                    >
                                        ₹{product.originalPrice}
                                    </span>
                                    <span
                                        className="px-2 py-0.5 bg-[#7fb99a20] text-[#3d6b52] rounded-full font-bold"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px" }}
                                    >
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1a3a2a10] rounded-full text-[12px] text-[#1a3a2a80]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <Package size={12} />
                                {product.packSize}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1a3a2a10] rounded-full text-[12px] text-[#1a3a2a80]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <Droplets size={12} />
                                {product.brand}
                            </span>
                        </div>

                        {/* Benefits */}
                        <div className="mb-6">
                            <h3
                                className="text-[11px] font-bold uppercase tracking-[3px] text-[#1a3a2a60] mb-3"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                                Key Benefits
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {product.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <CheckCircle size={15} className="text-[#7fb99a] shrink-0 mt-0.5" />
                                        <span
                                            className="text-[14px] text-[#1a3a2a]"
                                            style={{ fontFamily: "var(--font-dm-sans)", lineHeight: 1.5 }}
                                        >
                                            {benefit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dosage */}
                        <div
                            className="p-4 bg-[#1a3a2a08] rounded-2xl mb-7"
                        >
                            <h3
                                className="text-[11px] font-bold uppercase tracking-[3px] text-[#1a3a2a60] mb-1"
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                                Dosage
                            </h3>
                            <p
                                className="text-[13px] text-[#1a3a2a]"
                                style={{ fontFamily: "var(--font-dm-sans)", lineHeight: 1.6 }}
                            >
                                {product.dosage}
                            </p>
                        </div>

                        {/* Quantity + CTA */}
                        {product.inStock ? (
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Quantity */}
                                <div className="flex items-center gap-0 border border-[#1a3a2a20] rounded-full overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span
                                        className="w-10 text-center font-bold text-[#1a3a2a]"
                                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}
                                    >
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Add to cart */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1a3a2a] text-white rounded-full font-bold text-[14px] hover:brightness-110 transition-all cursor-pointer shadow-[0_4px_16px_rgba(26,58,42,0.25)]"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}
                                >
                                    <ShoppingCart size={16} />
                                    Add to Cart — ₹{product.price * quantity}
                                </button>
                            </div>
                        ) : (
                            <div className="px-5 py-3 bg-[#1a3a2a08] rounded-2xl text-[14px] text-[#1a3a2a60] font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                Currently out of stock
                            </div>
                        )}

                        {/* Secondary CTA */}
                        <button
                            onClick={() => openModal()}
                            className="mt-4 w-full py-3 rounded-full border-2 border-[#1a3a2a] text-[#1a3a2a] font-bold text-[14px] hover:bg-[#1a3a2a] hover:text-white transition-all cursor-pointer"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                            Book a Consultation Instead
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2
                            className="font-bold text-[#1a3a2a] mb-8"
                            style={{
                                fontFamily: "var(--font-cormorant, serif)",
                                fontSize: "clamp(24px, 3vw, 32px)",
                            }}
                        >
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
