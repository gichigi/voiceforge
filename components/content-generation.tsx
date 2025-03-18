"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { generateAIContent } from "@/lib/ai-utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"

export function ContentGeneration({ contentData, brandVoice, onUpdate, onNext }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [outline, setOutline] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      if (contentData.generateOutline) {
        const outlineResult = await generateAIContent(
          `Generate an outline for a ${contentData.contentType} about ${contentData.topic}`,
        )
        if (outlineResult.success) {
          setOutline(outlineResult.data)
          onUpdate({ outline: outlineResult.data })
        } else {
          throw new Error(outlineResult.error)
        }
      }

      const contentPrompt = `
        Create a ${contentData.contentLength} ${contentData.contentType} about "${contentData.topic}".
        ${outline ? `Follow this outline: ${outline}` : ""}
        Apply these brand voice elements:
        ${brandVoice.pillars.map((pillar) => `${pillar.title}: ${pillar.means.join(", ")}`).join("\n")}
      `

      const contentResult = await generateAIContent(contentPrompt)
      if (contentResult.success) {
        setGeneratedContent(contentResult.data)
        onUpdate({ generatedContent: contentResult.data })
      } else {
        throw new Error(contentResult.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {contentData.generateOutline && (
        <div>
          <Label>Outline</Label>
          <Textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            className="h-40"
            placeholder="Generated outline will appear here..."
            readOnly={isGenerating}
          />
        </div>
      )}
      <div>
        <Label>Generated Content</Label>
        <Textarea
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          className="h-60"
          placeholder="Generated content will appear here..."
          readOnly={isGenerating}
        />
      </div>
      {isGenerating ? (
        <LoadingSpinner />
      ) : (
        <Button onClick={generateContent} disabled={isGenerating}>
          Generate Content
        </Button>
      )}
      {generatedContent && <Button onClick={onNext}>Next</Button>}
    </div>
  )
}

