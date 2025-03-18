"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"
import { ContentTypeSelector } from "@/components/content-type-selector"
import { ContentDetailsForm } from "@/components/content-details-form"
import { ContentGeneration } from "@/components/content-generation"
import { ContentRefinement } from "@/components/content-refinement"
import { ContentFinalization } from "@/components/content-finalization"
import { getBrandVoice } from "@/app/actions/get-brand-voice"
import { toast } from "@/components/ui/use-toast"

const steps = ["Select Type", "Enter Details", "Generate", "Refine", "Finalize"]

export default function ContentGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [contentData, setContentData] = useState({
    contentType: "",
    contentLength: "",
    topic: "",
    generateOutline: true,
    outline: "",
    generatedContent: "",
  })
  const [brandVoice, setBrandVoice] = useState(null)

  useEffect(() => {
    const loadBrandVoice = async () => {
      const result = await getBrandVoice()
      if (result.success) {
        setBrandVoice(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load brand voice data. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadBrandVoice()
  }, [])

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const updateContentData = (newData) => {
    setContentData((prevData) => ({ ...prevData, ...newData }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Content</h1>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <Card className="mt-8">
        <CardContent className="p-6">
          {currentStep === 0 && (
            <ContentTypeSelector
              onSelect={(type, length) => {
                updateContentData({ contentType: type, contentLength: length })
                handleNextStep()
              }}
            />
          )}
          {currentStep === 1 && (
            <ContentDetailsForm contentData={contentData} onUpdate={updateContentData} onNext={handleNextStep} />
          )}
          {currentStep === 2 && (
            <ContentGeneration
              contentData={contentData}
              brandVoice={brandVoice}
              onUpdate={updateContentData}
              onNext={handleNextStep}
            />
          )}
          {currentStep === 3 && (
            <ContentRefinement
              contentData={contentData}
              brandVoice={brandVoice}
              onUpdate={updateContentData}
              onNext={handleNextStep}
            />
          )}
          {currentStep === 4 && <ContentFinalization contentData={contentData} onUpdate={updateContentData} />}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && <Button onClick={handlePreviousStep}>Previous</Button>}
            {currentStep < steps.length - 1 && (
              <Button onClick={handleNextStep} className="ml-auto">
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

