"use client"

import { motion } from "framer-motion"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExtendedTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Light", value: "light", icon: Sun, gradient: "from-yellow-400 to-orange-400" },
  { name: "Dark", value: "dark", icon: Moon, gradient: "from-purple-600 to-blue-600" },
  { name: "Studio", value: "studio", icon: Palette, gradient: "from-cyan-500 to-blue-500" },
  { name: "System", value: "system", icon: Monitor, gradient: "from-gray-500 to-gray-600" },
]

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, isAuto } = useExtendedTheme()
  
  const currentTheme = themes.find(t => t.value === theme) || themes[3]
  const CurrentIcon = currentTheme.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity"
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          />
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative"
          >
            <CurrentIcon className="h-4 w-4" />
          </motion.div>
          {isAuto && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.value
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as any)}
              className="relative cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-10 rounded-md"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isActive ? 360 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">{themeOption.name}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto h-2 w-2 bg-primary rounded-full"
                  />
                )}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}