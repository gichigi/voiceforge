"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { DemographicsSelector } from "@/components/demographics-selector"
import { WebsiteAnalyzer } from "@/components/website-analyzer"
import { ProgressIndicator } from "@/components/progress-indicator"
import { BusinessValuesSelector } from "@/components/business-values-selector"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { isOnboardingCompleted } from "@/lib/data-service"

type OnboardingStep = {
  title: string
  description: string
  fields: {
    id: string
    label: string
    type: "input" | "textarea"
    placeholder: string
  }[]
  customComponent?: string
}

const steps: OnboardingStep[] = [
  {
    title: "Business Information",
    description: "Let's start with the basics about your business",
    fields: [
      {
        id: "businessName",
        label: "Business Name",
        type: "input",
        placeholder: "e.g., PixelPals Social",
      },
      {
        id: "yearFounded",
        label: "Year Founded",
        type: "input",
        placeholder: "e.g., 2022",
      },
    ],
  },
  {
    title: "Business Description",
    description: "Tell us what your business does",
    fields: [
      {
        id: "businessDescription",
        label: "What does your business do?",
        type: "textarea",
        placeholder:
          "e.g., PixelPals Social is a quirky platform where users create pixel avatars and interact in virtual spaces. We monetize through premium accessories while keeping the core experience free.",
      },
    ],
    customComponent: "website-analyzer",
  },
  {
    title: "Target Audience",
    description: "Who are you trying to reach?",
    fields: [],
    customComponent: "demographics-selector",
  },
  {
    title: "Business Values",
    description: "What principles guide your business?",
    fields: [],
    customComponent: "business-values-selector",
  },
  {
    title: "Additional Information",
    description: "Anything else we should know?",
    fields: [
      {
        id: "additionalInfo",
        label: "Additional Information",
        type: "textarea",
        placeholder:
          "Share any extra details that make your business unique:\n\n• Key product features\n• Competitive advantages\n• Upcoming initiatives\n• Brand personality traits",
      },
    ],
  },
]

const stepNames = ["Business Info", "Description", "Audience", "Values", "Additional"]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Onboarding() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({
    businessName: "",
    yearFounded: "",
    businessDescription: "",
    selectedDemographics: [],
    businessValues: [],
    additionalInfo: "",
  })
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Check if onboarding is already completed
  useEffect(() => {
    if (isOnboardingCompleted()) {
      // Redirect to dashboard if onboarding is already completed
      router.push("/dashboard")
    } else {
      setCheckingStatus(false)
    }
  }, [router])

  // Load saved data if available
  useEffect(() => {
    const savedData = localStorage.getItem("brandVoiceData")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleInputChange = (id: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleNext = () => {
    // Save data after each step
    localStorage.setItem("brandVoiceData", JSON.stringify(formData))

    // Check validation for Business Information step
    if (currentStep === 0) {
      if (!formData.businessName || !formData.yearFounded) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
    }

    // Check minimum character limit for business description
    if (currentStep === 1 && formData.businessDescription.length < 50) {
      toast({
        title: "Description too short",
        description: "Please provide at least 50 characters for your business description.",
        variant: "destructive",
      })
      return
    }

    // Check if demographics are selected
    if (
      currentStep === 2 &&
      (!formData.selectedDemographics || (formData.selectedDemographics as string[]).length === 0)
    ) {
      toast({
        title: "No demographics selected",
        description: "Please select at least one target demographic before proceeding.",
        variant: "destructive",
      })
      return
    }

    // Check if business values are selected
    if (currentStep === 3 && (!formData.businessValues || (formData.businessValues as string[]).length === 0)) {
      toast({
        title: "No values selected",
        description: "Please select at least one business value before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      router.push(`/onboarding?step=${currentStep + 1}`)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else {
      router.push("/onboarding/review")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Update URL to reflect the current step
      router.push(`/onboarding?step=${currentStep - 1}`)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else {
      router.push("/")
    }
  }

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step)
      router.push(`/onboarding?step=${step}`)
      window.scrollTo(0, 0)
    }
  }

  // Check if the Next button should be disabled
  const isNextButtonDisabled = () => {
    if (currentStep === 0) {
      return !formData.businessName || !formData.yearFounded
    }
    if (currentStep === 1) {
      return (formData.businessDescription as string).length < 50
    }
    if (currentStep === 2) {
      return !formData.selectedDemographics || (formData.selectedDemographics as string[]).length === 0
    }
    if (currentStep === 3) {
      return !formData.businessValues || (formData.businessValues as string[]).length === 0
    }
    return false
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  if (checkingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p>Checking onboarding status...</p>
        </div>
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
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress indicator now sits below header */}
      <div className="container mt-4">
        <ProgressIndicator steps={stepNames} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* Main content area with viewport-height centering */}
      <motion.main
        className="flex-1 flex items-center justify-center py-8 px-4 overflow-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="w-full max-w-2xl">
          <CardHeader className="h-[100px] flex flex-col justify-center border-b">
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <motion.div className="space-y-4" variants={itemVariants}>
              {currentStepData.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.type === "input" ? (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isNextButtonDisabled()) {
                          e.preventDefault()
                          handleNext()
                        }
                      }}
                    />
                  ) : (
                    <div className="space-y-1">
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={(formData[field.id] as string) || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="resize-none min-h-[200px]"
                      />
                      {field.id === "businessDescription" && (
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Minimum 50 characters</span>
                          <span
                            className={`${formData.businessDescription.length < 50 ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {formData.businessDescription.length}/50
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {currentStepData.customComponent === "website-analyzer" && (
                <WebsiteAnalyzer
                  description={formData.businessDescription as string}
                  onDescriptionChange={(value) => handleInputChange("businessDescription", value)}
                />
              )}

              {currentStepData.customComponent === "demographics-selector" && (
                <DemographicsSelector
                  value={(formData.selectedDemographics as string[]) || []}
                  onChange={(value) => handleInputChange("selectedDemographics", value)}
                />
              )}

              {currentStepData.customComponent === "business-values-selector" && (
                <BusinessValuesSelector
                  value={(formData.businessValues as string[]) || []}
                  onChange={(value) => handleInputChange("businessValues", value)}
                />
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.main>

      {/* Navigation buttons in a fixed position */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container flex justify-between max-w-2xl mx-auto">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isNextButtonDisabled()}>
            {isLastStep ? "Review" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

