"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  MessageSquare, 
  Eye, 
  Calendar, 
  TrendingUp,
  Mail,
  Plus,
  Trash2,
  LogOut,
  Settings,
  Bell,
  Check,
  CheckCheck
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: ""
  })

  // Fetch contacts from database
  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const contactsData = await response.json()
        setContacts(contactsData)
      } else {
        console.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  useEffect(() => {
    if (status === "loading") return

    // Fetch contacts from database
    fetchContacts()

    // Fetch projects from database
    const fetchProjects = async () => {
      try {
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchProjects()
    } else {
      setLoading(false)
    }
  }, [session, status])

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.link) {
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        const project = await response.json()
        setProjects([...projects, project])
        setNewProject({ title: "", description: "", link: "" })
        showNotificationMessage("Project added successfully!")
      }
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setContacts(contacts.filter(c => c.id !== id))
        showNotificationMessage("Contact deleted successfully!")
      } else {
        showNotificationMessage("Failed to delete contact")
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      showNotificationMessage("Error deleting contact")
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id))
        showNotificationMessage("Project deleted successfully!")
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const toggleReadStatus = async (id: string) => {
    try {
      const contact = contacts.find(c => c.id === id)
      if (!contact) return

      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: !contact.isRead }),
      })

      if (response.ok) {
        // Update local state
        setContacts(contacts.map(c => 
          c.id === id ? { ...c, isRead: !c.isRead } : c
        ))
        showNotificationMessage("Message status updated successfully!")
      } else {
        showNotificationMessage("Failed to update message status")
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      showNotificationMessage("Error updating message status")
    }
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access the admin dashboard.
          </p>
          <Button asChild>
            <a href="/auth/signin">Login</a>
          </Button>
        </Card>
      </div>
    )
  }

  const stats = {
    totalContacts: contacts.length,
    totalProjects: projects.length,
    totalViews: projects.reduce((acc, p) => acc + (p.views || 0), 0),
    newContactsThisMonth: contacts.filter(c => {
      const contactDate = new Date(c.createdAt)
      const now = new Date()
      return contactDate.getMonth() === now.getMonth() && 
             contactDate.getFullYear() === now.getFullYear()
    }).length,
    unreadMessages: contacts.filter(c => !c.isRead).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {notificationMessage}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user?.name || session.user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => signOut()} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newContactsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
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
            <TabsList>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Contacts
                  </CardTitle>
                  <CardDescription>
                    Messages from potential clients and collaborators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <div key={contact.id} className={`border rounded-lg p-4 ${!contact.isRead ? 'bg-primary/5 border-primary/20' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{contact.name}</h4>
                                {!contact.isRead && (
                                  <Badge variant="default" className="text-xs">
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
                                className="h-8 w-8 p-0"
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
                                onClick={() => handleDeleteContact(contact.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{contact.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Project description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">Project Link</Label>
                      <Input
                        id="link"
                        value={newProject.link}
                        onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button onClick={handleAddProject} className="w-full">
                      Add Project
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {projects.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No projects yet. Add your first project above.
                        </p>
                      ) : (
                        projects.map((project) => (
                          <div key={project.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold">{project.title}</h4>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {project.description}
                                </p>
                                <a 
                                  href={project.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {project.link}
                                </a>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}