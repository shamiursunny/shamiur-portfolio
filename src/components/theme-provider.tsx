"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

type ExtendedTheme = "dark" | "light" | "studio" | "system"

const ThemeContext = createContext<{
  theme: ExtendedTheme
  setTheme: (theme: ExtendedTheme) => void
  resolvedTheme: "dark" | "light" | "studio"
  isAuto: boolean
}>({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
  isAuto: true,
})

export function useExtendedTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ExtendedTheme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light" | "studio">("light")
  const [isAuto, setIsAuto] = useState(true)

  const setTheme = (newTheme: ExtendedTheme) => {
    setThemeState(newTheme)
    setIsAuto(newTheme === "system")
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      document.documentElement.setAttribute("data-theme", newTheme)
      setResolvedTheme(newTheme as "dark" | "light" | "studio")
    }
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        document.documentElement.setAttribute("data-theme", systemTheme)
        setResolvedTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    handleChange()

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, isAuto }}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}