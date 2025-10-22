"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Search, Filter, Star, ArrowRight, Eye, Code } from "lucide-react"
import { useState } from "react"

const projects = [
  {
    id: 1,
    title: "Secure Banking Dashboard",
    description: "A comprehensive banking dashboard with real-time transaction monitoring, fraud detection algorithms, and multi-layer security authentication. Implements end-to-end encryption and complies with PCI DSS standards.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "JWT", "Redis"],
    category: "FinTech",
    featured: true,
    github: "https://github.com/shamiur/banking-dashboard",
    demo: "/demos/banking-dashboard",
    image: "/api/placeholder/400/250",
    gradient: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "DevSecOps Pipeline Manager",
    description: "Automated CI/CD pipeline management tool with integrated security scanning, vulnerability assessment, and compliance reporting. Features container security infrastructure as code templates.",
    tech: ["Docker", "Kubernetes", "Jenkins", "SonarQube", "Python"],
    category: "DevOps",
    featured: true,
    github: "https://github.com/shamiur/devsecops-pipeline",
    demo: "/demos/devsecops-pipeline",
    image: "/api/placeholder/400/250",
    gradient: "from-green-500/20 to-teal-500/20"
  },
  {
    id: 3,
    title: "Healthcare Management System",
    description: "HIPAA-compliant healthcare management platform with electronic health records, appointment scheduling, and telemedicine capabilities. Features role-based access control and audit trails.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "WebRTC", "AWS"],
    category: "Healthcare",
    featured: true,
    github: "https://github.com/shamiur/healthcare-system",
    demo: "/demos/healthcare-system",
    image: "/api/placeholder/400/250",
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 4,
    title: "AI Assistant Demo",
    description: "Interactive AI-powered chatbot with real-time responses, context-aware conversations, and multiple language support. Features GPT integration, code generation, and intelligent document analysis.",
    tech: ["Next.js", "TypeScript", "OpenAI API", "Socket.io", "Tailwind"],
    category: "AI/ML",
    featured: true,
    github: "https://github.com/shamiur/ai-assistant",
    demo: "/demos/ai-chatbot",
    image: "/api/placeholder/400/250",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: 5,
    title: "Code Editor Pro",
    description: "Advanced real-time code editor with syntax highlighting, live collaboration, and instant execution. Supports multiple languages, IntelliSense, and team coding sessions with conflict resolution.",
    tech: ["React", "Monaco Editor", "WebRTC", "Node.js", "Docker"],
    category: "Development Tools",
    featured: true,
    github: "https://github.com/shamiur/code-editor",
    demo: "/demos/code-editor",
    image: "/api/placeholder/400/250",
    gradient: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 6,
    title: "E-Commerce Dashboard",
    description: "Comprehensive e-commerce analytics platform with real-time sales tracking, inventory management, customer insights, and automated reporting. Features predictive analytics and AI-powered recommendations.",
    tech: ["Next.js", "Recharts", "PostgreSQL", "Redis", "Stripe API"],
    category: "E-Commerce",
    featured: true,
    github: "https://github.com/shamiur/ecommerce-dashboard",
    demo: "/demos/ecommerce-dashboard",
    image: "/api/placeholder/400/250",
    gradient: "from-emerald-500/20 to-green-500/20"
  },
  {
    id: 7,
    title: "Task Manager Pro",
    description: "Collaborative task management system with Kanban boards, real-time updates, team collaboration, and advanced project tracking. Features drag-and-drop, time tracking, and automated workflows.",
    tech: ["React", "TypeScript", "Socket.io", "Prisma", "Framer Motion"],
    category: "Productivity",
    featured: true,
    github: "https://github.com/shamiur/task-manager",
    demo: "/demos/task-manager",
    image: "/api/placeholder/400/250",
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: 8,
    title: "E-Learning Platform",
    description: "Scalable e-learning platform with video streaming, interactive quizzes, progress tracking, and certificate generation. Includes real-time collaboration features and AI-powered recommendations.",
    tech: ["Vue.js", "Express", "MongoDB", "Socket.io", "AWS S3"],
    category: "Education",
    featured: false,
    github: "https://github.com/shamiur/e-learning-platform",
    demo: "/demos/e-learning-platform",
    image: "/api/placeholder/400/250",
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: 9,
    title: "Real-Time Analytics Dashboard",
    description: "Business intelligence dashboard with real-time data visualization, custom reporting, and predictive analytics. Processes millions of data points with sub-second response times.",
    tech: ["React", "D3.js", "Apache Kafka", "Elasticsearch", "Node.js"],
    category: "Analytics",
    featured: false,
    github: "https://github.com/shamiur/analytics-dashboard",
    demo: "/demos/analytics-dashboard",
    image: "/api/placeholder/400/250",
    gradient: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: 10,
    title: "Secure Messaging API",
    description: "Enterprise-grade messaging API with end-to-end encryption, message expiration, and secure file sharing. Handles 10M+ messages daily with 99.9% uptime.",
    tech: ["Go", "gRPC", "RabbitMQ", "PostgreSQL", "Docker"],
    category: "Security",
    featured: false,
    github: "https://github.com/shamiur/secure-messaging",
    demo: null,
    image: "/api/placeholder/400/250",
    gradient: "from-slate-500/20 to-gray-500/20"
  },
  {
    id: 11,
    title: "IoT Security Monitor",
    description: "IoT device security monitoring system that detects anomalies, prevents unauthorized access, and manages device lifecycle. Features machine learning-based threat detection.",
    tech: ["Python", "TensorFlow", "InfluxDB", "MQTT", "React"],
    category: "IoT",
    featured: false,
    github: "https://github.com/shamiur/iot-security",
    demo: "https://iot-demo.shamiur.dev",
    image: "/api/placeholder/400/250",
    gradient: "from-teal-500/20 to-cyan-500/20"
  },
  {
    id: 12,
    title: "Cloud Infrastructure Auditor",
    description: "Automated cloud infrastructure security auditor that scans AWS, Azure, and GCP environments for misconfigurations, compliance violations, and security best practices.",
    tech: ["Terraform", "Python", "AWS SDK", "Azure SDK", "Docker"],
    category: "Security",
    featured: false,
    github: "https://github.com/shamiur/cloud-auditor",
    demo: null,
    image: "/api/placeholder/400/250",
    gradient: "from-violet-500/20 to-purple-500/20"
  }
]

