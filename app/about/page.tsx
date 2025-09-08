import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us - Africa Stickers | Premium Sticker Solutions in Tanzania",
  description:
    "Learn about Africa Stickers, your trusted partner for premium stickers and vinyl solutions in Dar Es Salaam. Quality printing services since our establishment.",
  keywords: "about africa stickers, sticker company tanzania, vinyl printing dar es salaam, custom graphics",
  openGraph: {
    title: "About Africa Stickers - Premium Sticker Solutions",
    description:
      "Learn about Africa Stickers, your trusted partner for premium stickers and vinyl solutions in Dar Es Salaam",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">About Africa Stickers</h1>
          <p className="text-xl text-white/90">
            Your trusted partner for premium stickers and vinyl solutions in Tanzania
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Africa Stickers has been serving the Dar Es Salaam community with high-quality sticker and vinyl
                solutions. Located in the heart of Kariakoo at Lumumba & Tandamti Street, we have built a reputation for
                excellence and reliability in the printing and graphics industry.
              </p>
              <p className="text-gray-700 mb-4">
                We specialize in custom stickers, vinyl cutting, vehicle wrapping, and a wide range of printing
                services. Our commitment to quality and customer satisfaction has made us the go-to choice for both
                individual customers and wholesale clients across Tanzania.
              </p>
              <p className="text-gray-700">
                Whether you need stickers for your business, vehicle graphics, or custom designs, we have the expertise
                and equipment to deliver exceptional results every time.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/store-front-night.jpg"
                alt="Africa Stickers Store Front at Night"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg order-2 lg:order-1">
              <img
                src="/images/office-handshake.jpg"
                alt="Africa Stickers Office - Customer Service"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                To provide high-quality, affordable sticker and vinyl solutions that help our customers express their
                creativity, promote their businesses, and achieve their goals. We are committed to delivering
                exceptional service with fast turnaround times and competitive pricing.
              </p>
              <p className="text-gray-700 mb-6">
                We believe in building long-term partnerships with our clients, offering reliable products and services
                that exceed expectations. Our team is dedicated to staying current with the latest technology and
                techniques in the printing and graphics industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Work With Us?</h2>
          <p className="text-xl text-white/90 mb-8">Contact us today for a free quote on your next project</p>
          <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-3">
              PATA BEI
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
