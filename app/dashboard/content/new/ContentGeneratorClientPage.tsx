"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Copy, Loader2 } from "lucide-react"
import { generateAIContent } from "@/lib/ai-utils"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContentGeneratorClientPage() {
  const [topic, setTopic] = useState("")
  const [contentLength, setContentLength] = useState("medium")
  const [keywords, setKeywords] = useState("")
  const [customContext, setCustomContext] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [plainTextContent, setPlainTextContent] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Add this function after the useState declarations
  function cleanHtmlContent(htmlContent) {
    // Extract just the body content if it's a full HTML document
    if (htmlContent.includes("<!DOCTYPE html>") || htmlContent.includes("<html")) {
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim()
      }
    }

    // Remove any code block formatting that might be present
    if (htmlContent.startsWith("```html") || htmlContent.startsWith("```")) {
      return htmlContent
        .replace(/^```html\n/, "")
        .replace(/^```\n/, "")
        .replace(/```$/, "")
        .trim()
    }

    return htmlContent
  }

  // Add a function to count words in HTML content
  function countWordsInHtml(html) {
    // Create a temporary element
    const tempElement = document.createElement("div")
    tempElement.innerHTML = html

    // Get the text content
    const text = tempElement.textContent || tempElement.innerText

    // Count words (split by whitespace and filter out empty strings)
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  // Function to convert HTML to plain text while preserving structure
  function htmlToPlainText(html) {
    const tempElement = document.createElement("div")
    tempElement.innerHTML = html

    // Replace common block elements with newlines
    const blockElements = tempElement.querySelectorAll("p, h1, h2, h3, h4, h5, h6, div, li, br")
    blockElements.forEach((el) => {
      if (el.tagName.toLowerCase() === "br") {
        el.replaceWith("\n")
      } else {
        // Add double newline for headings
        const isHeading = /^h[1-6]$/i.test(el.tagName)
        el.insertAdjacentText("beforeend", isHeading ? "\n\n" : "\n")
      }
    })

    // Get the text content
    return tempElement.textContent || tempElement.innerText
  }

  // Function to convert plain text back to HTML
  function plainTextToHtml(text) {
    // Basic conversion - wrap paragraphs
    const paragraphs = text.split(/\n\s*\n/)

    return paragraphs
      .map((para) => {
        // Check if it looks like a heading (short, ends with no punctuation)
        const trimmedPara = para.trim()
        if (trimmedPara.length < 60 && !trimmedPara.match(/[.,:;!?]$/)) {
          return `<h2>${trimmedPara}</h2>`
        }

        // Handle lists
        if (trimmedPara.match(/^[-*•]\s/m)) {
          const listItems = trimmedPara
            .split(/\n/)
            .map((item) => {
              return `<li>${item.replace(/^[-*•]\s/, "")}</li>`
            })
            .join("")
          return `<ul>${listItems}</ul>`
        }

        // Regular paragraph
        return `<p>${trimmedPara.replace(/\n/g, "<br>")}</p>`
      })
      .join("")
  }

  const handleGenerateContent = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your blog post",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingContent(true)
    setWordCount(0)

    const contentPrompt = `
  Create a ${contentLength} blog post about "${topic}".
  ${keywords ? `Include these keywords: ${keywords}` : ""}
  ${customContext ? `Additional context: ${customContext}` : ""}

  Important formatting instructions:
  1. Return ONLY the HTML content for the blog post - do not include <!DOCTYPE>, <html>, <head>, or <body> tags
  2. Use semantic HTML tags for structure (<h1>, <h2>, <p>, <ul>, <ol>, etc.)
  3. Keep paragraphs concise (3-4 sentences max)
  4. Use bullet points or numbered lists where appropriate
  5. Include subheadings to break up content
  6. Do not include any CSS or styling in the HTML
  7. Make the content engaging and visually appealing
  8. Do not wrap the response in code blocks or markdown formatting
`

    try {
      // Pass the contentLength parameter to the generateAIContent function
      const result = await generateAIContent(
        contentPrompt,
        2000,
        "blog-post",
        topic,
        contentLength, // Pass the selected length
      )

      if (result.success) {
        // Clean and process the HTML content
        let content = cleanHtmlContent(result.data)

        // Count words in the generated content
        const count = countWordsInHtml(content)
        setWordCount(count)

        // Convert to plain text for editing
        const plainText = htmlToPlainText(content)
        setPlainTextContent(plainText)

        // Wrap in a div with proper styling
        content = `
          <div class="prose prose-slate max-w-none space-y-6 font-inter">
            ${content}
          </div>
        `

        setGeneratedContent(content)
        setIsEditing(false) // Start with viewing mode instead of editing
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate content",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleSave = () => {
    // Implement save to library functionality
    toast({
      title: "Saved",
      description: "Content saved to your library",
    })
  }

  // Update the handleCopy function to better handle HTML content
  const handleCopy = () => {
    try {
      // Create a temporary element to parse the HTML
      const tempElement = document.createElement("div")

      // Clean the HTML content before parsing
      const cleanedContent = cleanHtmlContent(generatedContent)
      tempElement.innerHTML = cleanedContent

      // Get the text content
      const textContent = tempElement.textContent || tempElement.innerText

      // Copy to clipboard
      navigator.clipboard.writeText(textContent)

      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying content:", error)
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  // Handle saving edited content
  const handleSaveEdit = () => {
    try {
      // Convert plain text back to HTML
      const htmlContent = plainTextToHtml(plainTextContent)

      // Wrap in a div with proper styling
      const content = `
        <div class="prose prose-slate max-w-none space-y-6 font-inter">
          ${htmlContent}
        </div>
      `

      setGeneratedContent(content)
      setIsEditing(false)

      // Recalculate word count
      const count = countWordsInHtml(htmlContent)
      setWordCount(count)

      toast({
        title: "Content updated",
        description: "Your edits have been applied",
      })
    } catch (error) {
      console.error("Error saving edits:", error)
      toast({
        title: "Error",
        description: "Failed to save edits",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog Content Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Provide information about the blog post you want to create</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="E.g., Benefits of content marketing"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-length">Length</Label>
              <Select value={contentLength} onValueChange={setContentLength}>
                <SelectTrigger id="content-length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (300-400 words)</SelectItem>
                  <SelectItem value="medium">Medium (400-500 words)</SelectItem>
                  <SelectItem value="long">Long (500-600 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (optional)</Label>
              <Input
                id="keywords"
                placeholder="E.g., SEO, marketing, strategy"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-context">Additional Context (optional)</Label>
              <Textarea
                id="custom-context"
                placeholder="E.g., add more about your business, include a call to action, add a customer quote, etc."
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleGenerateContent} disabled={isGeneratingContent || !topic} className="w-full">
              {isGeneratingContent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Blog Post"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Content Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your content directly in the editor below"
                  : "Your generated blog post will appear here"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {wordCount > 0 && (
                <div className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md flex items-center">
                  {wordCount} words
                </div>
              )}
              {generatedContent && !isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Content
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isGeneratingContent ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Generating your blog post...</p>
                  <p className="text-xs text-muted-foreground">This may take a moment</p>
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={plainTextContent}
                      onChange={(e) => setPlainTextContent(e.target.value)}
                      className="min-h-[500px] font-sans text-sm"
                      placeholder="Edit your content here..."
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative min-h-[500px]">
                    <div
                      className="min-h-[500px] border rounded-md p-6 bg-white overflow-auto font-inter"
                      dangerouslySetInnerHTML={{ __html: generatedContent }}
                    />
                  </div>
                )}

                {generatedContent && !isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Library
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

