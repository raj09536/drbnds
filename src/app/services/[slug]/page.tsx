"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Phone } from "lucide-react"
import { AppointmentModal } from "@/components/AppointmentModal"
import { useEffect, useState } from "react"

const SERVICES_DATA: Record<string, any> = {
    "all-type-consultation": {
        title: "All Type Consultation",
        subtitle: "Comprehensive Medical Consultation Services",
        image: "/doctor.jpeg",
        description:
            "Our clinic offers thorough and personalised consultations across multiple modes to ensure every patient receives the care they deserve, regardless of location or circumstance.",
        features: [
            {
                title: "In-Person Consultation",
                desc: "Meet our doctors face-to-face at either of our two clinic locations in Dehradun or Bijnor for a comprehensive physical examination and diagnosis.",
            },
            {
                title: "Video Consultation",
                desc: "Connect with our specialists via secure video call from the comfort of your home. Ideal for follow-up appointments and patients located outside the city.",
            },
            {
                title: "Audio Consultation",
                desc: "A convenient telephone-based consultation for quick medical guidance, prescription renewals, and follow-up discussions.",
            },
        ],
        process: [
            "Book your appointment online or by phone",
            "Receive confirmation with your appointment details",
            "Attend your consultation at the scheduled time",
            "Receive your personalised treatment plan",
        ],
    },
    "medicine-home-delivery": {
        title: "Medicine Home Delivery",
        subtitle: "Authentic Homoeopathic Medicines Delivered to Your Doorstep",
        image: "/homeopathic-medicine.jpg",
        description:
            "We provide prompt and reliable delivery of genuine homoeopathic medicines directly to your home, ensuring you never miss a dose of your prescribed treatment.",
        features: [
            {
                title: "Authentic Medicines",
                desc: "All medicines are sourced from certified homoeopathic pharmacies, ensuring the highest standards of quality and purity.",
            },
            {
                title: "Pan-India Delivery",
                desc: "We deliver medicines across India. Simply share your prescription and delivery address to get started.",
            },
            {
                title: "Discreet Packaging",
                desc: "All orders are packed securely and delivered in discreet packaging to protect your privacy.",
            },
        ],
        process: [
            "Share your prescription with us via WhatsApp or email",
            "Receive a confirmation and payment details",
            "Complete payment securely",
            "Medicines dispatched within 24 hours",
        ],
    },
    "diet-management": {
        title: "Diet Management",
        subtitle: "Personalised Nutritional Guidance for Holistic Healing",
        image: "/diet.jpg",
        description:
            "Our diet management programme is designed to complement your homoeopathic treatment by providing scientifically sound and personalised nutritional advice tailored to your specific health condition.",
        features: [
            {
                title: "Disease-Specific Diet Plans",
                desc: "Customised dietary recommendations based on your diagnosis, including conditions such as diabetes, thyroid disorders, PCOD, and digestive issues.",
            },
            {
                title: "Goal-Oriented Nutrition",
                desc: "Whether your goal is weight management, improved immunity, or enhanced energy levels, our diet plans are structured to help you achieve measurable results.",
            },
            {
                title: "Ongoing Dietary Support",
                desc: "Regular follow-up sessions to monitor progress, address challenges, and adjust your diet plan as required.",
            },
        ],
        process: [
            "Initial consultation to understand your health goals and medical history",
            "Preparation of a personalised diet plan",
            "Weekly follow-up to track progress",
            "Adjustments made based on your response and feedback",
        ],
    },
    "cosmetic-products": {
        title: "Cosmetic Products & Treatments",
        subtitle: "Natural Beauty Solutions Rooted in Homoeopathic Science",
        image: "/cosmetic.jpg",
        description:
            "Our range of homoeopathic cosmetic products and treatments address skin and hair concerns from the inside out, offering natural and long-lasting solutions without harmful chemicals.",
        features: [
            {
                title: "Skin Care Solutions",
                desc: "Targeted treatments for acne, pigmentation, melasma, dark circles, and premature ageing using natural homoeopathic formulations.",
            },
            {
                title: "Hair Care Treatments",
                desc: "Effective solutions for hair fall, alopecia, premature greying, and dandruff through constitutional homoeopathic treatment.",
            },
            {
                title: "Weight Management",
                desc: "A holistic approach to obesity and weight gain, addressing the underlying causes through medicine, diet, and lifestyle guidance.",
            },
        ],
        process: [
            "Detailed skin or hair assessment by our specialist",
            "Identification of the root cause of your concern",
            "Prescription of appropriate homoeopathic treatment",
            "Regular monitoring and follow-up for sustained results",
        ],
    },
    "diet-chart-service": {
        title: "Diet Chart Service",
        subtitle: "Structured Dietary Plans for Every Health Need",
        image: "/diet-chart.jpg",
        description:
            "Our Diet Chart Service provides detailed, easy-to-follow dietary plans created by experienced professionals, specifically designed to support your treatment and overall well-being.",
        features: [
            {
                title: "Condition-Specific Charts",
                desc: "Tailored diet charts for conditions including diabetes, hypertension, thyroid disorders, anaemia, and digestive complaints.",
            },
            {
                title: "Balanced Nutritional Planning", desc: "Each diet chart ensures a balance of essential macronutrients and micronutrients, adapted to your cultural food preferences and lifestyle."
            },
            {
                title: "Digital Delivery",
                desc: "Receive your personalised diet chart digitally via WhatsApp or email for convenient reference at any time.",
            },
        ],
        process: [
            "Submit your health details and dietary preferences",
            "Our nutritionist prepares your personalised chart",
            "Chart delivered digitally within 48 hours",
            "Follow-up consultation included to address any queries",
        ],
    },
}

