"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Generate Blog Content</CardTitle>
            <CardDescription>Create professional blog posts with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/content/new")} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Blog
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Content Library</CardTitle>
            <CardDescription>View and manage your generated content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/history")} className="w-full" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              View Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

