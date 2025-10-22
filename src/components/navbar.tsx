"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { Code, Mail, User, LogOut } from "lucide-react"

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isAuthPage = pathname.startsWith("/auth")
  const isStaticDashboardPage = pathname === "/static-dashboard"

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <nav className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover-lift px-3 py-2 rounded-lg transition-all duration-300"
            >
              Shamiur Rashid Sunny
            </Link>
            
            {!isStaticDashboardPage && (
              <div className="hidden md:flex space-x-2">
                <Link
                  href="/"
                  className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${
                    pathname === "/" 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${
                    pathname === "/projects" 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  Projects
                </Link>
                <Link
                  href="/demos"
                  className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${
                    pathname === "/demos" 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  Demos
                </Link>
                {session && (
                  <Link
                    href="/static-dashboard"
                    className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${
                      pathname === "/static-dashboard" 
                        ? "bg-primary/20 text-primary border-primary/30" 
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/contact"
                  className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${
                    pathname === "/contact" 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                {!isStaticDashboardPage && (
                  <Link href="/static-dashboard">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-card/60 backdrop-blur-md hover-lift border-border/50 gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground bg-card/60 backdrop-blur-md border border-border/30 px-3 py-2 rounded-lg hidden sm:block">
                  {session.user?.email}
                </span>
                {!isStaticDashboardPage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="bg-card/60 backdrop-blur-md hover-lift border-border/50 gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                  </Button>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button 
                  size="sm" 
                  className="bg-card/80 backdrop-blur-lg hover-lift bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}