export default function ServicePage() {
    const params = useParams()
    const router = useRouter()
    const [service, setService] = useState<any>(null)

    useEffect(() => {
        const slug = params.slug as string
        if (slug && SERVICES_DATA[slug]) {
            setService(SERVICES_DATA[slug])
        } else if (slug) {
            router.push("/") // Redirect to home if slug not found
        }
    }, [params.slug, router])

    if (!service) return null

    return (
        <main className="min-h-screen bg-white">
            {/* Nav Helper */}
            <div className="absolute top-8 left-8 z-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Services</span>
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative h-[320px] w-full flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 px-6 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif font-bold tracking-tight mb-4">
                        {service.title}
                    </h1>
                    <p className="text-white/70 text-base md:text-lg lg:text-xl font-sans tracking-wide max-w-2xl mx-auto">
                        {service.subtitle}
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-20 px-6">
                <div className="max-w-[900px] mx-auto">
                    {/* Section A — About */}
                    <div className="mb-16">
                        <p className="text-[#333] font-sans leading-[1.9] text-base md:text-[17px]">
                            {service.description}
                        </p>
                    </div>

                    {/* Section B — Features */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-serif font-bold text-forest mb-8 border-b border-forest/10 pb-4">
                            What We Offer
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            {service.features.map((feature: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="border-l-4 border-forest bg-forest/3 p-6 rounded-r-xl transition-all hover:bg-forest/5"
                                >
                                    <h3 className="text-[15px] font-bold text-forest uppercase tracking-wider mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#64748b] text-[14px] leading-[1.8]">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section C — Process */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-serif font-bold text-forest mb-8 border-b border-forest/10 pb-4">
                            How It Works
                        </h2>
                        <div className="space-y-6">
                            {service.process.map((step: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <p className="text-[#334155] text-[14px] font-medium tracking-tight">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="bg-[#fdf9f2] py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-[#64748b] mb-10 text-lg max-w-xl mx-auto">
                        Book a session today and experience holistic healing tailored specifically for you.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <AppointmentModal>
                            <button className="bg-forest text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-forest/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Book a Consultation
                            </button>
                        </AppointmentModal>
                        
                        <a 
                            href="tel:+918191919949" 
                            className="flex items-center gap-3 text-forest font-bold hover:underline decoration-2 underline-offset-4"
                        >
                            <Phone className="w-5 h-5" />
                            <span>+91 8191919949</span>
                        </a>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap');
                
                .font-serif {
                    font-family: 'Cormorant+Garamond', serif !important;
                }
                .font-sans {
                    font-family: 'DM Sans', sans-serif !important;
                }
            `}</style>
        </main>
    )
}
