import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        // Bright Studio Palette (Light mode)
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // Dark Studio Palette (Dark mode)
                        dark: {
                                background: 'hsl(var(--dark-background))',
                                foreground: 'hsl(var(--dark-foreground))',
                                card: {
                                        DEFAULT: 'hsl(var(--dark-card))',
                                        foreground: 'hsl(var(--dark-card-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--dark-popover))',
                                        foreground: 'hsl(var(--dark-popover-foreground))'
                                },
                                primary: {
                                        DEFAULT: 'hsl(var(--dark-primary))',
                                        foreground: 'hsl(var(--dark-primary-foreground))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--dark-secondary))',
                                        foreground: 'hsl(var(--dark-secondary-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--dark-muted))',
                                        foreground: 'hsl(var(--dark-muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--dark-accent))',
                                        foreground: 'hsl(var(--dark-accent-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--dark-destructive))',
                                        foreground: 'hsl(var(--dark-destructive-foreground))'
                                },
                                border: 'hsl(var(--dark-border))',
                                input: 'hsl(var(--dark-input))',
                                ring: 'hsl(var(--dark-ring))'
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
