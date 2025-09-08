import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Instagram, Clock } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us - Africa Stickers | Get Quote & Location in Dar Es Salaam",
  description:
    "Contact Africa Stickers for quotes and orders. Located at Lumumba & Tandamti Street, Kariakoo, Dar Es Salaam. Call +255 715 724 727.",
  keywords: "contact africa stickers, dar es salaam location, sticker quotes, kariakoo printing",
  openGraph: {
    title: "Contact Africa Stickers - Get Quote & Location",
    description: "Contact Africa Stickers for quotes and orders. Located in Kariakoo, Dar Es Salaam",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Contact Us</h1>
          <p className="text-xl text-white/90">Get in touch for quotes, orders, or any questions about our services</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Get In Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Our Location</h3>
                    <p className="text-gray-700">Lumumba & Tandamti Street</p>
                    <p className="text-gray-700">Kariakoo, Dar Es Salaam</p>
                    <p className="text-gray-700">Tanzania</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Phone & WhatsApp</h3>
                    <p className="text-gray-700">+255 715 724 727</p>
                    <p className="text-sm text-gray-600">Available for calls and WhatsApp messages</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Instagram className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Follow Us</h3>
                    <p className="text-gray-700">@africa_stickers</p>
                    <a
                      href="https://www.instagram.com/africa_stickers/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit our Instagram
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-black mb-1">Business Hours</h3>
                    <p className="text-gray-700">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-black mb-4">Services We Offer</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Custom Sticker Printing</li>
                  <li>• Vinyl Cutting & Installation</li>
                  <li>• Vehicle Wrapping & Graphics</li>
                  <li>• Reflective Stickers for Safety</li>
                  <li>• T-Shirt Transfer Stickers</li>
                  <li>• Window Tinting & Frosted Films</li>
                  <li>• Wholesale & Bulk Orders</li>
                  <li>• Custom Design Services</li>
                </ul>
              </div>
            </div>

            {/* Contact Form / Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Why Choose Africa Stickers?</h2>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold text-black mb-4">Quality & Reliability</h3>
                <p className="text-gray-700 mb-4">
                  We use only the highest quality materials and state-of-the-art equipment to ensure your stickers and
                  vinyl products meet the highest standards.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Factory direct pricing</li>
                  <li>✓ Fast turnaround times</li>
                  <li>✓ Professional installation</li>
                  <li>✓ Nationwide shipping available</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold text-black mb-4">Wholesale Services</h3>
                <p className="text-gray-700 mb-4">
                  Special pricing and services for wholesale customers. We sell by the roll or by meter (minimum 10+
                  meters) and ship nationwide with reliability and on-time delivery.
                </p>
              </div>

              <div className="text-center">
                <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-3">
                    PATA BEI
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 mt-2">Click to get a quote via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
