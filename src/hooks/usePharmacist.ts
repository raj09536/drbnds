"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface PharmacistSession {
    id: string
    name: string
    username: string
}

export function usePharmacist() {
    const [pharmacist, setPharmacist] = useState<PharmacistSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        try {
            const raw = localStorage.getItem("pharmacist_session")
            if (raw) setPharmacist(JSON.parse(raw))
        } catch {}
        setIsLoading(false)
    }, [])

    const logout = () => {
        localStorage.removeItem("pharmacist_session")
        router.push("/pharmacy/login")
    }

    return { pharmacist, isLoading, logout }
}
