import { TopBar } from "@/components/layout/TopBar"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { AboutUs } from "@/components/sections/AboutUs"
import { Specializations } from "@/components/sections/Specializations"
import { Services } from "@/components/Services"
import { ShopTeaser } from "@/components/sections/ShopTeaser"
import { Doctors } from "@/components/DoctorSection"
import { Testimonials } from "@/components/sections/Testimonials"
import { CaseFiles } from '@/components/sections/CaseFiles'
import { Gallery } from "@/components/sections/Gallery"
import { FAQ } from "@/components/sections/FAQ"
import { Locations } from "@/components/sections/Locations"
import { WorkingHours } from "@/components/Timings"
import { ContactForm } from "@/components/sections/ContactForm"
import { TestimonialsForm } from "@/components/sections/TestimonialsForm"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      <TopBar />
      <Navbar />
      <Hero />
      <AboutUs />
      <Specializations />
      <Services />
      <ShopTeaser />
      <Doctors />
      <Testimonials />
      <CaseFiles />
      <TestimonialsForm />
      <Gallery />
      <FAQ />
      <Locations />
      <WorkingHours />
      <ContactForm />
      <Footer />
    </main>
  )
}
