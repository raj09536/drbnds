"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowRight, Loader2, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })

            if (error) throw error

            toast.success("Reset link sent!", {
                description: "Check your email for the password reset link!",
            })
        } catch (error: unknown) {
            const err = error as Error
            toast.error("Error", {
                description: err.message || "Failed to send reset link. Please try again.",
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
                                <Heart className="w-9 h-9 fill-white/20" />
                            </motion.div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-deep-teal tracking-tight">Reset Password</CardTitle>
                        <CardDescription className="text-sage-green font-medium">
                            Enter your email to receive a reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-deep-teal font-medium ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        Send Reset Link
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t border-deep-teal/5 bg-soft-mint/10 py-6">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm text-deep-teal font-bold hover:underline underline-offset-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
