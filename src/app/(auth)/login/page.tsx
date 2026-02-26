"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            // Fetch profile to determine role-based redirection
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .maybeSingle()

            if (profileError) {
                console.error("Error fetching profile:", profileError?.message || JSON.stringify(profileError))
                setError("Error loading profile. Please contact support.")
                setLoading(false)
                return
            }

            if (!profile) {
                console.error("Profile missing for user:", data.user.id)
                setError("Your profile record is missing. Please contact clinic support.")
                setLoading(false)
                return
            }

            if (profile.role === "doctor") {
                router.push("/doctor-dashboard")
            } else {
                router.push("/patient-dashboard")
            }
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
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
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
                        <CardTitle className="text-3xl font-bold text-deep-teal tracking-tight">Welcome Back</CardTitle>
                        <CardDescription className="text-sage-green font-medium">
                            Continue your wellness journey with us.
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
                                        required
                                        className="pl-10 h-12 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl text-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-deep-teal font-medium">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-accent-teal hover:text-deep-teal hover:underline font-bold transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-green" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 h-12 border-deep-teal/10 bg-white/50 focus-visible:ring-deep-teal/20 transition-all rounded-xl text-lg"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-semibold text-destructive mt-2 bg-destructive/5 border border-destructive/10 p-3 rounded-xl text-center"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-bold bg-deep-teal hover:bg-deep-teal/90 text-white shadow-lg shadow-deep-teal/20 group rounded-xl mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t border-deep-teal/5 bg-soft-mint/10 py-6">
                        <p className="text-sm text-center text-sage-green">
                            New to our clinic?{" "}
                            <Link
                                href="/signup"
                                className="text-deep-teal font-bold hover:underline underline-offset-4"
                            >
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
