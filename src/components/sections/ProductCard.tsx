"use client"

import { useRouter } from "next/navigation"
import { Star, ShoppingCart, BadgeCheck } from "lucide-react"
import { Product } from "@/types/product"
import { useCart } from "@/context/CartContext"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter()
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!product.in_stock) return
        addToCart(product, 1)
        toast.success(`${product.name} added to cart`)
    }

    return (
        <div
            onClick={() => router.push(`/shop/${product.id}`)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#2D501610] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(45,80,22,0.1)] flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-[#f5f0e8] aspect-square">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.is_best_seller && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#c9a84c] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                        <BadgeCheck size={10} />
                        Bestseller
                    </span>
                )}
                {!product.in_stock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-[#1a3a2a] text-[11px] font-bold uppercase tracking-widest rounded-full border border-[#1a3a2a20]">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 md:p-5">
                <span
                    className="text-[10px] font-bold uppercase tracking-[2px] text-[#7fb99a] mb-2"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                    {product.category}
                </span>

                <h3
                    className="font-semibold text-[#1a3a2a] leading-snug mb-1"
                    style={{
                        fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                        fontSize: "clamp(16px, 1.8vw, 19px)",
                    }}
                >
                    {product.name}
                </h3>

                <p
                    className="text-[#1a3a2a80] text-[12px] leading-relaxed mb-3 flex-1 line-clamp-2"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                    {product.brand}{product.weight ? ` · ${product.weight}` : ""}
                </p>

                {/* Price + CTA */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <div>
                        <span
                            className="font-bold text-[#1a3a2a]"
                            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "17px" }}
                        >
                            ₹{product.price}
                        </span>
                        {product.original_price && (
                            <span
                                className="ml-1.5 line-through text-[#1a3a2a40]"
                                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px" }}
                            >
                                ₹{product.original_price}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.in_stock}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#1a3a2a] text-white"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                        <ShoppingCart size={13} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#2D501610] animate-pulse">
            <div className="bg-[#f5f0e8] aspect-square" />
            <div className="p-4 md:p-5 space-y-3">
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-2.5 bg-gray-100 rounded w-full" />
                <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                <div className="flex justify-between items-center pt-1">
                    <div className="h-5 bg-gray-100 rounded w-16" />
                    <div className="h-8 w-16 bg-gray-100 rounded-full" />
                </div>
            </div>
        </div>
    )
}
