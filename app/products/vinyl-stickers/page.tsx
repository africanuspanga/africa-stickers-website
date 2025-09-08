"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"

export default function VinylStickersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">VINYL STICKERS</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Premium quality vinyl stickers in a wide range of colors and finishes. Perfect for indoor and outdoor
              applications with excellent durability and adhesion.
            </p>
          </div>

          {/* Main Product Image */}
          <div className="mb-16">
            <img
              src="/images/vinyl-main.png"
              alt="Vinyl Stickers Collection"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Color Options Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <img
                src="/images/vinyl-1.png"
                alt="Basic Colors - Black, White, Red, Blue, Light Purple"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">Basic Colors</h3>
              <p className="text-white/80">Essential colors including Black, White, Red, Blue, and Light Purple</p>
            </div>

            <div className="text-center">
              <img
                src="/images/vinyl-2.png"
                alt="Green & Yellow Variants - Light Green, Dark Green, Yellow, Orange"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">Green & Yellow Variants</h3>
              <p className="text-white/80">
                Nature-inspired colors: Light Green, Dark Green, Yellow variants, and Orange
              </p>
            </div>

            <div className="text-center">
              <img
                src="/images/vinyl-3.png"
                alt="Premium Finishes - Pink variants, Gold Matt, Gold Mirror"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">Premium Finishes</h3>
              <p className="text-white/80">Luxury options including Pink variants, Gold Matt, and Gold Mirror</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4">Product Features</h3>
              <ul className="space-y-2 text-white/90">
                <li>• High-quality adhesive vinyl</li>
                <li>• Weather resistant and durable</li>
                <li>• Easy to apply and remove</li>
                <li>• Suitable for indoor and outdoor use</li>
                <li>• Available in various sizes</li>
              </ul>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4">Applications</h3>
              <ul className="space-y-2 text-white/90">
                <li>• Vehicle graphics and wraps</li>
                <li>• Signage and displays</li>
                <li>• Wall decorations</li>
                <li>• Product labeling</li>
                <li>• Custom designs and logos</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3"
              onClick={() => window.open("https://wa.me/255715724727", "_blank")}
            >
              Pata Bei - Get Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
