"use client"

import type { CSSProperties } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductLikeButtonProps {
  productId: number
  initialLikes?: number | null
  size?: "sm" | "default" | "lg"
  className?: string
}

interface BurstHeart {
  id: number
  x: number
  y: number
  size: number
  rotate: number
  delay: number
  duration: number
  color: string
}

const HEART_COLORS = ["#ef4444", "#f43f5e", "#ec4899", "#f97316", "#f59e0b", "#d946ef"]

function getRandomInitialLikes() {
  return Math.floor(Math.random() * 16) + 10
}

function createBurstHearts(): BurstHeart[] {
  const heartCount = Math.floor(Math.random() * 5) + 8

  return Array.from({ length: heartCount }, (_, index) => {
    const angle = (index / heartCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const distance = 18 + Math.random() * 22

    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 7 + Math.random() * 6,
      rotate: -24 + Math.random() * 48,
      delay: Math.random() * 110,
      duration: 520 + Math.random() * 240,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }
  })
}

export function ProductLikeButton({ productId, initialLikes, size = "sm", className }: ProductLikeButtonProps) {
  const storageKey = useMemo(() => `africa-stickers-liked-product-${productId}`, [productId])
  const [likes, setLikes] = useState<number>(initialLikes ?? getRandomInitialLikes())
  const [liked, setLiked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBursting, setIsBursting] = useState(false)
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([])
  const [burstId, setBurstId] = useState(0)
  const burstTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current)
      }
    }
  }, [])

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

  const triggerBurstAnimation = () => {
    setBurstHearts(createBurstHearts())
    setIsBursting(true)
    setBurstId((prev) => prev + 1)

    if (burstTimeoutRef.current) {
      window.clearTimeout(burstTimeoutRef.current)
    }

    burstTimeoutRef.current = window.setTimeout(() => {
      setIsBursting(false)
      setBurstHearts([])
      burstTimeoutRef.current = null
    }, 900)
  }

  const handleLike = async () => {
    if (liked || isSubmitting) return

    triggerBurstAnimation()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        if (typeof result.likes_count === "number") {
          setLikes(result.likes_count)
        } else {
          setLikes((prev) => prev + 1)
        }
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
      className={cn("relative overflow-visible", className)}
      onClick={handleLike}
      disabled={liked || isSubmitting}
      aria-label={liked ? "You liked this product" : "Like this product"}
    >
      {isBursting && (
        <span
          key={`ring-${burstId}`}
          className="like-burst-ring pointer-events-none absolute left-1/2 top-1/2"
          aria-hidden="true"
        />
      )}

      {burstHearts.map((heart) => {
        const burstStyle = {
          "--like-heart-x": `${heart.x}px`,
          "--like-heart-y": `${heart.y}px`,
          "--like-heart-rotate": `${heart.rotate}deg`,
          "--like-heart-duration": `${heart.duration}ms`,
          "--like-heart-delay": `${heart.delay}ms`,
          width: `${heart.size}px`,
          height: `${heart.size}px`,
          color: heart.color,
        } as CSSProperties

        return (
          <Heart
            key={`${burstId}-${heart.id}`}
            className="like-burst-heart pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={burstStyle}
            aria-hidden="true"
          />
        )
      })}

      <Heart
        className={cn(
          "w-4 h-4 transition-colors duration-200",
          (liked || isBursting) && "fill-red-500 text-red-500",
          isBursting && "like-main-heart-pop",
        )}
      />
      <span
        className={cn(
          "ml-1 text-xs font-medium tabular-nums transition-colors duration-200",
          (liked || isBursting) && "font-semibold text-red-600",
          isBursting && "like-count-pop",
        )}
      >
        {likes}
      </span>
    </Button>
  )
}
