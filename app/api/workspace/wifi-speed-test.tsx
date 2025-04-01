"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"

export default function WifiSpeedTest() {
  const router = useRouter()
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testResults, setTestResults] = useState<{
    downloadSpeed: number | null
    uploadSpeed: number | null
    latency: number | null
  }>({
    downloadSpeed: null,
    uploadSpeed: null,
    latency: null,
  })

  // Function to simulate speed test
  const runSpeedTest = () => {
    setIsTestRunning(true)
    setTestProgress(0)

    // Reset results
    setTestResults({
      downloadSpeed: null,
      uploadSpeed: null,
      latency: null,
    })

    // Simulate latency test
    setTimeout(() => {
      setTestProgress(10)
      setTestResults((prev) => ({ ...prev, latency: Math.floor(Math.random() * 50) + 10 }))

      // Simulate download test
      setTimeout(() => {
        const downloadInterval = setInterval(() => {
          setTestProgress((prev) => {
            if (prev >= 60) {
              clearInterval(downloadInterval)
              setTestResults((prev) => ({ ...prev, downloadSpeed: Math.floor(Math.random() * 100) + 20 }))

              // Simulate upload test
              const uploadInterval = setInterval(() => {
                setTestProgress((prev) => {
                  if (prev >= 100) {
                    clearInterval(uploadInterval)
                    setTestResults((prev) => ({ ...prev, uploadSpeed: Math.floor(Math.random() * 50) + 10 }))
                    setIsTestRunning(false)
                    return 100
                  }
                  return prev + 5
                })
              }, 300)

              return 60
            }
            return prev + 5
          })
        }, 300)
      }, 1000)
    }, 1000)
  }

  // Function to redirect back to the main app
  const redirectToApp = () => {
    // You can replace this with your actual app URL
    router.push("/")
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Wi-Fi Speed Test</CardTitle>
          <CardDescription>Test your connection speed before proceeding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTestRunning ? (
            <>
              <div className="text-center mb-2">
                {testProgress < 10 && <p>Testing latency...</p>}
                {testProgress >= 10 && testProgress < 60 && <p>Testing download speed...</p>}
                {testProgress >= 60 && <p>Testing upload speed...</p>}
              </div>
              <Progress value={testProgress} className="h-2" />
            </>
          ) : (
            <>
              {testResults.downloadSpeed !== null ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Latency</p>
                      <p className="text-2xl font-bold">{testResults.latency} ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Download</p>
                      <p className="text-2xl font-bold">{testResults.downloadSpeed} Mbps</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Upload</p>
                      <p className="text-2xl font-bold">{testResults.uploadSpeed} Mbps</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {testResults.downloadSpeed > 50
                        ? "Your connection is excellent for using our application."
                        : testResults.downloadSpeed > 20
                          ? "Your connection is good for using our application."
                          : "Your connection may be slow. Some features might not work optimally."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Click the button below to test your Wi-Fi speed</p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {!isTestRunning && (
            <>
              {testResults.downloadSpeed === null ? (
                <Button onClick={runSpeedTest}>Start Speed Test</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={runSpeedTest}>
                    Test Again
                  </Button>
                  <Button onClick={redirectToApp}>Continue to App</Button>
                </>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}