import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StickerZaMbaoPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">STICKER ZA MBAO</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Premium wood-grain vinyl stickers perfect for furniture, interior design, and decorative applications.
              Available in various wood patterns and colors.
            </p>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Product Specifications */}
          <div className="bg-black text-white p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Product Specifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">Dimensions</h3>
                <p className="text-white/90">Length: 50 meters (UREFU MITA 50)</p>
                <p className="text-white/90">Width: 1.2 meters (UPANA MITA 1.2)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">Features</h3>
                <ul className="text-white/90 space-y-2">
                  <li>• High-quality vinyl material</li>
                  <li>• Realistic wood grain patterns</li>
                  <li>• Easy application and removal</li>
                  <li>• Durable and long-lasting</li>
                  <li>• Multiple color options available</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Available Designs - Image 1 */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Available Designs - Collection 1</h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <img
                src="/images/sticker-mbao-1.jpg"
                alt="Wood Sticker Collection 1 - Various wood grain patterns and colors"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-center text-gray-600 mt-4">
                Product codes: 193, 192, 1537, 1390, 1372, 168, 1323, W02, W11
              </p>
            </div>
          </div>

          {/* Available Designs - Image 2 */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Available Designs - Collection 2</h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <img
                src="/images/sticker-mbao-2.jpg"
                alt="Wood Sticker Collection 2 - Premium wood grain patterns"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-center text-gray-600 mt-4">
                Product codes: 1300, 1301, 1303, 1302, 1288, 1322, 1350, 1353, 1390, 097
              </p>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-primary/10 p-8 rounded-lg mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Furniture</h3>
                <p className="text-gray-700">Transform old furniture with realistic wood patterns</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Interior Design</h3>
                <p className="text-gray-700">Create stunning accent walls and surfaces</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Commercial Spaces</h3>
                <p className="text-gray-700">Professional applications for offices and shops</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Ready to Transform Your Space?</h2>
            <p className="text-xl text-gray-700 mb-8">Contact us today for pricing and availability</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3">
                <a href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
                  Pata Bei - WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white px-8 py-3 bg-transparent"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
