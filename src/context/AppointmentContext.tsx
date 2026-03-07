"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { AppointmentModal } from "@/components/ui/AppointmentModal"

type AppointmentContextType = {
    isOpen: boolean
    preSelectedDoctorId: number | null
    openModal: (doctorId?: number) => void
    closeModal: () => void
}

const AppointmentContext = createContext<AppointmentContextType>({
    isOpen: false,
    preSelectedDoctorId: null,
    openModal: () => { },
    closeModal: () => { },
})

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [preSelectedDoctorId, setPreSelectedDoctorId] = useState<number | null>(null)

    const openModal = useCallback((doctorId?: number) => {
        setPreSelectedDoctorId(doctorId ?? null)
        setIsOpen(true)
        document.body.style.overflow = "hidden"
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
        setPreSelectedDoctorId(null)
        document.body.style.overflow = ""
    }, [])

    return (
        <AppointmentContext.Provider value={{ isOpen, preSelectedDoctorId, openModal, closeModal }}>
            {children}
            {isOpen && (
                <AppointmentModal
                    onClose={closeModal}
                    preSelectedDoctorId={preSelectedDoctorId}
                />
            )}
        </AppointmentContext.Provider>
    )
}

export const useAppointment = () => useContext(AppointmentContext)
