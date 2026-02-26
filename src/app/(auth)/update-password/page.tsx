"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Ensure user is authenticated via reset link
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Invalid or expired session")
                router.push("/login")
            }
        }
        checkSession()
    }, [router])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) throw error

            toast.success("Password updated!", {
                description: "Your password has been changed successfully.",
            })

            router.push("/login")
        } catch (error: unknown) {
            const err = error as Error
            toast.error("Update failed", {
                description: err.message || "Failed to update password. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-soft-mint to-white p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="border-deep-teal/10 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                    <div className="h-2 bg-linear-to-r from-deep-teal via-accent-teal to-soft-mint" />
                    <CardHeader className="space-y-2 text-center pb-2">
                        <div className="flex justify-center mb-2">
                            <motion.div
                                initial={{ rotate: -20, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 rounded-3xl bg-deep-teal flex items-center justify-center text-white shadow-xl"
                            >
                                <Lock className="w-9 h-9 text-white" />
                            </motion.div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-deep-teal tracking-tight">New Password</CardTitle>
                        <CardDescription className="text-sage-green font-medium">
                            Set your new account password below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-deep-teal font-medium ml-1">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 h-12 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-deep-teal font-medium ml-1">Confirm New Password</Label>
                                <div className="relative">
                                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10 h-12 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl text-lg"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-bold bg-deep-teal hover:bg-deep-teal/90 text-white shadow-lg shadow-deep-teal/20 group rounded-xl mt-4 cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Update Password
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
