import { Instagram, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">AFRICA STICKERS</h3>
            <p className="text-white/80 mb-4 text-pretty">
              Premium sticker and vinyl solutions in Tanzania. Quality products for vehicles, businesses, and more.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://www.instagram.com/africa_stickers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Instagram size={24} />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-primary" />
                <span className="text-white/80">+255 715 724 727</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-1" />
                <span className="text-white/80">
                  Lumumba & Tandamti Street
                  <br />
                  Kariakoo, Dar Es Salaam
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-white/80">
              <li>Custom Sticker Printing</li>
              <li>Vehicle Wrapping</li>
              <li>Reflective Stickers</li>
              <li>Window Tinting</li>
              <li>Interior Decals</li>
              <li>Wholesale Supply</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center">
          <p className="text-white/60">© 2025 Africa Stickers. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
