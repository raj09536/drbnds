import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { DoctorSection } from "@/components/DoctorSection"
import { Timings } from "@/components/Timings"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <DoctorSection />
      <Timings />
      <Footer />
    </main>
  )
}
