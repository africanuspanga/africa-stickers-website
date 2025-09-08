"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black text-primary py-4 px-6 sticky top-0 z-40 border-b border-primary/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image src="/images/logo.png" alt="Africa Stickers Logo" width={60} height={60} className="object-contain" />
          <div className="text-xl font-bold text-primary">AFRICA STICKERS</div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            HOME
          </Link>
          <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
            ABOUT
          </Link>
          <Link href="/products" className="text-primary hover:text-primary/80 transition-colors">
            PRODUCTS
          </Link>
          <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
            CONTACT
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-black bg-transparent"
            >
              PATA BEI
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-primary/20">
          <div className="flex flex-col space-y-4 mt-4">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
              HOME
            </Link>
            <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
              ABOUT
            </Link>
            <Link href="/products" className="text-primary hover:text-primary/80 transition-colors">
              PRODUCTS
            </Link>
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
              CONTACT
            </Link>
            <div className="pt-2">
              <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-black bg-transparent w-full"
                >
                  PATA BEI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
