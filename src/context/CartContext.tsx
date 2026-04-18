"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Product } from "@/types/product"

export interface CartItem {
    product: Product
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, qty: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    isCartOpen: boolean
    setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setCartOpen] = useState(false)
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        try {
            const saved = localStorage.getItem("drbnds-cart")
            if (saved) setItems(JSON.parse(saved))
        } catch {}
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated) return
        try {
            localStorage.setItem("drbnds-cart", JSON.stringify(items))
        } catch {}
    }, [items, hydrated])

    const addToCart = useCallback((product: Product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id)
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                )
            }
            return [...prev, { product, quantity }]
        })
        setCartOpen(true)
    }, [])

    const removeFromCart = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.product.id !== id))
    }, [])

    const updateQuantity = useCallback((id: string, qty: number) => {
        if (qty < 1) return
        setItems(prev =>
            prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i)
        )
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
    const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setCartOpen,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}
