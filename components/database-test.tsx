"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DatabaseTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const runDatabaseTest = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      console.log("[v0] Starting database test...")

      // Check if environment variables exist
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        setTestResult("❌ Environment variables missing")
        return
      }

      console.log("[v0] Environment variables found")

      // Create Supabase client
      const supabase = createBrowserClient(supabaseUrl, supabaseKey)

      // Test basic connection
      console.log("[v0] Testing basic connection...")
      const { data: connectionTest, error: connectionError } = await supabase.from("products").select("count").limit(1)

      if (connectionError) {
        console.log("[v0] Connection error:", connectionError)

        // Check if it's a table not found error
        if (
          connectionError.message.includes("does not exist") ||
          connectionError.message.includes("relation") ||
          connectionError.message.includes("table")
        ) {
          setTestResult("❌ Products table does not exist. You need to run the SQL scripts in your Supabase dashboard.")
        } else {
          setTestResult(`❌ Database error: ${connectionError.message}`)
        }
        return
      }

      console.log("[v0] Connection successful!")
      setTestResult("✅ Database connection successful! Products table exists.")
    } catch (error) {
      console.log("[v0] Test failed:", error)
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Database Test</CardTitle>
        <CardDescription>Test your Supabase database connection and table setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDatabaseTest} disabled={isLoading} className="w-full">
          {isLoading ? "Testing..." : "Test Database"}
        </Button>

        {testResult && <div className="p-3 rounded-md bg-muted text-sm">{testResult}</div>}
      </CardContent>
    </Card>
  )
}