const categories = ["All", "FinTech", "DevOps", "Healthcare", "AI/ML", "Development Tools", "E-Commerce", "Productivity", "Education", "Analytics", "Security", "IoT"]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesFeatured = !showFeaturedOnly || project.featured

    return matchesSearch && matchesCategory && matchesFeatured
  })

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
            Projects Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore my portfolio of secure, scalable, and innovative web applications built with cutting-edge technologies
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects, technologies, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 glass-nav border-border/30 focus:border-primary/30"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 max-w-2xl">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      selectedCategory === category 
                        ? "glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/30" 
                        : "glass-subtle hover-lift border-border/50"
                    } transition-all`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Featured Filter */}
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`gap-2 h-12 px-6 ${
                  showFeaturedOnly 
                    ? "glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/30" 
                    : "glass-subtle hover-lift border-border/50"
                } transition-all`}
              >
                <Star className="w-4 h-4" />
                Featured Only
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              layout
            >
              <Card className={`glass-card h-full bg-gradient-to-br ${project.gradient} group overflow-hidden hover-lift`}>
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="glass bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 px-3 py-1 gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4 relative">
                  <div className="aspect-video glass-nav rounded-lg mb-4 overflow-hidden border border-border/30">
                    <div className={`w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <div className="text-6xl font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-between text-lg group-hover:text-primary transition-colors">
                    {project.title}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardTitle>
                  <Badge variant="outline" className="glass-nav w-fit border-border/30">
                    {project.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="relative">
                  <CardDescription className="mb-4 line-clamp-3 text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-6">
                    {project.tech.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="glass-nav text-xs border-border/30">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech.length > 4 && (
                      <Badge variant="secondary" className="glass-nav text-xs border-border/30">
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.demo && (
                      <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-3 h-3" />
                          View {project.title}
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Code className="w-3 h-3" />
                        Source Code
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg mb-4">
                No projects found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setShowFeaturedOnly(false)
                }}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="text-center p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
            <div className="text-3xl font-bold text-primary mb-1">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </Card>
          <Card className="text-center p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
            <div className="text-3xl font-bold text-primary mb-1">
              {projects.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </Card>
          <Card className="text-center p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
            <div className="text-3xl font-bold text-primary mb-1">
              {[...new Set(projects.flatMap(p => p.tech))].length}
            </div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </Card>
          <Card className="text-center p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
            <div className="text-3xl font-bold text-primary mb-1">
              {[...new Set(projects.map(p => p.category))].length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}