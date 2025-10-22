"use client"

import { useState, useEffect } from "react"
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
  Home,
  Settings
} from "lucide-react"
import Link from "next/link"

// Sample data for demo
const sampleContacts = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    message: "Hi! I'm interested in working with you on a new project. Let me know when you're available.",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Sarah Smith",
    email: "sarah@company.com",
    message: "Your portfolio looks impressive! We're looking for a DevSecOps engineer for our team.",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@startup.io",
    message: "Do you have availability for a short-term consulting project?",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]

const sampleProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React and Node.js",
    link: "https://github.com/example/ecommerce",
    views: 1250
  },
  {
    id: "2", 
    title: "DevSecOps Pipeline",
    description: "CI/CD pipeline with security scanning and automation",
    link: "https://github.com/example/devsecops",
    views: 890
  },
  {
    id: "3",
    title: "Real-time Analytics Dashboard",
    description: "Analytics dashboard with WebSocket integration",
    link: "https://github.com/example/analytics",
    views: 2100
  }
]

export default function DashboardDemoPage() {
  const [contacts, setContacts] = useState(sampleContacts)
  const [projects, setProjects] = useState(sampleProjects)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: ""
  })

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description || !newProject.link) {
      return
    }

    const project = {
      id: Date.now().toString(),
      ...newProject,
      views: 0
    }
    
    setProjects([...projects, project])
    setNewProject({ title: "", description: "", link: "" })
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id))
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
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
    }).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                  Demo Mode
                </Badge>
                <p className="text-sm text-yellow-800">
                  This is a demonstration version with sample data. No authentication required.
                </p>
                <Button variant="outline" size="sm" asChild className="ml-auto">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-1" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Shamiur Rashid Sunny</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/">View Site</Link>
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
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">
                Total messages
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
                      <p className="text-muted-foreground text-center py-8">
                        No contacts yet. When people fill out the contact form, they'll appear here.
                      </p>
                    ) : (
                      contacts.map((contact) => (
                        <div key={contact.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{contact.name}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm mb-2">{contact.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contact.createdAt).toLocaleDateString()}
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
                                <p className="text-xs text-muted-foreground mt-1">
                                  {project.views} views
                                </p>
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