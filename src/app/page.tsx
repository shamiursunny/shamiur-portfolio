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
    <div className="min-h-screen relative overflow-x-hidden">
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
      <section className={`relative container mx-auto ${spacing.container} pt-20 pb-32 md:pt-32 md:pb-48`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="mb-12 relative inline-block"
          >
            <Card3D intensity={0.15} enableGlow={true} glassEffect={true} className="w-48 h-48 mx-auto rounded-full overflow-hidden relative border-4 border-primary/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 animate-pulse" />
              <img
                src="https://z-cdn-media.chatglm.cn/files/c8b758dd-6dea-4a52-adbb-2adf1b6080a0_S.R.Sunny.jpg?auth_key=1792621923-3740b17e729b459c8d32cbf65e08a281-0-340f1b8e5b77b49040be6b496d4d815a"
                alt="Shamiur Rashid Sunny"
                className="w-full h-full object-cover object-top relative z-10 transition-transform duration-700 hover:scale-110 transform -translate-y-16"
              />
            </Card3D>

            <FloatingElement intensity={8} className="absolute -top-4 -right-4">
              <motion.div
                className="bg-card/90 backdrop-blur-xl p-3 rounded-full border border-primary/30 shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
            </FloatingElement>
          </motion.div>

          <div className="space-y-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ResponsiveText
                variant="hero"
                gradient={true}
                className="block tracking-tight"
              >
                Shamiur Rashid Sunny
              </ResponsiveText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-light"
            >
              <ResponsiveText
                variant="subheading"
                className="text-muted-foreground/80 block max-w-3xl mx-auto leading-relaxed"
              >
                Full Stack Developer & DevSecOps Engineer crafting secure, high-performance digital experiences.
              </ResponsiveText>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`flex flex-wrap gap-3 justify-center mb-12`}
          >
            {["React", "Next.js", "TypeScript", "Node.js", "Python", "DevSecOps", "Cloud Security"].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Badge variant="secondary" className="bg-primary/5 backdrop-blur-md text-sm px-4 py-1.5 border-primary/10 hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-default">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={`flex flex-wrap gap-4 justify-center`}
          >
            <Link href="/projects">
              <Button size="lg" className="h-14 px-10 text-lg gap-3 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
                <Code className="w-5 h-5" />
                View Projects
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg gap-3 rounded-2xl border-primary/20 hover:bg-primary/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1">
                <Mail className="w-5 h-5" />
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className={`relative container mx-auto ${spacing.container} py-24`}>
        <ParallaxContainer speed={0.3}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Star, label: "Projects", value: "50+" },
                { icon: Users, label: "Clients", value: "30+" },
                { icon: Zap, label: "Technologies", value: "15+" },
                { icon: TrendingUp, label: "Years", value: "5+" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card3D intensity={0.1} className="p-8 text-center glass-morphism border-primary/10 hover:border-primary/30 transition-colors rounded-3xl">
                    <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <ResponsiveText variant="heading" className="mb-2 font-black">{stat.value}</ResponsiveText>
                    <ResponsiveText variant="caption" className="text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</ResponsiveText>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ParallaxContainer>
      </section>

      {/* About Section */}
      <section className={`relative container mx-auto ${spacing.container} py-24 md:py-32`}>
        <ParallaxContainer speed={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-20">
              <ResponsiveText
                variant="heading"
                gradient={true}
                className="block mb-4"
              >
                About My Expertise
              </ResponsiveText>
              <div className="h-1.5 w-24 bg-primary/20 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card3D intensity={0.08} className="h-full glass-morphism p-10 rounded-3xl border-primary/5 hover:border-primary/20 transition-all shadow-xl">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                      <Code className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Development</CardTitle>
                  </div>
                  <CardContent className="p-0">
                    <ResponsiveText variant="body" className="text-muted-foreground leading-relaxed text-lg">
                      Passionate full-stack developer with expertise in modern web technologies.
                      I build scalable, secure applications with exceptional user experiences
                      and clean, maintainable code. My focus is on performance and reliability.
                    </ResponsiveText>
                  </CardContent>
                </Card3D>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card3D intensity={0.08} className="h-full glass-morphism p-10 rounded-3xl border-primary/5 hover:border-primary/20 transition-all shadow-xl">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Security Focus</CardTitle>
                  </div>
                  <CardContent className="p-0">
                    <ResponsiveText variant="body" className="text-muted-foreground leading-relaxed text-lg">
                      DevSecOps engineer dedicated to implementing security best practices
                      throughout the development lifecycle. Security by design is my principle
                      and I ensure robust protection for all applications, from code to cloud.
                    </ResponsiveText>
                  </CardContent>
                </Card3D>
              </motion.div>
            </div>
          </motion.div>
        </ParallaxContainer>
      </section>

      {/* Featured Projects */}
      <section className={`relative container mx-auto ${spacing.container} py-24 md:py-32`}>
        <ParallaxContainer speed={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20">
              <ResponsiveText
                variant="heading"
                gradient={true}
                className="block mb-4"
              >
                Featured Projects
              </ResponsiveText>
              <div className="h-1.5 w-24 bg-primary/20 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card3D intensity={0.1} className={`h-full bg-gradient-to-br ${project.gradient} overflow-hidden glass-morphism rounded-3xl border-primary/5 hover:border-primary/30 transition-all group shadow-lg`}>
                    <CardHeader className="p-8">
                      <CardTitle className="flex items-center justify-between group-hover:text-primary transition-colors mb-4">
                        <ResponsiveText variant="subheading" className="font-bold">{project.title}</ResponsiveText>
                        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                      </CardTitle>
                      <CardDescription>
                        <ResponsiveText variant="body" className="text-muted-foreground/90 leading-relaxed">{project.description}</ResponsiveText>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <div className={`flex flex-wrap gap-2 mb-8`}>
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-primary/5 backdrop-blur-md border-primary/10">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <Link href={project.link}>
                        <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 gap-2 font-semibold">
                          View Project
                          <ArrowRight className="w-4 h-4" />
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
