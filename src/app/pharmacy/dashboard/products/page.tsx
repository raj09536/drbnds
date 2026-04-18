"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { Product } from "@/types/product"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search, X, Upload, ToggleLeft, ToggleRight } from "lucide-react"

const DEFAULT_BRANDS = ["Dr. BND's", "SBL", "Schwabe", "Dr. Reckeweg", "Other"]
const DEFAULT_CATEGORIES = ["Single Remedies", "Mother Tinctures", "Biochemic", "Combos & Kits", "Skin Care", "Digestive Care", "Pain Relief", "Women's Health", "Immunity", "Respiratory", "Mind & Mental", "Fever & Infections", "Digestive"]

type FormState = {
    name: string; brand: string; category: string; price: string; original_price: string
    weight: string; description: string; image_url: string
    is_popular: boolean; is_best_seller: boolean; in_stock: boolean; tags: string
}

const emptyForm: FormState = {
    name: '', brand: DEFAULT_BRANDS[0], category: DEFAULT_CATEGORIES[0], price: '', original_price: '',
    weight: '', description: '', image_url: '',
    is_popular: false, is_best_seller: false, in_stock: true, tags: '',
}

function productToForm(p: Product): FormState {
    return {
        name: p.name, brand: p.brand, category: p.category,
        price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
        weight: p.weight || '', description: p.description, image_url: p.image_url,
        is_popular: p.is_popular, is_best_seller: p.is_best_seller, in_stock: p.in_stock,
        tags: (p.tags || []).join(', '),
    }
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        setProducts(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchProducts() }, [])

    const openAdd = () => { setEditProduct(null); setForm(emptyForm); setModalOpen(true) }
    const openEdit = (p: Product) => { setEditProduct(p); setForm(productToForm(p)); setModalOpen(true) }
    const closeModal = () => { setModalOpen(false); setEditProduct(null) }

    const handleImageUpload = async (file: File) => {
        setUploading(true)
        try {
            const fileName = `products/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
            const { data, error } = await supabase.storage.from('clinic-media').upload(fileName, file, { upsert: true })
            if (error) throw error
            const { data: { publicUrl } } = supabase.storage.from('clinic-media').getPublicUrl(data.path)
            setForm(f => ({ ...f, image_url: publicUrl }))
            toast.success('Image uploaded')
        } catch (err: any) {
            toast.error(err?.message || 'Upload failed')
        }
        setUploading(false)
    }

    const handleSave = async () => {
        if (!form.name.trim() || !form.price) { toast.error('Name and price are required'); return }
        setSaving(true)
        const payload = {
            name: form.name.trim(), brand: form.brand, category: form.category,
            price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null,
            weight: form.weight || null, description: form.description, image_url: form.image_url,
            is_popular: form.is_popular, is_best_seller: form.is_best_seller, in_stock: form.in_stock,
            tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        }
        if (editProduct) {
            const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id)
            if (error) { toast.error(error.message); setSaving(false); return }
            toast.success('Product updated')
        } else {
            const { error } = await supabase.from('products').insert(payload)
            if (error) { toast.error(error.message); setSaving(false); return }
            toast.success('Product added')
        }
        setSaving(false)
        closeModal()
        fetchProducts()
    }

    const toggleStock = async (p: Product) => {
        const { error } = await supabase.from('products').update({ in_stock: !p.in_stock }).eq('id', p.id)
        if (error) { toast.error(error.message); return }
        setProducts(prev => prev.map(x => x.id === p.id ? { ...x, in_stock: !p.in_stock } : x))
        toast.success(`Marked ${!p.in_stock ? 'In Stock' : 'Out of Stock'}`)
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) { toast.error(error.message); return }
        setProducts(prev => prev.filter(p => p.id !== id))
        setDeleteConfirm(null)
        toast.success('Product deleted')
    }

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const brandSuggestions = Array.from(new Set([...DEFAULT_BRANDS, ...products.map(p => p.brand)])).filter(Boolean)
    const categorySuggestions = Array.from(new Set([...DEFAULT_CATEGORIES, ...products.map(p => p.category)])).filter(Boolean)

    const Toggle = ({ val, onChange }: { val: boolean; onChange: () => void }) => (
        <button type="button" onClick={onChange} className="cursor-pointer flex items-center">
            {val
                ? <ToggleRight size={26} className="text-[#1a3a2a]" />
                : <ToggleLeft size={26} className="text-gray-300" />
            }
        </button>
    )

    return (
        <div>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <h1 className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px" }}>Manage Products</h1>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c9a84c] text-white font-bold text-[13px] cursor-pointer hover:brightness-105 transition-all" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <Plus size={16} /> Add New Product
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1a3a2a40]" />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1a3a2a15] bg-white text-[13px] outline-none focus:border-[#1a3a2a40]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                />
            </div>

            {/* Desktop table */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-[#1a3a2a08]" />)}
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block bg-white rounded-2xl border border-[#1a3a2a08] overflow-hidden">
                        <table className="w-full text-[13px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            <thead className="bg-[#1a3a2a08] text-[#1a3a2a60]">
                                <tr>
                                    {['Image', 'Name', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-[2px]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a3a2a08]">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-[#1a3a2a04] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f0e8] shrink-0">
                                                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[#1a3a2a] max-w-[200px] truncate">{p.name}</td>
                                        <td className="px-4 py-3 text-[#1a3a2a80]">{p.brand}</td>
                                        <td className="px-4 py-3 text-[#1a3a2a80]">{p.category}</td>
                                        <td className="px-4 py-3 font-bold text-[#1a3a2a]">₹{p.price}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleStock(p)} className="cursor-pointer">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.in_stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                                    {p.in_stock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(p)} className="p-2 text-[#1a3a2a60] hover:text-[#1a3a2a] hover:bg-[#1a3a2a08] rounded-lg cursor-pointer transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => setDeleteConfirm(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-[#1a3a2a60] text-[14px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                {search ? 'No products match your search.' : 'No products yet. Add your first product!'}
                            </div>
                        )}
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden grid grid-cols-1 gap-3">
                        {filtered.map(p => (
                            <div key={p.id} className="bg-white rounded-2xl border border-[#1a3a2a08] p-4 flex gap-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0">
                                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#1a3a2a] text-[13px] truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>{p.name}</p>
                                    <p className="text-[#1a3a2a60] text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>{p.brand} · {p.category}</p>
                                    <p className="font-bold text-[#1a3a2a] text-[14px] mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>₹{p.price}</p>
                                </div>
                                <div className="flex flex-col gap-1.5 items-end shrink-0">
                                    <button onClick={() => toggleStock(p)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${p.in_stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                        {p.in_stock ? 'In Stock' : 'OOS'}
                                    </button>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(p)} className="p-1.5 text-[#1a3a2a60] hover:text-[#1a3a2a] cursor-pointer"><Pencil size={13} /></button>
                                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={closeModal} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3a2a08] sticky top-0 bg-white z-10">
                                <h2 className="font-bold text-[#1a3a2a]" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "22px" }}>
                                    {editProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={closeModal} className="w-8 h-8 rounded-full bg-[#1a3a2a08] flex items-center justify-center cursor-pointer"><X size={16} /></button>
                            </div>

                            <div className="p-6 space-y-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
                                {/* Image upload */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-2">Product Image</label>
                                    <div className="flex gap-3 items-start">
                                        {form.image_url && (
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0">
                                                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1a3a2a20] text-[13px] font-semibold text-[#1a3a2a] cursor-pointer hover:bg-[#1a3a2a08] transition-all">
                                                <Upload size={14} />
                                                {uploading ? 'Uploading...' : 'Upload Image'}
                                            </button>
                                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                                            <p className="text-[11px] text-[#1a3a2a40] mt-1">Or paste URL below</p>
                                            <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="mt-1 w-full px-3 py-2 rounded-lg border border-[#1a3a2a15] text-[12px] outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Product Name *</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none focus:border-[#1a3a2a40]" placeholder="e.g. Arnica Montana 30C" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Brand</label>
                                        <input
                                            list="brand-suggestions"
                                            value={form.brand}
                                            onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none focus:border-[#1a3a2a40] bg-white"
                                            placeholder="e.g. SBL, Schwabe"
                                        />
                                        <datalist id="brand-suggestions">
                                            {brandSuggestions.map(b => <option key={b} value={b} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Category</label>
                                        <input
                                            list="category-suggestions"
                                            value={form.category}
                                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                            className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none focus:border-[#1a3a2a40] bg-white"
                                            placeholder="e.g. Pain Relief"
                                        />
                                        <datalist id="category-suggestions">
                                            {categorySuggestions.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Price ₹ *</label>
                                        <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none" placeholder="e.g. 250" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Original Price ₹</label>
                                        <input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none" placeholder="e.g. 320" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Weight / Size</label>
                                        <input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none" placeholder="e.g. 30ml, 25g" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Tags (comma sep)</label>
                                        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none" placeholder="immunity, drops" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-[2px] text-[#1a3a2a60] mb-1.5">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#1a3a2a15] text-[13px] outline-none resize-none" placeholder="Product description..." />
                                </div>

                                {/* Toggles */}
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { key: 'is_popular' as const, label: 'Popular' },
                                        { key: 'is_best_seller' as const, label: 'Best Seller' },
                                        { key: 'in_stock' as const, label: 'In Stock' },
                                    ]).map(({ key, label }) => (
                                        <div key={key} className="flex items-center justify-between bg-[#1a3a2a04] rounded-xl px-3 py-2.5">
                                            <span className="text-[12px] font-semibold text-[#1a3a2a]">{label}</span>
                                            <Toggle val={form[key]} onChange={() => setForm(f => ({ ...f, [key]: !f[key] }))} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-[#1a3a2a20] text-[#1a3a2a] font-semibold text-[13px] cursor-pointer hover:bg-[#1a3a2a08] transition-all">Cancel</button>
                                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-[#1a3a2a] text-white font-bold text-[13px] cursor-pointer hover:brightness-110 transition-all disabled:opacity-60">
                                        {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete confirm */}
            {deleteConfirm && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDeleteConfirm(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
                            <Trash2 size={32} className="text-red-400 mx-auto mb-3" />
                            <h3 className="font-bold text-[#1a3a2a] mb-2" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "20px" }}>Delete Product?</h3>
                            <p className="text-[#1a3a2a60] text-[13px] mb-5" style={{ fontFamily: "var(--font-dm-sans)" }}>This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-[#1a3a2a20] text-[#1a3a2a] font-semibold text-[13px] cursor-pointer">Cancel</button>
                                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-[13px] cursor-pointer hover:brightness-105">Delete</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
