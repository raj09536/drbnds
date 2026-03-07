"use client"

import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0)
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (!shouldStart || hasAnimated.current) return
        hasAnimated.current = true

        let startTime: number | null = null
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // ease-out: starts fast, slows down
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))

            if (progress < 1) {
                requestAnimationFrame(step)
            } else {
                setCount(target)
            }
        }

        requestAnimationFrame(step)
    }, [shouldStart, target, duration])

    return count
}
