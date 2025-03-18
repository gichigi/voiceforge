"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search } from "lucide-react"

export default function ContentLibrary() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock history data
  const historyItems = [
    {
      id: "1",
      title: "5 Ways to Improve Customer Experience in SaaS",
      type: "Blog Post",
      date: "March 6, 2025",
      time: "2:45 PM",
    },
  ]

  return (
    <main className="flex-1 overflow-auto bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-900">Content Library</h1>
          <Button onClick={() => router.push("/dashboard/content/new")} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search library..."
            className="max-w-sm bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {historyItems.length > 0 ? (
            historyItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors border shadow-sm"
                onClick={() => router.push("/dashboard/content/new")}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      <span className="text-sm text-muted-foreground">
                        {item.date} at {item.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{item.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Your library is empty</h2>
              <p className="text-muted-foreground mb-4">Content you save will appear here</p>
              <Button onClick={() => router.push("/dashboard/content/new")} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create New Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

