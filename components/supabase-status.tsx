"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error" | "missing-env">("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      if (!supabase) {
        setStatus("missing-env")
        setError("Environment variables not configured")
        return
      }

      try {
        const { data, error } = await supabase.from("products").select("count").limit(1)

        if (error) {
          console.error("[v0] Supabase connection error:", error)
          setStatus("error")
          setError(error.message)
        } else {
          console.log("[v0] Supabase connected successfully")
          setStatus("connected")
          setError(null)
        }
      } catch (err) {
        console.error("[v0] Supabase connection failed:", err)
        setStatus("error")
        setError(err instanceof Error ? err.message : "Connection failed")
      }
    }

    checkConnection()
  }, [])

  if (status === "checking") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Checking Database...
      </Badge>
    )
  }

  if (status === "missing-env") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-orange-500 text-orange-600"
        title="Environment variables not configured"
      >
        <AlertTriangle className="w-3 h-3" />
        Setup Required
      </Badge>
    )
  }

  if (status === "error") {
    return (
      <Badge variant="destructive" className="gap-1" title={error || "Connection error"}>
        <XCircle className="w-3 h-3" />
        Database Error
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="gap-1 bg-green-600">
      <CheckCircle className="w-3 h-3" />
      Database Connected
    </Badge>
  )
}
