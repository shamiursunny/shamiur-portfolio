import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeTransition } from "@/components/theme-transition";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shamiur Rashid Sunny - Full Stack Developer & DevSecOps Engineer",
  description: "Personal portfolio of Shamiur Rashid Sunny, a Full Stack Developer & DevSecOps Engineer specializing in secure, production-ready applications.",
  keywords: ["Full Stack Developer", "DevSecOps", "Next.js", "React", "TypeScript", "Security"],
  authors: [{ name: "Shamiur Rashid Sunny" }],
  openGraph: {
    title: "Shamiur Rashid Sunny - Portfolio",
    description: "Full Stack Developer & DevSecOps Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col text-rendering`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeTransition />
          <Providers>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
