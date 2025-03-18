"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sparkles, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check for system preference or stored preference
    const stored = localStorage.getItem("theme")
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = stored || systemPreference

    setTheme(initialTheme as "light" | "dark")
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background z-50">
        <div className="w-full flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>VoiceForge</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/content/new" className="text-sm font-medium">
              Blog Generator
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium">
              Library
            </Link>
            <Link href="/test/openai" className="text-sm font-medium text-blue-500">
              Test OpenAI
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              <span className="sr-only">Toggle theme</span>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <div className="flex flex-1 w-full p-0">{children}</div>
    </div>
  )
}

