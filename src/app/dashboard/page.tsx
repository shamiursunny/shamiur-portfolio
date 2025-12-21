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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  CheckCheck,
  Key,
  Database,
  Cpu,
  FileText,
  Layout,
  Activity
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [settings, setSettings] = useState<any[]>([])
  const [pages, setPages] = useState<any[]>([])
  const [aiStatus, setAiStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: ""
  })
  const [editingProject, setEditingProject] = useState<any>(null)

  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    category: "SYSTEM"
  })

  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: ""
  })

  // Fetch contacts from database
  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
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

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const settingsData = await response.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const pagesData = await response.json()
        setPages(pagesData)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const fetchAIStatus = async () => {
    try {
      const response = await fetch('/api/admin/ai-status')
      if (response.ok) {
        const data = await response.json()
        setAiStatus(data)
      }
    } catch (error) {
      console.error('Error fetching AI status:', error)
    }
  }

  useEffect(() => {
    if (status === "loading") return

    // Fetch initial data
    fetchContacts()
    fetchSettings()
    fetchPages()
    fetchAIStatus()

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

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.title || !editingProject.description || !editingProject.link) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingProject.title,
          description: editingProject.description,
          link: editingProject.link
        }),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
        setEditingProject(null)
        showNotificationMessage("Project updated successfully!")
      }
    } catch (error) {
      console.error('Error updating project:', error)
      showNotificationMessage("Error updating project")
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
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

      const response = await fetch(`/api/contacts/${id}`, {
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

  const handleSaveSetting = async () => {
    if (!newSetting.key || !newSetting.value) return

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetting)
      })

      if (response.ok) {
        const savedSetting = await response.json()
        // Update list (handle upsert logic locally)
        const existingIndex = settings.findIndex(s => s.key === savedSetting.key)
        if (existingIndex >= 0) {
          const updatedSettings = [...settings]
          updatedSettings[existingIndex] = savedSetting
          setSettings(updatedSettings)
        } else {
          setSettings([savedSetting, ...settings])
        }
        setNewSetting({ key: "", value: "", category: "SYSTEM" })
        showNotificationMessage("Setting saved successfully!")
      }
    } catch (error) {
      console.error('Error saving setting:', error)
      showNotificationMessage("Error saving setting")
    }
  }

  const handleDeleteSetting = async (key: string) => {
    try {
      const response = await fetch(`/api/settings/${key}`, { method: 'DELETE' })
      if (response.ok) {
        setSettings(settings.filter(s => s.key !== key))
        showNotificationMessage("Setting deleted successfully!")
      }
    } catch (error) {
      console.error('Error deleting setting:', error)
    }
  }

  const handleAddPage = async () => {
    if (!newPage.title || !newPage.slug) return

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      })

      if (response.ok) {
        const page = await response.json()
        setPages([page, ...pages])
        setNewPage({ title: "", slug: "", description: "" })
        showNotificationMessage("Page created successfully!")
      } else {
        const error = await response.json()
        showNotificationMessage(error.error || "Failed to create page")
      }
    } catch (error) {
      console.error('Error creating page:', error)
      showNotificationMessage("Error creating page")
    }
  }

  const handleDeletePage = async (id: string) => {
    try {
      const response = await fetch(`/api/pages/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setPages(pages.filter(p => p.id !== id))
        showNotificationMessage("Page deleted successfully!")
      }
    } catch (error) {
      console.error('Error deleting page:', error)
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

      {/* Edit Project Dialog */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Edit Project</CardTitle>
              <CardDescription>Update project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-link">Project Link</Label>
                <Input
                  id="edit-link"
                  value={editingProject.link}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                <Button onClick={handleUpdateProject}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
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
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="ai-status">AI Status</TabsTrigger>
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
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Project description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">Project Link</Label>
                      <Input
                        id="link"
                        value={newProject.link}
                        onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
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
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingProject(project)}
                                >
                                  <Settings className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pages Tab */}
            <TabsContent value="pages">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Create New Page
                    </CardTitle>
                    <CardDescription>
                      Add a new page to your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="page-title">Page Title</Label>
                      <Input
                        id="page-title"
                        value={newPage.title}
                        onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                        placeholder="e.g., About Me"
                      />
                    </div>
                    <div>
                      <Label htmlFor="page-slug">Slug (URL)</Label>
                      <Input
                        id="page-slug"
                        value={newPage.slug}
                        onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                        placeholder="e.g., about-me"
                      />
                    </div>
                    <div>
                      <Label htmlFor="page-desc">SEO Description</Label>
                      <Textarea
                        id="page-desc"
                        value={newPage.description}
                        onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                        placeholder="Page description for search engines"
                      />
                    </div>
                    <Button onClick={handleAddPage} className="w-full">
                      Create Page
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pages.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No pages created yet.
                        </p>
                      ) : (
                        pages.map((page) => (
                          <div key={page.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{page.title}</h4>
                                  <Badge variant={page.isPublished ? "default" : "secondary"} className="text-xs">
                                    {page.isPublished ? "Published" : "Draft"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">
                                  /{page.slug}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePage(page.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Add API Key / Setting
                    </CardTitle>
                    <CardDescription>
                      Manage your API keys and system configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="setting-key">Key Name</Label>
                      <Input
                        id="setting-key"
                        value={newSetting.key}
                        onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                        placeholder="e.g., RESEND_API_KEY, OPENAI_API_KEY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="setting-value">Value</Label>
                      <Input
                        id="setting-value"
                        type="password"
                        value={newSetting.value}
                        onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                        placeholder="Enter secret key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="setting-category">Category</Label>
                      <Select
                        value={newSetting.category}
                        onValueChange={(value) => setNewSetting({ ...newSetting, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SYSTEM">System</SelectItem>
                          <SelectItem value="AI">AI</SelectItem>
                          <SelectItem value="API">API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveSetting} className="w-full">
                      Save Setting
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {settings.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No settings configured.
                        </p>
                      ) : (
                        settings.map((setting) => (
                          <div key={setting.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold truncate" title={setting.key}>{setting.key}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {setting.category}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono truncate">
                                  {setting.value.substring(0, 8)}...{setting.value.substring(setting.value.length - 4)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSetting(setting.key)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
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

            {/* AI Status Tab */}
            <TabsContent value="ai-status">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    AI Provider Status
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring of integrated AI services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aiStatus.length === 0 ? (
                      <div className="col-span-3 text-center py-8 text-muted-foreground">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No AI providers configured or status unavailable</p>
                      </div>
                    ) : (
                      aiStatus.map((status) => (
                        <Card key={status.name} className="overflow-hidden">
                          <div className={`h-1 w-full ${status.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{status.name}</CardTitle>
                              <Badge variant={status.status === 'online' ? 'default' : 'destructive'}>
                                {status.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Latency</span>
                                <span className="font-mono">{status.latency ? `${status.latency}ms` : 'N/A'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Provider</span>
                                <span className="capitalize">{status.provider}</span>
                              </div>
                              {status.error && (
                                <p className="text-xs text-red-500 mt-2 bg-red-500/10 p-2 rounded">
                                  {status.error}
                                </p>
                              )}
                              {status.note && (
                                <p className="text-xs text-blue-500 mt-2 bg-blue-500/10 p-2 rounded">
                                  {status.note}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                  <div className="mt-8">
                    <Button variant="outline" size="sm" onClick={fetchAIStatus} className="gap-2">
                      <Activity className="w-4 h-4" />
                      Refresh Status
                    </Button>
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