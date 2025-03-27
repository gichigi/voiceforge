"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { RichTextEditor } from "./rich-text-editor"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ContentGeneratorProps {
  topic: string
  keywords: string[]
  targetAudience: string
  contentLength: string
  onSave: (title: string, content: string) => void
}

export function ContentGenerator({ topic, keywords, targetAudience, contentLength, onSave }: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Generate content on component mount
  useEffect(() => {
    if (topic && !generatedContent) {
      generateContent()
    }
  }, [topic])

  const generateContent = async () => {
    setIsGenerating(true)

    try {
      // Get brand voice from localStorage
      const brandVoiceData = localStorage.getItem("generatedBrandVoice")
      const brandVoice = brandVoiceData ? JSON.parse(brandVoiceData) : null

      // Get business info from localStorage
      const businessInfoData = localStorage.getItem("businessInfo")
      const businessInfo = businessInfoData ? JSON.parse(businessInfoData) : null

      // Mock API call - in a real app, this would call your OpenAI API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate title and content based on inputs
      const title = `${topic}: A Comprehensive Guide for ${targetAudience}`

      // Start with an intro that mentions the business if available
      let content = businessInfo
        ? `<p>At ${businessInfo.name}, we understand the importance of ${topic} for ${targetAudience}.</p>`
        : `<p>Understanding ${topic} is crucial for ${targetAudience}.</p>`

      // Add keyword-rich content
      content += `<p>In this comprehensive guide, we'll explore everything you need to know about ${topic}`

      if (keywords.length > 0) {
        content += `, including ${keywords.slice(0, -1).join(", ")}${keywords.length > 1 ? ` and ${keywords[keywords.length - 1]}` : ""}`
      }

      content += `.</p>`

      // Add sections based on keywords
      keywords.forEach((keyword, index) => {
        content += `<h2>${keyword.charAt(0).toUpperCase() + keyword.slice(1)}</h2>`
        content += `<p>When considering ${topic}, ${keyword} plays a vital role. `

        // Add brand voice elements if available
        if (brandVoice && brandVoice.pillars && brandVoice.pillars.length > index % 3) {
          const pillar = brandVoice.pillars[index % 3]
          content += `${pillar.whatItMeans[0]} `
        }

        content += `This is especially important for ${targetAudience} because it directly impacts their experience and results.</p>`
      })

      // Add conclusion
      content += `<h2>Conclusion</h2>`
      content += `<p>By understanding these key aspects of ${topic}, ${targetAudience} can achieve better results and avoid common pitfalls. `

      // Add brand voice to conclusion if available
      if (brandVoice && brandVoice.pillars && brandVoice.pillars.length > 0) {
        content += `Remember, ${brandVoice.pillars[0].whatItMeans[1]} `
      }

      content += `We hope this guide has provided valuable insights into ${topic}.</p>`

      setGeneratedTitle(title)
      setGeneratedContent(content)

      toast({
        title: "Content generated!",
        description: "Your blog content has been created successfully.",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    onSave(generatedTitle, generatedContent)
    toast({
      title: "Content saved!",
      description: "Your blog has been saved to your library.",
      action: (
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/history")}>
          View Library
        </Button>
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Generated Content</h2>
        <Button variant="outline" size="sm" onClick={generateContent} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      {isGenerating ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Generating your content...
              <br />
              This may take a few moments.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{generatedTitle}</CardTitle>
                <CardDescription className="pt-1.5">Keywords: {keywords.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save to Library</Button>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                  />
                </CardTitle>
                <CardDescription className="pt-1.5">Keywords: {keywords.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor initialValue={generatedContent} onChange={setGeneratedContent} />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save to Library</Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

