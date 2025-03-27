"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { generateAIContent } from "@/lib/ai-utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "@/components/ui/use-toast"

export function ContentRefinement({ contentData, brandVoice, onUpdate, onNext }) {
  const [refinedContent, setRefinedContent] = useState(contentData.generatedContent)
  const [refinementInstructions, setRefinementInstructions] = useState("")
  const [isRefining, setIsRefining] = useState(false)

  const refineContent = async () => {
    setIsRefining(true)
    try {
      const refinementPrompt = `
        Refine the following ${contentData.contentType} based on these instructions: ${refinementInstructions}
        Ensure it maintains these brand voice elements:
        ${brandVoice.pillars.map((pillar) => `${pillar.title}: ${pillar.means.join(", ")}`).join("\n")}

        Original content:
        ${refinedContent}
      `

      const result = await generateAIContent(refinementPrompt)
      if (result.success) {
        setRefinedContent(result.data)
        onUpdate({ generatedContent: result.data })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Refinement Instructions</Label>
        <Input
          value={refinementInstructions}
          onChange={(e) => setRefinementInstructions(e.target.value)}
          placeholder="Enter instructions for refining the content..."
        />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          value={refinedContent}
          onChange={(e) => setRefinedContent(e.target.value)}
          className="h-60"
          placeholder="Refined content will appear here..."
        />
      </div>
      {isRefining ? (
        <LoadingSpinner />
      ) : (
        <Button onClick={refineContent} disabled={isRefining || !refinementInstructions}>
          Refine Content
        </Button>
      )}
      <Button onClick={onNext}>Next</Button>
    </div>
  )
}

