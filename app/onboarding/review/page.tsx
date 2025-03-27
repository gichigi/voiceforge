"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Edit, Sparkles } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { generateBrandVoice } from "@/app/actions/generate-brand-voice"
import { useToast } from "@/components/ui/use-toast"
import { ProgressIndicator } from "@/components/progress-indicator"
import { LoadingSpinner } from "@/components/loading-spinner"
import { isOnboardingCompleted } from "@/lib/data-service"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[] | string
  additionalInfo: string
}

const stepNames = ["Business Info", "Description", "Audience", "Values", "Additional", "Review"]

const loadingMessages = [
  "Analyzing your business values...",
  "Crafting your unique voice pillars...",
  "Finding the perfect tone...",
  "Polishing your brand personality...",
]

export default function Review() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<BrandVoiceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    // Check if onboarding is already completed
    if (isOnboardingCompleted()) {
      // If they've already completed onboarding but somehow got here,
      // we'll still let them continue but we'll check if they have form data
      const savedData = localStorage.getItem("brandVoiceData")
      if (!savedData) {
        // If no form data, redirect to dashboard
        router.push("/dashboard")
        return
      }
    }

    setCheckingStatus(false)

    const savedData = localStorage.getItem("brandVoiceData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    } else {
      router.push("/onboarding")
    }
  }, [router])

  useEffect(() => {
    if (!loading) return

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [loading])

  const validateFormData = (data: BrandVoiceData): boolean => {
    return (
      !!data.businessName &&
      !!data.yearFounded &&
      !!data.businessDescription &&
      (Array.isArray(data.businessValues) ? data.businessValues.length > 0 : !!data.businessValues)
    )
  }

  const handleGenerate = async () => {
    if (!formData) return

    if (!validateFormData(formData)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before generating your brand voice.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationError(null)

    try {
      const result = await generateBrandVoice(formData)

      if (result.success && result.data) {
        // Store the generated brand voice data
        localStorage.setItem("brandVoiceGenerated", "true")
        localStorage.setItem("generatedBrandVoice", JSON.stringify(result.data))
        router.push("/onboarding/brand-voice")
      } else {
        setGenerationError(result.error || "Failed to generate brand voice. Please try again.")
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate brand voice. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating brand voice:", error)
      setGenerationError("An unexpected error occurred. Please try again.")
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/onboarding?step=4")
  }

  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p>Checking onboarding status...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Brand Voice Generator</span>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">Review Your Information</div>
        </div>
      </header>

      <div className="container mt-4 mb-2 sticky top-16 bg-background z-10">
        <ProgressIndicator steps={stepNames} currentStep={5} hideReviewStep={true} />
      </div>

      <main className="flex-1 container py-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Review Your Information</h1>
            <p className="text-muted-foreground">
              Please review the information you've provided. We'll use this to generate your brand voice.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="h-[100px] flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Basic details about your business</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding?step=0")}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Business Name</h3>
                  <p>{formData.businessName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Year Founded</h3>
                  <p>{formData.yearFounded}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="h-[100px] flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Business Description</CardTitle>
                  <CardDescription>What your business does</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding?step=1")}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{formData.businessDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="h-[100px] flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Target Demographics</CardTitle>
                  <CardDescription>Key demographics you're targeting</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding?step=2")}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {formData.selectedDemographics && formData.selectedDemographics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedDemographics.map((demographic, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {demographic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No demographics selected</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="h-[100px] flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Business Values</CardTitle>
                  <CardDescription>Principles that guide your business</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding?step=3")}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {Array.isArray(formData.businessValues) && formData.businessValues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.businessValues.map((value, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {value}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p>{formData.businessValues}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="h-[100px] flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Other details you've shared</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push("/onboarding?step=4")}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {formData.additionalInfo ? (
                  <p className="whitespace-pre-line">{formData.additionalInfo}</p>
                ) : (
                  <p className="text-muted-foreground">No additional information provided</p>
                )}
              </CardContent>
            </Card>
          </div>

          {generationError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-medium">Error generating brand voice</p>
              <p>{generationError}</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container flex justify-between max-w-3xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleGenerate} disabled={loading} className="min-w-[200px]">
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span className="animate-pulse">
                  {loading ? loadingMessages[loadingMessageIndex] : "Generate Brand Voice"}
                </span>
              </div>
            ) : (
              <>
                Generate Brand Voice
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

