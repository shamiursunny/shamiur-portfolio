"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  TestTube,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import Link from "next/link"
import { DemoTester } from "@/components/demo-tester"

export default function SettingsPage() {
  const [emailSettings, setEmailSettings] = useState({
    adminEmail: "shamiur@engineer.com",
    enableNotifications: true,
    enableAutoReply: true,
    emailSubject: "🔔 New Contact Message from {name}"
  })

  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleTestEmail = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailSettings.adminEmail,
          subject: "Test Email from Portfolio",
          message: "This is a test email to verify your email configuration is working correctly."
        })
      })

      const result = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Test email sent successfully! Check your inbox."
        })
      } else {
        setTestResult({
          success: false,
          message: result.error || "Failed to send test email"
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Network error. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings)
      })

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Settings saved successfully!"
        })
      } else {
        setTestResult({
          success: false,
          message: "Failed to save settings"
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Network error. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your portfolio notification preferences
          </p>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure your email settings for notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={emailSettings.adminEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                    placeholder="admin@example.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email address where contact notifications will be sent
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Email Subject</Label>
                  <Input
                    id="emailSubject"
                    value={emailSettings.emailSubject}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, emailSubject: e.target.value }))}
                    placeholder="🔔 New Contact Message from {name}"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use {'{name}'} as placeholder for sender's name
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email when someone contacts you
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableNotifications}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Reply</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic reply to people who contact you
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableAutoReply}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableAutoReply: checked }))}
                  />
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    <Label>Test Email Configuration</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleTestEmail} 
                      disabled={isLoading}
                      variant="outline"
                    >
                      {isLoading ? "Sending..." : "Send Test Email"}
                    </Button>
                    <Button 
                      onClick={handleSaveSettings} 
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>

                  {testResult && (
                    <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      {testResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                        {testResult.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for new contact messages
                      </p>
                    </div>
                    <Badge variant={emailSettings.enableNotifications ? "default" : "secondary"}>
                      {emailSettings.enableNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto-Reply</h4>
                      <p className="text-sm text-muted-foreground">
                        Send automatic replies to contact form submissions
                      </p>
                    </div>
                    <Badge variant={emailSettings.enableAutoReply ? "default" : "secondary"}>
                      {emailSettings.enableAutoReply ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Real-time Dashboard</h4>
                      <p className="text-sm text-muted-foreground">
                        Live updates in your admin dashboard
                      </p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Your contact form includes rate limiting (5 messages per minute per IP) and input validation to prevent spam and abuse.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Rate Limiting</h4>
                        <p className="text-sm text-muted-foreground">
                          5 messages per minute per IP address
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Input Validation</h4>
                        <p className="text-sm text-muted-foreground">
                          All inputs are validated and sanitized
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">XSS Protection</h4>
                        <p className="text-sm text-muted-foreground">
                          HTML tags and scripts are removed from inputs
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DemoTester />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}