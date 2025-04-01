"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"

interface ErrorInfo {
  file: string
  message: string
  stack?: string
}

export default function DebugHelper() {
  const [errors, setErrors] = useState<ErrorInfo[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const checkPages = async () => {
    setIsChecking(true)
    setErrors([])

    try {
      // This is a simplified example - in a real app you'd need a server endpoint
      // that scans your project files and returns errors
      const response = await fetch("/api/debug-pages")
      const data = await response.json()

      if (data.errors) {
        setErrors(data.errors)
      }
    } catch (error) {
      console.error("Failed to check pages:", error)
      setErrors([
        {
          file: "debug-helper.tsx",
          message: "Failed to check pages. Make sure you've created the API route.",
        },
      ])
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Next.js Page Debugger</CardTitle>
        <CardDescription>Check your page.tsx files for common errors</CardDescription>
      </CardHeader>
      <CardContent>
        {errors.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {errors.map((error, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-medium text-red-500">{error.file}</AccordionTrigger>
                <AccordionContent>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-mono text-sm mb-2">{error.message}</p>
                    {error.stack && (
                      <pre className="text-xs overflow-auto p-2 bg-black text-white rounded mt-2">{error.stack}</pre>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-4">
            {isChecking ? <p>Checking pages...</p> : <p>Click the button below to check your pages for errors</p>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkPages} disabled={isChecking} className="w-full">
          {isChecking ? "Checking..." : "Check Pages"}
        </Button>
      </CardFooter>
    </Card>
  )
}

