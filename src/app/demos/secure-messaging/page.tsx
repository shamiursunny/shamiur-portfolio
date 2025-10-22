"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageSquare, 
  Send, 
  Shield, 
  Lock, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Key
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function SecureMessagingDemo() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Johnson",
      content: "Project update: The security audit is complete. All vulnerabilities have been patched.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      encrypted: true,
      read: true,
      priority: "high"
    },
    {
      id: 2,
      sender: "Bob Smith",
      content: "Meeting rescheduled to 3 PM tomorrow. Conference room A.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      encrypted: true,
      read: false,
      priority: "normal"
    },
    {
      id: 3,
      sender: "Carol Davis",
      content: "Urgent: Server maintenance required tonight at 11 PM EST.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      encrypted: true,
      read: true,
      priority: "urgent"
    }
  ])

  const [newMessage, setNewMessage] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState("Bob Smith")
  const [encryptionStatus, setEncryptionStatus] = useState("active")
  const [showDecrypted, setShowDecrypted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("messages")

  const messageVolumeData = [
    { time: '00:00', messages: 120 },
    { time: '04:00', messages: 80 },
    { time: '08:00', messages: 450 },
    { time: '12:00', messages: 680 },
    { time: '16:00', messages: 520 },
    { time: '20:00', messages: 280 },
    { time: '23:59', messages: 150 }
  ]

  const securityMetrics = [
    { name: 'Encryption', value: 100, color: 'bg-green-500' },
    { name: 'Authentication', value: 98, color: 'bg-blue-500' },
    { name: 'Data Integrity', value: 99, color: 'bg-purple-500' },
    { name: 'Access Control', value: 97, color: 'bg-orange-500' }
  ]

  const recipients = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Emma Brown"]

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date(),
        encrypted: true,
        read: true,
        priority: "normal"
      }
      setMessages([message, ...messages])
      setNewMessage("")
    }
  }

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ))
  }

  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = messages.filter(msg => !msg.read).length

  useEffect(() => {
    const interval = setInterval(() => {
      setEncryptionStatus(prev => prev === "active" ? "verifying" : "active")
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Secure Messaging API
              </h1>
              <p className="text-slate-600">Enterprise-grade encrypted communication platform</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${encryptionStatus === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className="text-sm font-medium">Encryption: {encryptionStatus}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{unreadCount} Unread</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Secure Messages
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDecrypted(!showDecrypted)}
                        >
                          {showDecrypted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {filteredMessages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-lg border ${
                              message.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="font-medium">{message.sender}</span>
                                {!message.read && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                                <Badge 
                                  variant={message.priority === 'urgent' ? 'destructive' : 
                                          message.priority === 'high' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {message.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(message.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {showDecrypted ? message.content : "🔒 Encrypted content"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                AES-256
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Messages</span>
                      <span className="font-bold">{messages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Unread</span>
                      <span className="font-bold text-blue-600">{unreadCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Encrypted</span>
                      <span className="font-bold text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Active Users</span>
                      <span className="font-bold">5</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {securityMetrics.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{metric.name}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compose New Message</CardTitle>
                  <CardDescription>Send encrypted messages to recipients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipient</label>
                    <select 
                      value={selectedRecipient}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {recipients.map(recipient => (
                        <option key={recipient} value={recipient}>{recipient}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your secure message here..."
                      className="min-h-32"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Message will be end-to-end encrypted</span>
                  </div>
                  <Button onClick={sendMessage} className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Secure Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Encryption Details</CardTitle>
                  <CardDescription>Current encryption settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-3">Encryption Algorithm</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Algorithm:</span>
                        <span className="font-mono">AES-256-GCM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Key Exchange:</span>
                        <span className="font-mono">ECDH-P384</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Signature:</span>
                        <span className="font-mono">Ed25519</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hash:</span>
                        <span className="font-mono">SHA-384</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-3">Security Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Perfect Forward Secrecy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Message Authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Replay Protection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Key Rotation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Message Volume (24h)</CardTitle>
                  <CardDescription>Real-time message traffic analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={messageVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                  <CardDescription>System performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">99.9%</div>
                        <div className="text-sm text-slate-600">Uptime</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">45ms</div>
                        <div className="text-sm text-slate-600">Avg Response</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">10M+</div>
                        <div className="text-sm text-slate-600">Messages</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">500K</div>
                        <div className="text-sm text-slate-600">Active Users</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">All Systems Secure</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      No security threats detected in the last 24 hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Firewall Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>DDoS Protection</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SSL Certificate</span>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>2FA Required</span>
                      <Badge className="bg-green-100 text-green-800">Enforced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">HIPAA</div>
                      <div className="text-xs text-slate-600">Healthcare compliance</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">GDPR</div>
                      <div className="text-xs text-slate-600">EU data protection</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">SOC 2</div>
                      <div className="text-xs text-slate-600">Security controls</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">ISO 27001</div>
                      <div className="text-xs text-slate-600">Information security</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="font-medium">Security scan completed</div>
                        <div className="text-slate-500">2 minutes ago</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">New encryption keys generated</div>
                        <div className="text-slate-500">1 hour ago</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">System backup completed</div>
                        <div className="text-slate-500">3 hours ago</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Security patch applied</div>
                        <div className="text-slate-500">6 hours ago</div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}