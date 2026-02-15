"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductLikeButtonProps {
  productId: number
  initialLikes?: number | null
  size?: "sm" | "default" | "lg"
  className?: string
}

function getRandomInitialLikes() {
  return Math.floor(Math.random() * 16) + 10
}

export function ProductLikeButton({ productId, initialLikes, size = "sm", className }: ProductLikeButtonProps) {
  const storageKey = useMemo(() => `africa-stickers-liked-product-${productId}`, [productId])
  const [likes, setLikes] = useState<number>(initialLikes ?? getRandomInitialLikes())
  const [liked, setLiked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hasLiked = window.localStorage.getItem(storageKey) === "true"
    setLiked(hasLiked)
  }, [storageKey])

  useEffect(() => {
    if (typeof initialLikes === "number") {
      setLikes(initialLikes)
    }
  }, [initialLikes])

  const handleLike = async () => {
    if (liked || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        setLikes(result.likes_count ?? likes + 1)
      } else {
        setLikes((prev) => prev + 1)
      }
    } catch (error) {
      console.error("[v0] Like request failed:", error)
      setLikes((prev) => prev + 1)
    } finally {
      setLiked(true)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, "true")
      }
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      className={className}
      onClick={handleLike}
      disabled={liked || isSubmitting}
      aria-label={liked ? "You liked this product" : "Like this product"}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
      <span className="ml-1 text-xs font-medium">{likes}</span>
    </Button>
  )
}
