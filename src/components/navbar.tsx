"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { Code, Mail, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAuthPage = pathname.startsWith("/auth")
  const isStaticDashboardPage = pathname === "/static-dashboard"

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/demos", label: "Demos" },
    { href: "/contact", label: "Contact" },
  ]

  if (session) {
    navLinks.splice(3, 0, { href: "/static-dashboard", label: "Dashboard" })
  }

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
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`bg-card/60 backdrop-blur-md border border-border/30 text-sm font-medium transition-all duration-300 hover-lift rounded-lg px-3 py-2 ${pathname === link.href
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <div className="hidden md:flex items-center space-x-2">
              {status === "loading" ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              ) : session ? (
                <div className="flex items-center space-x-2">
                  {!isStaticDashboardPage && (
                    <Link href="/static-dashboard">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-card/60 backdrop-blur-md hover-lift border-border/50 gap-2 h-10 px-4"
                      >
                        <User className="w-4 h-4" />
                        <span className="hidden sm:block">Dashboard</span>
                      </Button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground bg-card/60 backdrop-blur-md border border-border/30 px-4 py-2 rounded-lg hidden sm:block">
                    {session.user?.email}
                  </span>
                  {!isStaticDashboardPage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut()}
                      className="bg-card/60 backdrop-blur-md hover-lift border-border/50 gap-2 h-10 px-4"
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
                    className="h-10 px-6 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2 hover-lift transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block font-semibold">Login</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-card/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${pathname === link.href
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/5"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:translate-x-2"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6 border-t border-border/30 space-y-4">
                {session ? (
                  <>
                    <div className="px-6 py-2 text-sm text-muted-foreground break-all bg-primary/5 rounded-xl">
                      {session.user?.email}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-4 py-7 rounded-2xl border-border/50 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-lg font-semibold">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-start gap-4 py-7 rounded-2xl bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-all duration-300">
                      <User className="w-5 h-5" />
                      <span className="text-lg font-semibold">Login</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}