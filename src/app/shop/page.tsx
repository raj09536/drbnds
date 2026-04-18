"use client"

import { useState, useMemo, useEffect } from "react"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard, ProductCardSkeleton } from "@/components/sections/ProductCard"
import { supabase } from "@/lib/supabase"
import { Product } from "@/types/product"
import { products as staticProducts, categories as staticCategories } from "@/data/productsData"

type SortOption = 'featured' | 'price-asc' | 'price-desc'

export default function ShopPage() {
    const [fetched, setFetched] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sortBy, setSortBy] = useState<SortOption>('featured')
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
            setFetched(data || [])
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const products = fetched.length > 0 ? fetched : staticProducts

    const availableCategories = useMemo(() => {
        const cats = new Set(products.map(p => p.category))
        return staticCategories.filter(c => cats.has(c))
    }, [products])

    const availableBrands = useMemo(() => {
        const bs = new Set(products.map(p => p.brand))
        return Array.from(bs)
    }, [products])

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        )
    }

    const filteredProducts = useMemo(() => {
        let result = [...products]
        if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory)
        if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand))
        if (inStockOnly) result = result.filter(p => p.in_stock)
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break
            case 'price-desc': result.sort((a, b) => b.price - a.price); break
            default: result.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0))
        }
        return result
    }, [products, selectedCategory, selectedBrands, inStockOnly, sortBy])

    const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + selectedBrands.length + (inStockOnly ? 1 : 0)

    const SidebarContent = () => (
        <div style={{ fontFamily: "var(--font-dm-sans)" }}>
            <div className="mb-8">
                <h3 className="text-[11px] font-bold uppercase tracking-[3px] text-[#1a3a2a60] mb-3">Category</h3>
                <div className="flex flex-col gap-1.5">
                    {['All', ...availableCategories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer"
                            style={{
                                background: selectedCategory === cat ? "var(--forest, #1a3a2a)" : "transparent",
                                color: selectedCategory === cat ? "white" : "#1a3a2a",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {availableBrands.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-[11px] font-bold uppercase tracking-[3px] text-[#1a3a2a60] mb-3">Brand</h3>
                    <div className="flex flex-col gap-2">
                        {availableBrands.map(brand => (
                            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                    className="w-4 h-4 rounded accent-[#1a3a2a] cursor-pointer"
                                />
                                <span className="text-[13px] font-medium text-[#1a3a2a]">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(v => !v)}
                    className="w-4 h-4 rounded accent-[#1a3a2a] cursor-pointer"
                />
                <span className="text-[13px] font-medium text-[#1a3a2a]">In Stock Only</span>
            </label>

            {activeFilterCount > 0 && (
                <button
                    onClick={() => { setSelectedCategory('All'); setSelectedBrands([]); setInStockOnly(false) }}
                    className="mt-8 w-full py-2.5 rounded-xl border border-[#1a3a2a20] text-[13px] font-semibold text-[#1a3a2a] hover:bg-[#1a3a2a08] transition-all cursor-pointer"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    )

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <TopBar />
            <Navbar />

            <section className="relative overflow-hidden">
                {/* Full image — no crop */}
                <img
                    src="/medical.jpg"
                    alt="Wellness Store"
                    className="w-full block"
                    style={{ objectFit: "contain" }}
                />
                {/* Overlay with text centered on image */}
                <div className="absolute inset-0 flex items-center justify-center text-center px-6" style={{ background: "rgba(26,58,42,0.55)" }}>
                    <div>
                        <span className="inline-block text-[#7fb99a] font-bold uppercase tracking-[4px] mb-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px" }}>
                            Natural Healing
                        </span>
                        <h1 className="text-white font-bold leading-tight" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "clamp(34px, 5vw, 56px)" }}>
                            Our Wellness Store
                        </h1>
                        <p className="mt-4 text-white/80 max-w-xl mx-auto" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", lineHeight: 1.7 }}>
                            Curated homoeopathic remedies and wellness products — trusted by thousands, recommended by our doctors.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
                <div className="flex gap-8 lg:gap-12">
                    {/* Sidebar desktop */}
                    <aside className="hidden md:block shrink-0 w-[220px] lg:w-[240px]">
                        <div className="bg-white rounded-2xl border border-[#2D501610] p-6 sticky top-24">
                            <h2 className="text-[#1a3a2a] font-bold mb-6" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "20px" }}>Filters</h2>
                            <SidebarContent />
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {/* Sort bar */}
                        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                            <p className="text-[#1a3a2a60] text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFilterDrawerOpen(true)}
                                    className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a3a2a20] text-[13px] font-semibold text-[#1a3a2a] bg-white cursor-pointer"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}
                                >
                                    <SlidersHorizontal size={14} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="w-4 h-4 rounded-full bg-[#1a3a2a] text-white text-[10px] font-bold flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none pl-4 pr-8 py-2 rounded-full border border-[#1a3a2a20] bg-white text-[13px] font-semibold text-[#1a3a2a] cursor-pointer focus:outline-none"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                    </select>
                                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1a3a2a60]" />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-[#1a3a2a60]" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px" }}>No products match your filters.</p>
                                <button onClick={() => { setSelectedCategory('All'); setSelectedBrands([]); setInStockOnly(false) }} className="mt-4 text-[#1a3a2a] font-semibold text-[13px] underline cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>Clear filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {filterDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setFilterDrawerOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[#1a3a2a] font-bold" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>Filters</h2>
                            <button onClick={() => setFilterDrawerOpen(false)} className="w-8 h-8 rounded-full bg-[#1a3a2a08] flex items-center justify-center cursor-pointer">
                                <X size={16} className="text-[#1a3a2a]" />
                            </button>
                        </div>
                        <SidebarContent />
                        <button onClick={() => setFilterDrawerOpen(false)} className="mt-6 w-full py-3 rounded-2xl bg-[#1a3a2a] text-white font-bold text-[14px] cursor-pointer" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Show {filteredProducts.length} Products
                        </button>
                    </div>
                </>
            )}

            <Footer />
        </main>
    )
}
