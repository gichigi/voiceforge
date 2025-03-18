"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { saveContent } from "@/app/actions/save-content"
import { toast } from "@/components/ui/use-toast"

export function ContentFinalization({ contentData, onUpdate }) {
  const [finalContent, setFinalContent] = useState(contentData.generatedContent)

  const handleSave = async () => {
    try {
      const result = await saveContent({
        contentType: contentData.contentType,
        topic: contentData.topic,
        content: finalContent,
        outline: contentData.outline,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Content saved successfully!",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(finalContent)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Final Content</Label>
        <Textarea
          value={finalContent}
          onChange={(e) => setFinalContent(e.target.value)}
          className="h-60"
          placeholder="Your finalized content..."
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleSave}>Save to Library</Button>
        <Button onClick={handleCopy} variant="outline">
          Copy to Clipboard
        </Button>
      </div>
    </div>
  )
}

