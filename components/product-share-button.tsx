"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Instagram, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductShareButtonProps {
  productName: string
  productSlug: string
}

async function copyTextToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

export function ProductShareButton({ productName, productSlug }: ProductShareButtonProps) {
  const [shareUrl, setShareUrl] = useState(`https://www.africastickers.co.tz/products/${productSlug}`)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCopySuccess, setIsCopySuccess] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [])

  const canUseNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function"
  const shareMessage = `Check this product from Africa Stickers: ${productName}`

  const showFeedback = (message: string, copySuccess = false) => {
    setFeedback(message)
    setIsCopySuccess(copySuccess)
    window.setTimeout(() => {
      setFeedback(null)
      setIsCopySuccess(false)
    }, 2500)
  }

  const handleCopyLink = async () => {
    try {
      await copyTextToClipboard(shareUrl)
      showFeedback("Link copied. You can paste it anywhere.", true)
    } catch (error) {
      console.error("[v0] Failed to copy link:", error)
      showFeedback("Copy failed. Please copy from the URL bar.")
    }
  }

  const handleNativeShare = async () => {
    if (!canUseNativeShare) {
      handleCopyLink()
      return
    }

    try {
      await navigator.share({
        title: `${productName} | Africa Stickers`,
        text: shareMessage,
        url: shareUrl,
      })
    } catch (error) {
      if ((error as { name?: string })?.name !== "AbortError") {
        console.error("[v0] Native share failed:", error)
        showFeedback("Could not open share menu. Try Copy Link instead.")
      }
    }
  }

  const handleWhatsAppShare = () => {
    const waText = encodeURIComponent(`${shareMessage}\n${shareUrl}`)
    window.open(`https://wa.me/?text=${waText}`, "_blank", "noopener,noreferrer")
  }

  const handleInstagramShare = async () => {
    await handleCopyLink()
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")
    showFeedback("Link copied. Paste it in Instagram story, post, or DM.", true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" aria-label="Share product">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border-0 bg-gradient-to-b from-white to-neutral-100 p-0">
        <div className="rounded-2xl border border-black/5 p-5 shadow-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-black">Share This Product</DialogTitle>
            <DialogDescription className="text-sm text-black/65">
              Send this page quickly on your favorite channels.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-xl border border-black/10 bg-white px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-black/50">Product</p>
            <p className="text-sm font-semibold text-black line-clamp-1">{productName}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-xl border-black/10 bg-white text-black hover:bg-black hover:text-white"
              onClick={handleNativeShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-xl border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-600 hover:text-white"
              onClick={handleInstagramShare}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-xl border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white"
              onClick={handleCopyLink}
            >
              {isCopySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopySuccess ? "Copied" : "Copy Link"}
            </Button>
          </div>

          <div className="mt-3 rounded-lg bg-black/5 px-3 py-2">
            <p className="line-clamp-1 text-xs text-black/70">{shareUrl}</p>
          </div>

          {feedback && <p className="mt-3 text-xs font-medium text-black/70">{feedback}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
