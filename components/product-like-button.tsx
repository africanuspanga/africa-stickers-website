"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductLikeButtonProps {
  productId: number
  initialLikes?: number | null
  size?: "sm" | "default" | "lg"
  className?: string
}

interface FloatingHeart {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
  color: string
}

function getRandomInitialLikes() {
  return Math.floor(Math.random() * 16) + 10
}

const HEART_COLORS = [
  "#ef4444", // red-500
  "#f87171", // red-400
  "#fca5a5", // red-300
  "#fb923c", // orange-400
  "#f472b6", // pink-400
  "#e879f9", // fuchsia-400
  "#fbbf24", // amber-400
]

export function ProductLikeButton({ productId, initialLikes, size = "sm", className }: ProductLikeButtonProps) {
  const storageKey = useMemo(() => `africa-stickers-liked-product-${productId}`, [productId])
  const [likes, setLikes] = useState<number>(initialLikes ?? getRandomInitialLikes())
  const [liked, setLiked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [showRing, setShowRing] = useState(false)
  const heartIdCounter = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const spawnHearts = useCallback(() => {
    const newHearts: FloatingHeart[] = []
    const count = 8 + Math.floor(Math.random() * 5) // 8-12 hearts

    for (let i = 0; i < count; i++) {
      heartIdCounter.current += 1
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const distance = 30 + Math.random() * 40
      newHearts.push({
        id: heartIdCounter.current,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20,
        scale: 0.4 + Math.random() * 0.6,
        rotation: (Math.random() - 0.5) * 60,
        opacity: 1,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      })
    }

    setFloatingHearts(newHearts)
    setShowRing(true)
    setIsAnimating(true)

    // Clean up after animation
    setTimeout(() => {
      setFloatingHearts([])
      setShowRing(false)
      setIsAnimating(false)
    }, 900)
  }, [])

  const handleLike = async () => {
    if (liked || isSubmitting) return

    setIsSubmitting(true)
    spawnHearts()

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
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Expanding ring */}
      {showRing && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 8,
            height: 8,
            border: "2px solid #ef4444",
            animation: "like-ring 0.6s ease-out forwards",
          }}
        />
      )}

      {/* Floating hearts burst */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            fontSize: `${10 * heart.scale}px`,
            color: heart.color,
            animation: "like-float 0.8s ease-out forwards",
            // Use CSS custom properties for dynamic values
            ["--float-x" as string]: `${heart.x}px`,
            ["--float-y" as string]: `${heart.y}px`,
            ["--float-rot" as string]: `${heart.rotation}deg`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
      ))}

      <Button
        type="button"
        variant="ghost"
        size={size}
        className={`${className} transition-transform duration-200 ${isAnimating ? "scale-125" : ""}`}
        onClick={handleLike}
        disabled={liked || isSubmitting}
        aria-label={liked ? "You liked this product" : "Like this product"}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            liked
              ? "fill-red-500 text-red-500 scale-110"
              : "group-hover:text-red-400"
          } ${isAnimating ? "animate-[like-bounce_0.4s_ease-in-out]" : ""}`}
        />
        <span
          className={`ml-1 text-xs font-medium transition-all duration-300 ${
            liked ? "text-red-500 font-bold" : ""
          }`}
        >
          {likes}
        </span>
      </Button>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes like-float {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%)
              translate(
                calc(var(--float-x) * 0.5),
                calc(var(--float-y) * 0.5)
              )
              rotate(calc(var(--float-rot) * 0.5))
              scale(1.2);
          }
          100% {
            transform: translate(-50%, -50%)
              translate(var(--float-x), var(--float-y))
              rotate(var(--float-rot))
              scale(0);
            opacity: 0;
          }
        }

        @keyframes like-ring {
          0% {
            width: 8px;
            height: 8px;
            opacity: 1;
            border-width: 3px;
          }
          100% {
            width: 60px;
            height: 60px;
            opacity: 0;
            border-width: 1px;
          }
        }

        @keyframes like-bounce {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.5);
          }
          50% {
            transform: scale(0.8);
          }
          70% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
