import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { ProductsSection } from "@/components/products-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WholesaleSection } from "@/components/wholesale-section"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseUs />
      <ProductsSection />
      <TestimonialsSection />
      <WholesaleSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
