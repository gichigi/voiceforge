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
  const [error, setError] = useState("")

  const generateContent = async () => {
    setIsGenerating(true)
    setError("")

    try {
      if (contentData.generateOutline) {
        const outlineResult = await generateAIContent(
          `Generate an outline for a ${contentData.contentType} about ${contentData.topic}`,
        )
        if (outlineResult.success) {
          setOutline(outlineResult.data)
          onUpdate({ outline: outlineResult.data })

          if (outlineResult.warning) {
            toast({
              title: "Notice",
              description: outlineResult.warning,
            })
          }
        } else if (outlineResult.error) {
          throw new Error(outlineResult.error)
        }
      }

      const contentPrompt = `
        Create a ${contentData.contentLength} ${contentData.contentType} about "${contentData.topic}".
        ${outline ? `Follow this outline: ${outline}` : ""}
        Apply these brand voice elements:
        ${brandVoice.pillars.map((pillar) => `${pillar.title}: ${pillar.means.join(", ")}`).join("\n")}
      `

      const contentResult = await generateAIContent(
        contentPrompt,
        undefined,
        contentData.contentType,
        contentData.topic,
        contentData.contentLength,
      )

      if (contentResult.success) {
        setGeneratedContent(contentResult.data)
        onUpdate({ generatedContent: contentResult.data })

        if (contentResult.warning) {
          toast({
            title: "Notice",
            description: contentResult.warning,
          })
        }
      } else if (contentResult.error) {
        throw new Error(contentResult.error)
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto px-4 sm:px-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {contentData.generateOutline && (
        <div>
          <Label className="text-base font-medium">Outline</Label>
          <Textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            className="h-40 mt-2"
            placeholder="Generated outline will appear here..."
            readOnly={isGenerating}
          />
        </div>
      )}

      <div>
        <Label className="text-base font-medium">Generated Content</Label>
        <Textarea
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          className="h-60 mt-2"
          placeholder="Generated content will appear here..."
          readOnly={isGenerating}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {isGenerating ? (
          <div className="flex items-center justify-center py-2">
            <LoadingSpinner />
            <span className="ml-2">Generating content...</span>
          </div>
        ) : (
          <Button onClick={generateContent} disabled={isGenerating} className="w-full sm:w-auto">
            Generate Content
          </Button>
        )}

        {generatedContent && (
          <Button onClick={onNext} className="w-full sm:w-auto">
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

