"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2, User, Mail, Lock, Phone, Key, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // OTP Flow States
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const userEmail = (formData.get("email") as string).trim()
        const password = formData.get("password") as string
        const full_name = (formData.get("fullName") as string).trim()
        const phone = (formData.get("phone") as string).trim()

        const { data, error: authError } = await supabase.auth.signUp({
            email: userEmail,
            password,
            options: {
                data: {
                    full_name,
                    phone,
                    role: 'patient', // Security fix: Hardcoded role
                },
            },
        })

        if (authError) {
            console.error("Signup Error:", authError.message)
            setError(authError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            setEmail(userEmail)
            setIsOtpSent(true)
            toast.success("Verification code sent!", {
                description: "Please check your email for the 6-digit code."
            })
        }
        setLoading(false)
    }

    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error("Invalid Code", { description: "Please enter a valid 6-digit code." })
            return
        }

        setLoading(true)
        setError(null)

        const { data, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup'
        })

        if (verifyError) {
            setError(verifyError.message)
            toast.error("Verification Failed", { description: verifyError.message })
            setLoading(false)
            return
        }

        if (data.user) {
            toast.success("Account Verified!", { description: "Welcome to Dr. BND&apos;s Clinic." })
            router.push("/patient-dashboard")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-soft-mint to-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="border-deep-teal/10 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                    <div className="h-2 bg-linear-to-r from-deep-teal via-accent-teal to-soft-mint" />
                    <CardHeader className="space-y-2 text-center pb-2">
                        <div className="flex justify-center mb-2">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <Image
                                    src="/logo.jpeg"
                                    alt="Dr. BND Clinic"
                                    width={180}
                                    height={60}
                                    className="object-contain"
                                />
                            </motion.div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-deep-teal tracking-tight">
                            {isOtpSent ? "Verify Email" : "Create Account"}
                        </CardTitle>
                        <CardDescription className="text-sage-green font-medium">
                            {isOtpSent
                                ? "We&apos;ve sent a 6-digit code to your email."
                                : "Join Dr. BND&apos;s Clinic for specialized care."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <AnimatePresence mode="wait">
                            {!isOtpSent ? (
                                <motion.form
                                    key="signup-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-deep-teal font-medium ml-1">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder="Enter your full name"
                                                required
                                                className="pl-10 h-11 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-deep-teal font-medium ml-1">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                placeholder="+91 00000 00000"
                                                required
                                                className="pl-10 h-11 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-deep-teal font-medium ml-1">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                                className="pl-10 h-11 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-deep-teal font-medium ml-1">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                className="pl-10 h-11 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-xs font-semibold text-destructive mt-2 bg-destructive/5 border border-destructive/10 p-3 rounded-xl text-center">
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-deep-teal hover:bg-deep-teal/90 text-white shadow-lg shadow-deep-teal/20 group rounded-xl mt-4 cursor-pointer"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Complete Registration
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        )}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleVerifyOtp}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <Label htmlFor="otp" className="text-deep-teal font-bold text-center block mb-2 tracking-widest uppercase text-xs">Enter 6-Digit Code</Label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-teal" />
                                            <Input
                                                id="otp"
                                                type="text"
                                                maxLength={6}
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                className="pl-12 h-14 text-2xl tracking-[0.5em] font-black text-center border-2 border-deep-teal/10 bg-soft-mint/10 focus-visible:ring-deep-teal focus-visible:border-deep-teal rounded-2xl"
                                                required
                                            />
                                        </div>
                                        <p className="text-center text-sm text-cool-grey font-medium">
                                            Waiting for code at <span className="text-deep-teal font-bold">{email}</span>
                                        </p>
                                    </div>

                                    {error && (
                                        <p className="text-xs font-semibold text-destructive bg-destructive/5 border border-destructive/10 p-3 rounded-xl text-center">
                                            {error}
                                        </p>
                                    )}

                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            className="w-full h-14 text-lg font-black bg-deep-teal hover:bg-deep-teal/90 text-white shadow-xl shadow-deep-teal/20 rounded-2xl cursor-pointer"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Complete"}
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={() => setIsOtpSent(false)}
                                            className="w-full flex items-center justify-center gap-2 text-sage-green hover:text-deep-teal font-bold transition-colors py-2 text-sm cursor-pointer"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back to Sign Up
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t border-deep-teal/5 bg-soft-mint/10 py-6">
                        {!isOtpSent && (
                            <p className="text-sm text-center text-sage-green">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-deep-teal font-bold hover:underline underline-offset-4"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        )}
                        {isOtpSent && (
                            <p className="text-xs text-center text-sage-green/60 px-6">
                                Didn&apos;t receive the code? Please check your spam folder or wait a few minutes before trying again.
                            </p>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
