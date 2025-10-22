"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Play, Pause, RotateCcw, Mail } from "lucide-react"

const demoMessages = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    message: "Hi Shamiur! I came across your portfolio and I'm really impressed with your DevSecOps experience. We're looking for a senior full-stack developer with security expertise for our fintech startup."
  },
  {
    name: "Michael Chen",
    email: "michael.chen@digitalagency.io",
    message: "Hello! I'm the CTO at Digital Agency, and we have a client who needs a secure e-commerce platform built with Next.js. Your portfolio shows exactly the kind of expertise we're looking for."
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@innovate-labs.com",
    message: "Hi Shamiur! I found your GitHub profile and was impressed by your contributions to open-source security projects. We're hosting a DevSecOps workshop next month."
  },
  {
    name: "David Kim",
    email: "david.kim@startuphub.com",
    message: "Hello! I'm reaching out from StartupHub. We're building a new SaaS platform for healthcare data management and need a security-focused developer."
  },
  {
    name: "Amanda Foster",
    email: "amanda.foster@enterprise-tech.com",
    message: "Hi Shamiur! I'm a technical recruiter at Enterprise Tech, and we have several positions that might be perfect for you. We're particularly interested in your security experience."
  }
]

export function DemoTester() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sentCount, setSentCount] = useState(0)
  const [results, setResults] = useState<Array<{index: number, success: boolean, error?: string}>>([])

  const sendSingleMessage = async (messageData: typeof demoMessages[0], index: number) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })

      if (response.ok) {
        setResults(prev => [...prev, { index, success: true }])
        setSentCount(prev => prev + 1)
        toast.success(`Message ${index + 1} sent successfully!`)
        return true
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setResults(prev => [...prev, { index, success: false, error: errorMessage }])
      toast.error(`Failed to send message ${index + 1}: ${errorMessage}`)
      return false
    }
  }

  const runDemo = async () => {
    setIsRunning(true)
    setResults([])
    setSentCount(0)
    setCurrentIndex(0)

    for (let i = 0; i < demoMessages.length; i++) {
      setCurrentIndex(i)
      await sendSingleMessage(demoMessages[i], i)
      
      // Wait 2 seconds between messages to avoid rate limiting
      if (i < demoMessages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    setIsRunning(false)
    toast.success(`Demo completed! ${sentCount} of ${demoMessages.length} messages sent successfully.`)
  }

  const resetDemo = () => {
    setIsRunning(false)
    setCurrentIndex(0)
    setSentCount(0)
    setResults([])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notification Demo Tester
        </CardTitle>
        <CardDescription>
          Automatically send test messages to verify your email notification system is working correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-medium">
              {isRunning ? 'Running Demo...' : 'Ready to Test'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {sentCount}/{demoMessages.length} Sent
            </Badge>
            {isRunning && (
              <Badge variant="outline">
                Message {currentIndex + 1} of {demoMessages.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button 
            onClick={runDemo} 
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Demo
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetDemo}
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Results:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium">
                      Message {result.index + 1}: {demoMessages[result.index].name}
                    </span>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-200">
          <strong>📧 What this tests:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Email notification to admin (shamiur@engineer.com)</li>
            <li>• Auto-reply to sender</li>
            <li>• Rate limiting (2-second delay between messages)</li>
            <li>• Form validation and error handling</li>
            <li>• Dashboard real-time updates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}