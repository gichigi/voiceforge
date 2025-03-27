"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Copy, Loader2, Bold, Italic, List, Heading, LinkIcon } from "lucide-react"
import { generateAIContent } from "@/lib/ai-utils"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { saveContent, getContent, updateContent } from "@/lib/data-service"
// Import the RichTextEditor component
import { RichTextEditor } from "@/components/rich-text-editor"

export default function ContentGeneratorClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentId = searchParams.get("id")
  const editorRef = useRef(null)

  const [topic, setTopic] = useState("")
  const [contentLength, setContentLength] = useState("medium")
  const [keywords, setKeywords] = useState("")
  const [customContext, setCustomContext] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Add a clear inputs function
  const clearAllInputs = () => {
    setTopic("")
    setContentLength("medium")
    setKeywords("")
    setCustomContext("")
    setGeneratedContent("")
    setMarkdownContent("")
    setWordCount(0)
    toast({
      title: "Inputs cleared",
      description: "All form fields have been reset.",
    })
  }

  // Load content if editing an existing item
  useEffect(() => {
    if (contentId) {
      setIsLoading(true)
      try {
        const content = getContent(contentId)
        if (content) {
          setTopic(content.topic || "")
          setContentLength(
            content.contentType.includes("short") ? "short" : content.contentType.includes("long") ? "long" : "medium",
          )
          setGeneratedContent(content.htmlContent || content.content || "")
          setMarkdownContent(content.markdownContent || "")

          // Extract keywords and context if available
          if (content.keywords) {
            setKeywords(content.keywords)
          }
          if (content.customContext) {
            setCustomContext(content.customContext)
          }

          // Calculate word count
          if (content.htmlContent) {
            setWordCount(countWordsInHtml(content.htmlContent))
          }
        }
      } catch (error) {
        console.error("Error loading content:", error)
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [contentId])

  // Function to clean HTML content
  function cleanHtmlContent(htmlContent) {
    // Extract just the body content if it's a full HTML document
    if (htmlContent.includes("<!DOCTYPE html>") || htmlContent.includes("<html")) {
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim()
      }
    }

    // Remove any code block formatting that might be present
    if (htmlContent.startsWith("```html\n") || htmlContent.startsWith("```\n")) {
      return htmlContent
        .replace(/^```html\n/, "")
        .replace(/^```\n/, "")
        .replace(/```$/, "")
        .trim()
    }

    return htmlContent
  }

  // Function to count words in HTML content
  function countWordsInHtml(html) {
    // Create a temporary element
    const tempElement = document.createElement("div")
    tempElement.innerHTML = html

    // Get the text content
    const text = tempElement.textContent || tempElement.innerText

    // Count words (split by whitespace and filter out empty strings)
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  // Function to convert HTML to Markdown
  function htmlToMarkdown(html) {
    // This is a placeholder - in a real app, you'd use a library like turndown
    // For now, we'll just return the HTML as is
    return html
  }

  // Function to convert Markdown to HTML
  function markdownToHtml(markdown) {
    // This is a placeholder - in a real app, you'd use a library like marked
    // For now, we'll just return the markdown as is
    return markdown
  }

  // Modify the handleGenerateContent function to incorporate brand voice
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

    // Fetch brand voice data from localStorage
    let brandVoiceData = null
    try {
      const storedBrandVoice = localStorage.getItem("generatedBrandVoice")
      if (storedBrandVoice) {
        brandVoiceData = JSON.parse(storedBrandVoice)
      }
    } catch (error) {
      console.error("Error fetching brand voice data:", error)
    }

    // Fetch business information from localStorage
    let businessInfo = null
    try {
      const storedBusinessInfo = localStorage.getItem("brandVoiceData")
      if (storedBusinessInfo) {
        businessInfo = JSON.parse(storedBusinessInfo)
      }
    } catch (error) {
      console.error("Error fetching business info:", error)
    }

    // Create a more detailed prompt that incorporates brand voice and business info
    const contentPrompt = `
Create a ${contentLength} blog post about "${topic}".
${keywords ? `Include these keywords: ${keywords}` : ""}
${customContext ? `Additional context: ${customContext}` : ""}

${
  brandVoiceData
    ? `
BRAND VOICE GUIDELINES:
Executive Summary: ${brandVoiceData.executiveSummary}

Brand Voice Pillars:
${brandVoiceData.pillars
  .map(
    (pillar) =>
      `${pillar.title}:
   - What it means: ${pillar.means.join(", ")}
   - What it doesn't mean: ${pillar.doesntMean.join(", ")}`,
  )
  .join("\n\n")}
`
    : ""
}

${
  businessInfo
    ? `
BUSINESS INFORMATION:
Business Name: ${businessInfo.businessName}
Year Founded: ${businessInfo.yearFounded}
Business Description: ${businessInfo.businessDescription}
Target Demographics: ${Array.isArray(businessInfo.selectedDemographics) ? businessInfo.selectedDemographics.join(", ") : ""}
Business Values: ${Array.isArray(businessInfo.businessValues) ? businessInfo.businessValues.join(", ") : ""}
`
    : ""
}

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

        // Convert HTML to Markdown for editing
        const markdown = htmlToMarkdown(content)
        setMarkdownContent(markdown)

        // Wrap in a div with proper styling
        content = `
        <div class="prose prose-slate dark:prose-invert max-w-none space-y-6 font-inter">
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
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating content",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingContent(false)
    }
  }

  // Modify the handleSave function to include a clickable link to the library
  const handleSave = async () => {
    if (!generatedContent) {
      toast({
        title: "No content",
        description: "Please generate content before saving",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const contentData = {
        contentType: `blog-post-${contentLength}`,
        topic,
        content: generatedContent,
        htmlContent: generatedContent,
        markdownContent,
        keywords,
        customContext,
        wordCount,
      }

      if (contentId) {
        // Update existing content
        const updated = updateContent(contentId, contentData)
        if (updated) {
          toast({
            title: "Updated",
            description: (
              <div>
                Content updated in your library.{" "}
                <a
                  href="/dashboard/history"
                  className="underline font-medium hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/dashboard/history")
                  }}
                >
                  View library
                </a>
              </div>
            ),
          })
        } else {
          throw new Error("Failed to update content")
        }
      } else {
        // Save new content
        const id = saveContent(contentData)
        if (id) {
          toast({
            title: "Saved",
            description: (
              <div>
                Content saved to your library.{" "}
                <a
                  href="/dashboard/history"
                  className="underline font-medium hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/dashboard/history")
                  }}
                >
                  View library
                </a>
              </div>
            ),
          })
        } else {
          throw new Error("Failed to save content")
        }
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle copying content
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
      })
    }
  }

  // Handle saving edited content
  const handleSaveEdit = () => {
    try {
      // Get the current content from the editor
      const editorDiv = document.querySelector('[contenteditable="true"]')
      if (editorDiv) {
        const updatedContent = editorDiv.innerHTML
        setGeneratedContent(updatedContent)

        // Recalculate word count
        const count = countWordsInHtml(updatedContent)
        setWordCount(count)

        setIsEditing(false)

        toast({
          title: "Content updated",
          description: "Your edits have been applied",
        })
      }
    } catch (error) {
      console.error("Error saving edits:", error)
      toast({
        title: "Error",
        description: "Failed to save edits",
      })
    }
  }

  // Insert markdown formatting at cursor position or around selected text
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const beforeSelection = text.substring(0, start)
    const selection = text.substring(start, end)
    const afterSelection = text.substring(end)

    // If text is selected, wrap it with formatting
    // If no text is selected, insert formatting at cursor position
    const newText = selection
      ? `${beforeSelection}${prefix}${selection}${suffix}${afterSelection}`
      : `${beforeSelection}${prefix}${suffix}${afterSelection}`

    setMarkdownContent(newText)

    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus()
      if (selection) {
        // If text was selected, place cursor after the formatted text
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      } else {
        // If no text was selected, place cursor between prefix and suffix
        const newCursorPos = start + prefix.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  // Formatting functions
  const addHeading = () => insertMarkdown("## ", "\n")
  const addBold = () => insertMarkdown("**", "**")
  const addItalic = () => insertMarkdown("*", "*")
  const addLink = () => insertMarkdown("[Link text](", ")")
  const addBulletList = () => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const text = textarea.value
    const beforeCursor = text.substring(0, start)

    // Check if we're at the beginning of a line
    const isStartOfLine = start === 0 || beforeCursor.endsWith("\n")

    if (isStartOfLine) {
      insertMarkdown("- ", "")
    } else {
      insertMarkdown("\n- ", "")
    }
  }

  // Render the markdown editor toolbar
  const renderMarkdownToolbar = () => (
    <div className="flex flex-wrap items-center gap-1 mb-2 p-1 border rounded-md bg-slate-50 dark:bg-slate-800">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={addHeading} className="h-8 w-8 p-0">
              <Heading className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading (## )</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={addBold} className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (**text**)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={addItalic} className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (*text*)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={addBulletList} className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List (- item)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={addLink} className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link ([text](url))</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{contentId ? "Edit Content" : "Blog Content Generator"}</h1>
      </div>

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

            <div className="flex gap-2">
              <Button onClick={handleGenerateContent} disabled={isGeneratingContent || !topic} className="flex-1">
                {isGeneratingContent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Blog Post"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearAllInputs}
                disabled={isGeneratingContent}
                className="whitespace-nowrap"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Panel */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your content using Markdown formatting"
                  : "Your generated blog post will appear here"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {wordCount > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800 text-sm px-3 py-1.5 rounded-md flex items-center h-9">
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
                    <RichTextEditor
                      initialContent={generatedContent}
                      onChange={(content) => {
                        // This will only be called when explicitly saving
                        setGeneratedContent(content)

                        // Update word count
                        const count = countWordsInHtml(content)
                        setWordCount(count)
                      }}
                      className="min-h-[500px]"
                      onWordCountChange={setWordCount}
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
                      className="min-h-[500px] border rounded-md p-6 bg-white dark:bg-slate-900 dark:text-slate-100 overflow-auto font-inter"
                      dangerouslySetInnerHTML={{ __html: generatedContent }}
                    />
                  </div>
                )}

                {generatedContent && !isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Library
                        </>
                      )}
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

