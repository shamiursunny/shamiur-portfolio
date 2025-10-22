"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Bot, 
  User, 
  Code2, 
  Database, 
  Cloud, 
  Shield, 
  Zap,
  Copy,
  Check,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  typing?: boolean
}

const AI_RESPONSES = [
  "I'm an AI assistant powered by advanced language models. I can help you with coding, debugging, architecture design, and more!",
  "Based on your query, I recommend using TypeScript for type safety and Next.js for the framework. This combination provides excellent developer experience and performance.",
  "For security best practices, always validate input on both client and server side, use parameterized queries to prevent SQL injection, and implement proper authentication.",
  "The best approach for scalable applications is to use microservices architecture with containerization. Consider using Docker and Kubernetes for orchestration.",
  "When optimizing database performance, consider indexing frequently queried columns, using connection pooling, and implementing proper caching strategies.",
  "For real-time applications, WebSockets are ideal. I recommend using Socket.IO for easier implementation and better browser compatibility.",
  "Cloud security should include identity and access management, encryption at rest and in transit, and regular security audits.",
  "DevOps best practices include CI/CD pipelines, infrastructure as code, automated testing, and monitoring and logging."
]

const SUGGESTED_PROMPTS = [
  "What's the best tech stack for a startup?",
  "How do I implement secure authentication?",
  "Explain microservices architecture",
  "Best practices for database optimization",
  "How to scale a web application?",
  "Security considerations for cloud apps"
]

export default function AIChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hello! I'm your AI assistant. I can help you with web development, security, DevOps, and architecture questions. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [responseIndex, setResponseIndex] = useState(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length]
    setResponseIndex(prev => prev + 1)
    
    // Add some context-aware responses
    if (userMessage.toLowerCase().includes("security")) {
      return "Security is crucial in modern applications. Always implement proper authentication, authorization, input validation, and use HTTPS. Consider regular security audits and penetration testing."
    }
    if (userMessage.toLowerCase().includes("react") || userMessage.toLowerCase().includes("next")) {
      return "React and Next.js are excellent choices! React provides component-based architecture, while Next.js adds server-side rendering, routing, and optimization features out of the box."
    }
    if (userMessage.toLowerCase().includes("database")) {
      return "For databases, consider your use case: PostgreSQL for relational data, MongoDB for flexible schemas, Redis for caching, and always implement proper indexing and backup strategies."
    }
    
    return response
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI typing delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success("Message copied to clipboard")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error("Failed to copy message")
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant Demo
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience real-time AI conversations. Ask questions about development, security, architecture, and get instant responses.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              GPT-Powered
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              Real-time
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" />
              Secure
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <CardTitle>AI Conversation</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {messages.length} messages
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 pb-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          
                          <div className={`max-w-[80%] ${
                            message.role === "user" ? "order-first" : ""
                          }`}>
                            <div className={`rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}>
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1 opacity-70 hover:opacity-100"
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                >
                                  {copiedId === message.id ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {message.role === "user" && (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 order-first">
                              <User className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <Separator />
                
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about development, security, or architecture..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={!input.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Code Review & Debugging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Database Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Cloud Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Security Best Practices</span>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try Asking</CardTitle>
                <CardDescription>Click any question to start</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-2 text-sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">~1.5s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">GPT-4</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}