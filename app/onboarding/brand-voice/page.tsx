"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Download, RefreshCcw, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BrandVoiceGuide } from "./brand-voice-guide"
import { generateBrandVoice } from "@/app/actions/generate-brand-voice"
import { useToast } from "@/components/ui/use-toast"
import { LoadingMessages } from "@/components/loading-messages"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[]
  additionalInfo: string
}

export default function BrandVoice() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<BrandVoiceData | null>(null)
  const [brandVoiceData, setBrandVoiceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("brandVoiceData")
    const isGenerated = localStorage.getItem("brandVoiceGenerated")
    const generatedData = localStorage.getItem("generatedBrandVoice")

    if (!savedData || !isGenerated) {
      router.push("/onboarding")
      return
    }

    setFormData(JSON.parse(savedData))

    if (generatedData) {
      setBrandVoiceData(JSON.parse(generatedData))
      setLoading(false)
      // Add a slight delay before showing content for a nice transition
      setTimeout(() => {
        setShowContent(true)
      }, 300)
    } else {
      // If somehow we got here without generated data, we'll generate it now
      handleGenerateBrandVoice(JSON.parse(savedData))
    }
  }, [router])

  const handleGenerateBrandVoice = async (data: BrandVoiceData) => {
    setLoading(true)

    try {
      const result = await generateBrandVoice(data)

      if (result.success && result.data) {
        setBrandVoiceData(result.data)
        localStorage.setItem("generatedBrandVoice", JSON.stringify(result.data))
        // Add a slight delay before showing content for a nice transition
        setTimeout(() => {
          setShowContent(true)
        }, 300)
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate brand voice. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating brand voice:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!formData) return

    setRegenerating(true)
    await handleGenerateBrandVoice(formData)
    setRegenerating(false)
  }

  const handleRegeneratePillar = (index: number, newPillar: any) => {
    if (!brandVoiceData) return

    const updatedPillars = [...brandVoiceData.pillars]
    updatedPillars[index] = newPillar

    const updatedData = {
      ...brandVoiceData,
      pillars: updatedPillars,
    }

    setBrandVoiceData(updatedData)
    localStorage.setItem("generatedBrandVoice", JSON.stringify(updatedData))

    toast({
      title: "Pillar regenerated",
      description: `The "${newPillar.title}" pillar has been updated.`,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingMessages context="brandVoice" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>VoiceForge</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/onboarding/review")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Edit Answers
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 pb-24">
        {showContent ? (
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-indigo-900">{formData?.businessName} Brand Voice</h1>
              <Button onClick={handleRegenerate} variant="outline" disabled={regenerating}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
                Regenerate All
              </Button>
            </div>

            {/* Brand Voice Guide Component */}
            <BrandVoiceGuide
              businessName={formData?.businessName || ""}
              yearFounded={formData?.yearFounded || ""}
              businessDescription={formData?.businessDescription || ""}
              businessValues={formData?.businessValues || []}
              selectedDemographics={formData?.selectedDemographics}
              additionalInfo={formData?.additionalInfo}
              generatedData={brandVoiceData}
              onRegeneratePillar={handleRegeneratePillar}
            />

            {/* Alert moved to bottom */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Your brand voice can be edited at any time</AlertTitle>
              <AlertDescription>
                Access your brand voice settings from the dashboard to make changes whenever needed.
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <LoadingMessages context="brandVoice" />
          </div>
        )}
      </main>

      {/* Fixed navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container flex justify-between max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => router.push("/onboarding/review")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Edit Answers
          </Button>
          <Button
            onClick={() => {
              setLoading(true)
              router.push("/dashboard")
            }}
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner text="Preparing your dashboard..." />
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

