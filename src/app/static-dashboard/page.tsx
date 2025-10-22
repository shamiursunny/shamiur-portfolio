"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { messageStorage, type Message } from "@/lib/message-storage"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Users, 
  MessageSquare, 
  Eye, 
  Calendar, 
  TrendingUp,
  Mail,
  Trash2,
  Check,
  CheckCheck,
  Bell,
  LogOut,
  Lock,
  BarChart3,
  Activity,
  Star,
  ArrowUpRight,
  Globe,
  Code,
  Zap
} from "lucide-react"

const projects = [
  {
    id: '1',
    title: 'DevSecOps Pipeline Automation',
    description: 'Automated security scanning and CI/CD pipeline with real-time monitoring and vulnerability assessment.',
    link: 'https://github.com/sunny/devsecops-pipeline',
    featured: true,
    views: 1250,
    createdAt: new Date().toISOString(),
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: '2',
    title: 'Cryptocurrency Trading Dashboard',
    description: 'Real-time trading dashboard with advanced charting, portfolio tracking, and automated trading strategies.',
    link: 'https://github.com/sunny/crypto-dashboard',
    featured: true,
    views: 890,
    createdAt: new Date().toISOString(),
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: '3',
    title: 'E-Commerce Security Platform',
    description: 'Secure e-commerce platform with advanced fraud detection, payment processing, and inventory management.',
    link: 'https://github.com/sunny/ecommerce-security',
    featured: false,
    views: 650,
    createdAt: new Date().toISOString(),
    gradient: "from-orange-500/20 to-red-500/20"
  }
]

export default function StaticDashboard() {
  const [contacts, setContacts] = useState<Message[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return // Still loading
    
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // Load messages from storage and subscribe to updates
  useEffect(() => {
    if (!session) return // Only load if authenticated
    
    setContacts(messageStorage.getMessages())
    
    const unsubscribe = messageStorage.subscribe(() => {
      setContacts(messageStorage.getMessages())
    })
    
    return unsubscribe
  }, [session])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Authenticating...</p>
        </motion.div>
      </div>
    )
  }

  // Show access denied if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Card className="p-8 max-w-md mx-auto bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/20">
            <div className="text-center mb-6">
              <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                Please log in to access the admin dashboard.
              </p>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0">
              <a href="/auth/signin">Login to Dashboard</a>
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  const stats = {
    totalContacts: contacts.length,
    totalProjects: projects.length,
    totalViews: projects.reduce((acc, p) => acc + (p.views || 0), 0),
    newContactsThisMonth: contacts.length,
    unreadMessages: contacts.filter(c => !c.isRead).length,
    featuredProjects: projects.filter(p => p.featured).length
  }

  const toggleReadStatus = (id: string) => {
    messageStorage.updateMessage(id, { isRead: !contacts.find(c => c.id === id)?.isRead })
    showNotificationMessage("Message status updated successfully!")
  }

  const deleteMessage = (id: string) => {
    messageStorage.deleteMessage(id)
    showNotificationMessage("Message deleted successfully!")
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {notificationMessage}
          </div>
        </motion.div>
      )}

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img 
                  src="https://z-cdn-media.chatglm.cn/files/c8b758dd-6dea-4a52-adbb-2adf1b6080a0_S.R.Sunny.jpg?auth_key=1792621923-3740b17e729b459c8d32cbf65e08a281-0-340f1b8e5b77b49040be6b496d4d815a"
                  alt="Shamiur Rashid Sunny"
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: 'center 40%' }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Shamiur Rashid Sunny
              </h1>
              <p className="text-xl text-muted-foreground mb-1">Admin Dashboard</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Welcome back, {session.user?.name || session.user?.email}
                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                  Online
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 bg-background/50 hover:bg-primary/10 rounded-lg text-sm font-medium transition-all"
            >
              <Globe className="w-4 h-4" />
              Back to Home
            </a>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/30 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-green-500" />
                +{stats.newContactsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/30 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Code className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                {stats.featuredProjects} featured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/30 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:border-orange-500/30 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-500" />
                Unread messages
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="contacts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-96">
              <TabsTrigger value="contacts" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Recent Contacts
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Messages from potential clients and collaborators
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No messages yet</p>
                        <p className="text-sm">Messages from the contact form will appear here</p>
                      </div>
                    ) : (
                      contacts.map((contact, index) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            !contact.isRead ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20' : 'bg-background/50 border-primary/10'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-lg">{contact.name}</h4>
                                {!contact.isRead && (
                                  <Badge className="bg-gradient-to-r from-primary to-primary/60 text-primary-foreground">
                                    <Bell className="w-3 h-3 mr-1" />
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleReadStatus(contact.id)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                                title={contact.isRead ? "Mark as unread" : "Mark as read"}
                              >
                                {contact.isRead ? (
                                  <Check className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <CheckCheck className="w-4 h-4 text-primary" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMessage(contact.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-2 leading-relaxed">{contact.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Projects Performance
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Your portfolio projects and their performance metrics
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`border rounded-lg p-4 bg-gradient-to-br ${project.gradient} border-primary/10 hover:border-primary/20 transition-all hover:shadow-md`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/10 rounded-lg" />
                        <div className="relative">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                            {project.featured && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{project.views.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-muted-foreground">Active</span>
                              </div>
                            </div>
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                            >
                              View {project.title}
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}