"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, ArrowRight, User, MessageSquare, Globe } from "lucide-react"
import { messageStorage } from "@/lib/message-storage"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields")
      return
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Save to message storage for dashboard display
      messageStorage.addMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message
      })

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("🎉 Message sent successfully! I'll get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
        setIsSubmitted(true)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/4 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto px-4 relative z-10"
        >
          <Card className="glass-card text-center p-8 bg-gradient-to-br from-green-500/8 to-emerald-500/4 border-green-500/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 glass-subtle bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 professional-shadow"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 text-gradient from-green-600 to-emerald-600">
              🎉 Message Sent Successfully!
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Thank you for reaching out! Your message has been delivered successfully. 
              I'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="glass hover-lift bg-green-500/20 hover:bg-green-500/30 text-green-700 border-green-500/30"
            >
              Send Another Message
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/4 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-pulse delay-500" />
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
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm always interested in hearing about new projects and opportunities. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Send me a message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and I'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 glass-nav border-border/30 focus:border-primary/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 glass-nav border-border/30 focus:border-primary/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or just say hello..."
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="glass-nav border-border/30 focus:border-primary/30 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 h-12 glass hover-lift bg-primary/20 hover:bg-primary/30 text-primary border-primary/30" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/30 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
                    <img 
                      src="https://z-cdn-media.chatglm.cn/files/c8b758dd-6dea-4a52-adbb-2adf1b6080a0_S.R.Sunny.jpg?auth_key=1792621923-3740b17e729b459c8d32cbf65e08a281-0-340f1b8e5b77b49040be6b496d4d815a"
                      alt="Shamiur Rashid Sunny"
                      className="w-full h-full object-cover object-top"
                      style={{ objectPosition: 'center 40%' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Shamiur Rashid Sunny</h3>
                    <p className="text-muted-foreground">Full Stack Developer & DevSecOps Engineer</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate about building secure, scalable web applications and implementing DevSecOps best practices. 
                  Always eager to take on new challenges and collaborate on innovative projects.
                </p>
              </CardContent>
            </Card>

            {/* Contact Cards */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">shamiur@engineer.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-muted-foreground">+880-01737394735</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Chittagong, Bangladesh</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
              <CardHeader>
                <CardTitle>Connect With Me</CardTitle>
                <CardDescription>
                  Follow me on social media for updates and professional networking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://github.com/shamiursunny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-primary/10 hover:bg-primary/10 transition-all group"
                >
                  <Github className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <div className="flex-1">
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">/shamiursunny</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href="https://linkedin.com/in/shamiursunny"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-primary/10 hover:bg-primary/10 transition-all group"
                >
                  <Linkedin className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <div className="flex-1">
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">/shamiursunny</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 hover:border-green-500/30 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  Available for Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  I'm currently open to new opportunities and interesting projects. 
                  Whether it's a full-time position, freelance work, or collaboration, 
                  I'd love to hear from you!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">Full-time</Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">Freelance</Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">Consulting</Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">Remote</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}