"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Product } from "@/types/product"
import { ProductCard, ProductCardSkeleton } from "./ProductCard"
import { products as staticProducts } from "@/data/productsData"

export function ShopTeaser() {
    const [fetched, setFetched] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBestsellers = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_best_seller', true)
                .eq('in_stock', true)
                .limit(4)
            setFetched(data || [])
            setLoading(false)
        }
        fetchBestsellers()
    }, [])

    const products = fetched.length > 0
        ? fetched
        : staticProducts.filter(p => p.is_best_seller && p.in_stock).slice(0, 4)

    if (!loading && products.length === 0) return null

    return (
        <section className="bg-[#FAFAF7] overflow-hidden" style={{ padding: "72px 0" }}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <span className="block font-bold uppercase tracking-[4px] md:tracking-[6px] text-[#7fb99a] mb-3" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px" }}>
                            Wellness Store
                        </span>
                        <h2 className="font-bold text-[#1a3a2a] leading-tight" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "clamp(28px, 4vw, 44px)" }}>
                            From Our Wellness Store
                        </h2>
                        <p className="mt-2 text-[#1a3a2a80] max-w-sm" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", lineHeight: 1.7 }}>
                            Doctor-recommended homoeopathic remedies delivered to your door.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1a3a2a] text-[#1a3a2a] font-bold text-[13px] hover:bg-[#1a3a2a] hover:text-white transition-all duration-300 group shrink-0"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                        Browse All Products
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="-mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-4 md:overflow-visible" style={{ scrollbarWidth: "none" }}>
                        {loading
                            ? [...Array(4)].map((_, i) => (
                                <div key={i} className="shrink-0 w-[72vw] max-w-[260px] md:w-auto md:max-w-none">
                                    <ProductCardSkeleton />
                                </div>
                            ))
                            : products.map(product => (
                                <div key={product.id} className="shrink-0 w-[72vw] max-w-[260px] md:w-auto md:max-w-none">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1a3a2a] text-white font-bold text-[13px] transition-all duration-300 group"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                        Browse All Products
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
