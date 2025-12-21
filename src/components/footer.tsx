import Link from "next/link"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="glass-subtle border-t border-border/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gradient">
              Shamiur Rashid Sunny
            </h3>
            <p className="text-sm text-muted-foreground">
              Full Stack Developer & DevSecOps Engineer building secure, scalable applications with modern technologies.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/shamiursunny/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-nav p-2 rounded-lg text-muted-foreground hover:text-primary transition-all duration-300 hover-lift"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/shamiur-rashid-sunny"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-nav p-2 rounded-lg text-muted-foreground hover:text-primary transition-all duration-300 hover-lift"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:shamiur@engineer.com"
                className="glass-nav p-2 rounded-lg text-muted-foreground hover:text-primary transition-all duration-300 hover-lift"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block glass-nav text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover-lift px-3 py-2 rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="block glass-nav text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover-lift px-3 py-2 rounded-lg"
              >
                Projects
              </Link>
              <Link
                href="/demos"
                className="block glass-nav text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover-lift px-3 py-2 rounded-lg"
              >
                Demos
              </Link>
              <Link
                href="/contact"
                className="block glass-nav text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover-lift px-3 py-2 rounded-lg"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Get In Touch</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Available for freelance and full-time opportunities</p>
              <p>Open to collaboration on interesting projects</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 glass-nav px-3 py-2 rounded-lg text-primary hover:bg-primary/20 transition-all duration-300 hover-lift"
              >
                <Mail className="w-3 h-3" />
                Send Message
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground glass-nav px-4 py-2 rounded-lg mb-4 md:mb-0">
            © 2025 Shamiur Rashid Sunny. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground glass-nav px-4 py-2 rounded-lg">
            Built with
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            using Next.js & TypeScript
          </div>
        </div>
      </div>
    </footer>
  )
}
