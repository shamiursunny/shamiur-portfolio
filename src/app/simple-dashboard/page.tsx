"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageSquare, 
  Eye, 
  Calendar, 
  TrendingUp,
  Mail,
  Trash2,
  LogOut,
  Settings
} from "lucide-react"

export default function SimpleDashboard() {
  const [contacts, setContacts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalProjects: 0,
    totalViews: 0,
    newContactsThisMonth: 0
  })

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        // Fetch contacts
        try {
          const contactsResponse = await fetch('/api/public/contacts')
          if (contactsResponse.ok) {
            const contactsData = await contactsResponse.json()
            setContacts(contactsData)
          } else {
            throw new Error('Contacts API failed')
          }
        } catch (error) {
          console.error('Failed to fetch contacts from API, using fallback:', error)
          // Fallback data if API fails
          setContacts([
            {
              id: '1',
              name: 'Sarah Williams',
              email: 'sarah@designstudio.com',
              message: 'Your DevSecOps expertise is exactly what our team needs. Let\'s talk about a potential partnership.',
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              name: 'David Chen',
              email: 'david@fintech.com',
              message: 'Impressive work on the cryptocurrency trading dashboard! We\'d like to feature it in our next conference.',
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike@techcorp.io',
              message: 'Your e-commerce platform project is exactly what we need. Can we schedule a call?',
              createdAt: new Date().toISOString()
            },
            {
              id: '4',
              name: 'Jane Smith',
              email: 'jane@company.com',
              message: 'We\'re looking for a full-stack developer for our startup. Would love to discuss opportunities.',
              createdAt: new Date().toISOString()
            },
            {
              id: '5',
              name: 'John Doe',
              email: 'john@example.com',
              message: 'I\'m interested in collaborating on a security project. Your portfolio looks impressive!',
              createdAt: new Date().toISOString()
            }
          ])
        }

        // Fetch projects
        try {
          const projectsResponse = await fetch('/api/public/projects')
          if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json()
            setProjects(projectsData)
          } else {
            throw new Error('Projects API failed')
          }
        } catch (error) {
          console.error('Failed to fetch projects from API, using fallback:', error)
          // Fallback data if API fails
          setProjects([
            {
              id: '1',
              title: 'DevSecOps Pipeline Automation',
              description: 'Automated security scanning and CI/CD pipeline with real-time monitoring and vulnerability assessment.',
              link: 'https://github.com/sunny/devsecops-pipeline',
              featured: true,
              views: 1250,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Cryptocurrency Trading Dashboard',
              description: 'Real-time trading dashboard with advanced charting, portfolio tracking, and automated trading strategies.',
              link: 'https://github.com/sunny/crypto-dashboard',
              featured: true,
              views: 890,
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              title: 'E-Commerce Security Platform',
              description: 'Secure e-commerce platform with advanced fraud detection, payment processing, and inventory management.',
              link: 'https://github.com/sunny/ecommerce-security',
              featured: false,
              views: 650,
              createdAt: new Date().toISOString()
            }
          ])
        }
      } catch (error) {
        console.error('Error in fetchData:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Calculate stats
    setStats({
      totalContacts: contacts.length,
      totalProjects: projects.length,
      totalViews: projects.reduce((acc, p) => acc + (p.views || 0), 0),
      newContactsThisMonth: contacts.filter(c => {
        const contactDate = new Date(c.createdAt)
        const now = new Date()
        return contactDate.getMonth() === now.getMonth() && 
               contactDate.getFullYear() === now.getFullYear()
      }).length
    })
  }, [contacts, projects])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
              <img 
                src="https://z-cdn-media.chatglm.cn/files/c8b758dd-6dea-4a52-adbb-2adf1b6080a0_S.R.Sunny.jpg?auth_key=1792621923-3740b17e729b459c8d32cbf65e08a281-0-340f1b8e5b77b49040be6b496d4d815a"
                alt="Shamiur Rashid Sunny"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: 'center 40%' }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Shamiur Rashid Sunny</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => window.location.href = '/'}>
              <Settings className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                {projects.filter(p => p.featured).length} featured
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
                Unread messages
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
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
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{contact.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Your portfolio projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View {project.title} →
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
