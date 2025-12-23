"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  Award,
  Briefcase,
  Code,
  Cpu,
  Database,
  Globe,
  GraduationCap,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  AwardIcon,
  BookOpen,
  Cloud,
  Lock,
  Brain,
  DollarSign,
  Building2,
  Target,
  Rocket
} from "lucide-react"

const credentials = {
  aws: [
    { title: "AWS Certified DevOps Engineer", icon: Cloud },
    { title: "AWS Solution Architecture", icon: Database },
    { title: "IT Management", icon: Briefcase }
  ],
  devops: [
    { title: "Google Certified Kubernetes", icon: Database },
    { title: "Docker & Google Cloud Certified", icon: Code },
    { title: "CI/CD Pipeline Automation", icon: Zap }
  ],
  security: [
    { title: "CISSP Certified", icon: Shield },
    { title: "Comprehensive Security Framework", icon: Lock },
    { title: "SOC 2 & HIPAA Compliance", icon: CheckCircle }
  ],
  ai: [
    { title: "Stanford University AI in Finance", icon: Brain },
    { title: "Fintech Platforms & Open Banking", icon: DollarSign },
    { title: "Blockchain & NFTs", icon: Building2 }
  ],
  worldbank: [
    "Financial Management: Disbursement Training for World Bank Clients (Trust Funds & Umbrella)",
    "ALP Finance: Accounting & Financial Analysis",
    "Sustainable Finance: Green, Social & Sustainability Bonds for Emerging Markets",
    "Financial Sector: Advances in Analysis & Policy",
    "Secured Transactions: Collateral Registries & Movable Asset-Based Financing"
  ]
}

const skills = [
  { name: "Full Stack Development", level: 95, icon: Code },
  { name: "DevSecOps & Cloud", level: 92, icon: Cloud },
  { name: "AI/ML Integration", level: 88, icon: Brain },
  { name: "Security & Compliance", level: 90, icon: Shield },
  { name: "Fintech Platforms", level: 85, icon: DollarSign },
  { name: "System Architecture", level: 93, icon: Database }
]

const stats = [
  { label: "Years Experience", value: "8+", icon: Briefcase },
  { label: "Projects Delivered", value: "150+", icon: Rocket },
  { label: "Certifications", value: "15+", icon: Award },
  { label: "Technologies", value: "25+", icon: Code }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1
                  className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Shamiur Rashid Sunny
                </motion.h1>
                <motion.h2
                  className="text-2xl md:text-3xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Full Stack Developer, DevSecOps Engineer & AI/ML Professional crafting secure, scalable, and modern web applications
                </motion.h2>
              </div>

              {/* Description */}
              <motion.div
                className="max-w-4xl mx-auto space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  I'm a technologist who works across cloud architecture, DevOps, cybersecurity, IoT, and fintech.
                  I build real-world systems: from sleek web UIs and secure APIs to fully automated CI/CD pipelines and cloud-native infrastructure.
                </p>
                <p className="text-lg text-primary font-medium">
                  Reliability, security, and a smooth experience for both users and developers are my top priorities.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button size="lg" className="text-lg px-8 py-6 gap-2 group">
                  <Briefcase className="w-5 h-5" />
                  View My Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 gap-2">
                  <Users className="w-5 h-5" />
                  Let's Connect
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center space-y-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <div className="flex justify-center">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Professional Credentials Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Professional Credentials</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Certified expertise across multiple domains with industry-recognized qualifications
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* AWS & Architecture */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full glass-card hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Cloud className="w-5 h-5" />
                      AWS & Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {credentials.aws.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <cert.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{cert.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* DevOps & Cloud */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full glass-card hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Zap className="w-5 h-5" />
                      DevOps & Cloud
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {credentials.devops.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <cert.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{cert.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security & Compliance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full glass-card hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Shield className="w-5 h-5" />
                      Security & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {credentials.security.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <cert.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{cert.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI & Fintech */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="h-full glass-card hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Brain className="w-5 h-5" />
                      AI & Fintech
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {credentials.ai.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <cert.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{cert.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* World Bank Certifications */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Building2 className="w-5 h-5" />
                    World Bank Group Certifications
                  </CardTitle>
                  <CardDescription>
                    Specialized training in international finance and development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {credentials.worldbank.map((cert, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      >
                        <AwardIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{cert}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical Expertise</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advanced proficiency across the full technology stack with specialized focus on security and scalability
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <skill.icon className="w-6 h-6 text-primary" />
                          <h3 className="text-lg font-semibold">{skill.name}</h3>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {skill.level}%
                        </Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Target className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-4xl md:text-5xl font-bold">Building the Future</h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                My work centers on building SaaS and financial platforms that are smart, secure, and ready to scale.
                I help businesses turn their big ideas into systems that work well and last.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="glass-card text-center">
                  <CardContent className="p-6">
                    <Brain className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">AI-Powered Solutions</h3>
                    <p className="text-sm text-muted-foreground">Intelligent systems that learn and adapt</p>
                  </CardContent>
                </Card>
                <Card className="glass-card text-center">
                  <CardContent className="p-6">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Security First</h3>
                    <p className="text-sm text-muted-foreground">Built-in security from day one</p>
                  </CardContent>
                </Card>
                <Card className="glass-card text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Scale Ready</h3>
                    <p className="text-sm text-muted-foreground">Designed to grow with your business</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Build Something Amazing?</h2>
              <p className="text-xl text-muted-foreground">
                Let's discuss how we can bring your vision to life with cutting-edge technology and rock-solid security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Your Project
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 gap-2">
                  <BookOpen className="w-5 h-5" />
                  View Portfolio
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}