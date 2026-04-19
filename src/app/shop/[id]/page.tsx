"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Minus, Plus, CheckCircle, Package, Droplets } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard, ProductCardSkeleton } from "@/components/sections/ProductCard"
import { supabase } from "@/lib/supabase"
import { Product } from "@/types/product"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { addToCart } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [related, setRelated] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (data) {
                setProduct(data)
                const { data: relatedData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category', data.category)
                    .neq('id', id)
                    .limit(4)
                setRelated(relatedData || [])
            }
            setLoading(false)
        }
        fetchProduct()
    }, [id])

    const handleAddToCart = () => {
        if (!product) return
        addToCart(product, quantity)
        toast.success(`${quantity}× ${product.name} added to cart`)
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FAFAF7]">
                <TopBar />
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 pt-24 pb-8 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-24 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        <div className="rounded-3xl bg-[#f5f0e8] aspect-square" />
                        <div className="space-y-4 py-4">
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                            <div className="h-8 bg-gray-100 rounded w-3/4" />
                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                            <div className="h-10 bg-gray-100 rounded w-1/3" />
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[#FAFAF7]">
                <TopBar />
                <Navbar />
                <div className="container mx-auto px-6 py-32 text-center">
                    <p className="text-[#1a3a2a60]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "16px" }}>Product not found.</p>
                    <button onClick={() => router.push('/shop')} className="mt-6 px-6 py-3 bg-[#1a3a2a] text-white rounded-full font-semibold text-[14px] cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        Back to Shop
                    </button>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-8">
                <button onClick={() => router.push('/shop')} className="flex items-center gap-2 text-[#1a3a2a80] hover:text-[#1a3a2a] transition-colors text-[13px] font-semibold mb-8 cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <ArrowLeft size={16} />
                    Back to Shop
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16 md:mb-24">
                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#f5f0e8] aspect-square">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        {product.is_best_seller && (
                            <span className="absolute top-5 left-5 px-3 py-1.5 bg-[#c9a84c] text-white text-[11px] font-bold uppercase tracking-widest rounded-full">Bestseller</span>
                        )}
                        {!product.in_stock && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="px-4 py-2 bg-white text-[#1a3a2a] text-[13px] font-bold uppercase tracking-widest rounded-full border border-[#1a3a2a20]">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[11px] font-bold uppercase tracking-[3px] text-[#7fb99a] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>{product.category}</span>

                        <h1 className="font-bold text-[#1a3a2a] leading-tight mb-4" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "clamp(28px, 4vw, 42px)" }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-5">
                            <span className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "28px" }}>₹{product.price}</span>
                            {product.original_price && (
                                <>
                                    <span className="line-through text-[#1a3a2a40]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "18px" }}>₹{product.original_price}</span>
                                    <span className="px-2 py-0.5 bg-[#7fb99a20] text-[#3d6b52] rounded-full font-bold" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px" }}>
                                        {Math.round((1 - product.price / product.original_price) * 100)}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {product.weight && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1a3a2a10] rounded-full text-[12px] text-[#1a3a2a80]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                    <Package size={12} />{product.weight}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1a3a2a10] rounded-full text-[12px] text-[#1a3a2a80]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                <Droplets size={12} />{product.brand}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-[#1a3a2a80] text-[14px] leading-relaxed mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>{product.description}</p>

                        {/* Quantity + CTA */}
                        {product.in_stock ? (
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-0 border border-[#1a3a2a20] rounded-full overflow-hidden">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer">
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-10 text-center font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-colors cursor-pointer">
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1a3a2a] text-white rounded-full font-bold text-[14px] hover:brightness-110 transition-all cursor-pointer shadow-[0_4px_16px_rgba(26,58,42,0.25)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                    <ShoppingCart size={16} />
                                    Add to Cart — ₹{product.price * quantity}
                                </button>
                            </div>
                        ) : (
                            <div className="px-5 py-3 bg-[#1a3a2a08] rounded-2xl text-[14px] text-[#1a3a2a60] font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>Currently out of stock</div>
                        )}

                        <Link href="/appointment" className="mt-4 w-full py-3 rounded-full border-2 border-[#1a3a2a] text-[#1a3a2a] font-bold text-[14px] hover:bg-[#1a3a2a] hover:text-white transition-all flex items-center justify-center" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Book a Consultation Instead
                        </Link>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div>
                        <h2 className="font-bold text-[#1a3a2a] mb-8" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(24px, 3vw, 32px)" }}>
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
