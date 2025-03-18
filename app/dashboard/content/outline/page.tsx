"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react"
import { generateText } from "@/lib/ai-utils"
import { openai } from "@/lib/ai-utils"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function OutlinePage() {
  const router = useRouter()
  const [contentData, setContentData] = useState<any>(null)
  const [generatedOutline, setGeneratedOutline] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("contentCreationData")
    if (savedData) {
      setContentData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    if (contentData) {
      handleGenerateOutline()
    }
  }, [contentData])

  const handleGenerateOutline = async () => {
    setIsGenerating(true)

    try {
      const prompt = `Create a detailed outline for a ${contentData.contentType} about "${contentData.topic}" with a length of ${contentData.contentLength}. The outline should include main sections, subsections, and key points to cover.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 1000,
      })

      setGeneratedOutline(text)
    } catch (error) {
      console.error("Error generating outline:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = () => {
    localStorage.setItem("generatedOutline", generatedOutline)
    router.push("/dashboard/content/new")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Generated Outline</CardTitle>
          <CardDescription>
            Review and edit the outline for your {contentData?.contentType} about "{contentData?.topic}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Generating outline..." />
            </div>
          ) : (
            <>
              <Textarea
                value={generatedOutline}
                onChange={(e) => setGeneratedOutline(e.target.value)}
                className="min-h-[300px]"
                placeholder="Your generated outline will appear here..."
                readOnly={!isEditing}
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {isEditing ? "Preview" : "Edit"}
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleContinue}>
                    Generate Content
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

