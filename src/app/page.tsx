"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Card3D } from "@/components/ui/3d-card"
import { ParallaxContainer, FloatingElement } from "@/components/ui/parallax-container"
import { ResponsiveText, useResponsiveSpacing } from "@/components/ui/responsive-text"
import { useSession } from "next-auth/react"
import { Github, Linkedin, Mail, ExternalLink, Code, Database, Shield, Sparkles, ArrowRight, Star, Zap, Users, TrendingUp } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()
  const spacing = useResponsiveSpacing()

  return (
    <div className="min-h-screen relative">
      {/* 3D Animated Background Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ParallaxContainer speed={0.3} className="absolute -top-40 -right-40">
          <FloatingElement duration={8} intensity={15}>
            <div className="w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          </FloatingElement>
        </ParallaxContainer>
        
        <ParallaxContainer speed={0.5} className="absolute -bottom-40 -left-40">
          <FloatingElement duration={10} intensity={20} delay={2}>
            <div className="w-80 h-80 bg-primary/4 rounded-full blur-3xl" />
          </FloatingElement>
        </ParallaxContainer>
        
        <ParallaxContainer speed={0.2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <FloatingElement duration={12} intensity={10} delay={4}>
            <div className="w-96 h-96 bg-primary/4 rounded-full blur-3xl" />
          </FloatingElement>
        </ParallaxContainer>
      </div>

      {/* Hero Section */}
      <section className={`relative container mx-auto ${spacing.container} ${spacing.section}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 relative"
          >
            <Card3D intensity={0.1} enableGlow={true} glassEffect={true} className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/8 rounded-full animate-pulse" />
              <img 
                src="https://z-cdn-media.chatglm.cn/files/c8b758dd-6dea-4a52-adbb-2adf1b6080a0_S.R.Sunny.jpg?auth_key=1792621923-3740b17e729b459c8d32cbf65e08a281-0-340f1b8e5b77b49040be6b496d4d815a"
                alt="Shamiur Rashid Sunny"
                className="w-full h-full object-cover object-top relative z-50 transition-transform duration-300 group-hover:scale-105 transform -translate-y-16"
              />
            </Card3D>
            
            <FloatingElement intensity={5} className="absolute -top-2 -right-2">
              <motion.div
                className="bg-card/80 backdrop-blur-md p-2 rounded-full border border-border/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </FloatingElement>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <ResponsiveText 
              variant="hero"
              gradient={true}
              className="block"
            >
              Shamiur Rashid Sunny
            </ResponsiveText>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 font-light"
          >
            <ResponsiveText 
              variant="subheading"
              className="text-muted-foreground block"
            >
              Full Stack Developer & DevSecOps Engineer
            </ResponsiveText>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`flex flex-wrap ${spacing.gap} justify-center mb-8`}
          >
            {["React", "Next.js", "TypeScript", "Node.js", "Python", "DevSecOps", "Cloud Security"].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Badge variant="secondary" className="bg-card/60 backdrop-blur-md text-sm px-3 py-1 border-border/30 hover:bg-card/80 transition-all duration-300 hover-lift">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={`flex flex-wrap ${spacing.gap} justify-center`}
          >
            <Link href="/projects">
              <Button size="lg" className="bg-card/60 backdrop-blur-md hover:bg-card/80 border-border/30 px-8 py-6 text-lg gap-2 hover-lift focus-ring glass-morphism text-black">
                <Code className="w-5 h-5" />
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            {session && (
              <Link href="/static-dashboard">
                <Button variant="secondary" size="lg" className="bg-card/60 backdrop-blur-md hover:bg-card/80 border-border/30 px-8 py-6 text-lg gap-2 hover-lift focus-ring glass-morphism">
                  <Database className="w-5 h-5" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button variant="outline" size="lg" className="bg-card/40 backdrop-blur-sm hover:bg-card/60 border-border/20 px-8 py-6 text-lg gap-2 hover-lift focus-ring glass-morphism">
                <Mail className="w-5 h-5" />
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={`relative container mx-auto ${spacing.container} ${spacing.section}`}>
        <ParallaxContainer speed={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Star, label: "Projects", value: "50+" },
                { icon: Users, label: "Clients", value: "30+" },
                { icon: Zap, label: "Technologies", value: "15+" },
                { icon: TrendingUp, label: "Years", value: "5+" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card3D intensity={0.05} className="text-center glass-morphism">
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <ResponsiveText variant="heading" className="mb-1">{stat.value}</ResponsiveText>
                    <ResponsiveText variant="caption" className="text-muted-foreground">{stat.label}</ResponsiveText>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ParallaxContainer>
      </section>

      {/* About Section */}
      <section className={`relative container mx-auto ${spacing.container} ${spacing.section}`}>
        <ParallaxContainer speed={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <ResponsiveText 
                variant="heading"
                gradient={true}
                className="block"
              >
                About Me
              </ResponsiveText>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card3D intensity={0.08} className="h-full glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-card/60 backdrop-blur-md p-2 rounded-lg border border-border/30">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveText variant="body" className="text-muted-foreground leading-relaxed">
                      Passionate full-stack developer with expertise in modern web technologies. 
                      I build scalable, secure applications with exceptional user experiences 
                      and clean, maintainable code.
                    </ResponsiveText>
                  </CardContent>
                </Card3D>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card3D intensity={0.08} className="h-full glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-card/60 backdrop-blur-md p-2 rounded-lg border border-border/30">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      Security Focus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveText variant="body" className="text-muted-foreground leading-relaxed">
                      DevSecOps engineer dedicated to implementing security best practices 
                      throughout the development lifecycle. Security by design is my principle 
                      and I ensure robust protection for all applications.
                    </ResponsiveText>
                  </CardContent>
                </Card3D>
              </motion.div>
            </div>
          </motion.div>
        </ParallaxContainer>
      </section>

      {/* Featured Projects */}
      <section className={`relative container mx-auto ${spacing.container} ${spacing.section}`}>
        <ParallaxContainer speed={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <ResponsiveText 
                variant="heading"
                gradient={true}
                className="block"
              >
                Featured Projects
              </ResponsiveText>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "AI Assistant Demo",
                  description: "Interactive AI-powered chatbot with real-time responses and intelligent conversations",
                  tech: ["Next.js", "OpenAI", "Socket.io"],
                  link: "/demos/ai-chatbot",
                  gradient: "from-blue-500/10 to-purple-500/10"
                },
                {
                  title: "Code Editor Pro",
                  description: "Advanced real-time code editor with syntax highlighting and live collaboration",
                  tech: ["React", "Monaco", "WebRTC"],
                  link: "/demos/code-editor",
                  gradient: "from-green-500/10 to-teal-500/10"
                },
                {
                  title: "E-Commerce Dashboard",
                  description: "Comprehensive analytics platform with real-time sales tracking and insights",
                  tech: ["Next.js", "Recharts", "PostgreSQL"],
                  link: "/demos/ecommerce-dashboard",
                  gradient: "from-orange-500/10 to-red-500/10"
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card3D intensity={0.1} className={`h-full bg-gradient-to-br ${project.gradient} overflow-hidden glass-morphism`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors">
                        <ResponsiveText variant="subheading">{project.title}</ResponsiveText>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>
                        <ResponsiveText variant="body">{project.description}</ResponsiveText>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`flex flex-wrap ${spacing.gap} mb-4`}>
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-card/60 backdrop-blur-md border-border/30">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <Link href={project.link}>
                        <Button variant="outline" size="sm" className="w-full hover-lift focus-ring glass-morphism">
                          View Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ParallaxContainer>
      </section>
    </div>
  )
}