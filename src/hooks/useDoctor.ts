'use client'
import { useEffect, useState } from 'react'

export function useDoctor() {
    const [doctor, setDoctor] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Only runs on client side — never on server
        try {
            const raw = localStorage.getItem('doctor_session')
            if (raw) {
                setDoctor(JSON.parse(raw))
            }
        } catch {
            setDoctor(null)
        } finally {
            setLoading(false)
        }
    }, [])

    return { doctor, loading }
}
