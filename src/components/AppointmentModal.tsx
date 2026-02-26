"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { BookingForm } from "./BookingForm"

interface AppointmentModalProps {
    children: React.ReactElement<{ onClick?: React.MouseEventHandler }>
    onSuccess?: () => void
}

export function AppointmentModal({ children, onSuccess }: AppointmentModalProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const { user, loading } = useAuth()
    const router = useRouter()

    const handleTriggerClick = (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        if (children.props.onClick) {
            children.props.onClick(e)
        }

        if (e.defaultPrevented) return

        e.preventDefault()
        e.stopPropagation()

        if (loading) return

        if (!user) {
            router.push("/login")
            return
        }

        setIsOpen(true)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {React.cloneElement(children, {
                onClick: handleTriggerClick
            } as React.HTMLAttributes<HTMLElement>)}
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white border-deep-teal/10 rounded-[2.5rem]">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Book an Appointment</DialogTitle>
                        <DialogDescription>
                            Schedule your consultation with Dr. B. N. Dwivedy
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <BookingForm
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        setIsOpen(false)
                        if (onSuccess) onSuccess()
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
