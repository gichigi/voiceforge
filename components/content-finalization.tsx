"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function ContentFinalization({ contentData, onUpdate }) {
  const [finalContent, setFinalContent] = useState(contentData.generatedContent)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      const contentId = `content_${Date.now()}`
      const content = {
        id: contentId,
        contentType: contentData.contentType,
        topic: contentData.topic,
        content: finalContent,
        outline: contentData.outline,
        createdAt: new Date().toISOString(),
      }

      // Get existing contents
      let contents = []
      try {
        const storedContents = localStorage.getItem("contents")
        if (storedContents) {
          contents = JSON.parse(storedContents)
        }
      } catch (e) {
        console.error("Error parsing stored contents:", e)
      }

      // Add new content
      contents.unshift(content)

      // Save back to localStorage
      localStorage.setItem("contents", JSON.stringify(contents))

      toast({
        title: "Success",
        description: "Content saved to your library!",
      })

      // Navigate to library after short delay
      setTimeout(() => {
        router.push("/dashboard/history")
      }, 1500)
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(finalContent)
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy content. Please try manually selecting and copying the text.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div>
        <Label className="text-base font-medium">Final Content</Label>
        <Textarea
          value={finalContent}
          onChange={(e) => setFinalContent(e.target.value)}
          className="h-60 mt-2"
          placeholder="Your finalized content..."
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? "Saving..." : "Save to Library"}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="w-full sm:w-auto">
          Copy to Clipboard
        </Button>
      </div>
    </div>
  )
}

