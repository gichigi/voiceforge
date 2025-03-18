"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Star, X, Minus, Quote, RefreshCw } from "lucide-react"
import { regeneratePillar } from "@/app/actions/generate-brand-voice"
import { LoadingMessages } from "@/components/loading-messages"

interface BrandVoiceGuideProps {
  businessName: string
  yearFounded: string
  businessDescription: string
  businessValues: string[]
  selectedDemographics?: string[]
  additionalInfo?: string
  generatedData?: any
  onRegeneratePillar: (index: number, newPillar: any) => void
}

export function BrandVoiceGuide({
  businessName,
  yearFounded,
  businessDescription,
  businessValues,
  selectedDemographics,
  additionalInfo,
  generatedData,
  onRegeneratePillar,
}: BrandVoiceGuideProps) {
  const [regeneratingPillar, setRegeneratingPillar] = useState<number | null>(null)

  // Use the generated data if available, otherwise use default data
  const executiveSummary =
    generatedData?.executiveSummary ||
    `${businessName}'s brand voice combines clarity and personality to connect with its audience.`

  // Define color schemes for different pillar types
  const pillarColors = [
    { color: "bg-blue-100 text-blue-700 border-blue-200", bgColor: "bg-blue-50" },
    { color: "bg-green-100 text-green-700 border-green-200", bgColor: "bg-green-50" },
    { color: "bg-purple-100 text-purple-700 border-purple-200", bgColor: "bg-purple-50" },
    { color: "bg-amber-100 text-amber-700 border-amber-200", bgColor: "bg-amber-50" },
    { color: "bg-rose-100 text-rose-700 border-rose-200", bgColor: "bg-rose-50" },
    { color: "bg-teal-100 text-teal-700 border-teal-200", bgColor: "bg-teal-50" },
  ]

  // Use the generated pillars if available, otherwise use default pillars
  const brandVoicePillars = generatedData?.pillars || [
    {
      id: "bold",
      title: "Bold",
      color: pillarColors[0].color,
      bgColor: pillarColors[0].bgColor,
      means: [
        "Make confident statements without hedging or unnecessary qualifiers",
        "Use strong, impactful verbs that convey action and decisiveness",
        "Take clear stances on industry topics that align with your values",
      ],
      doesntMean: [
        "Being aggressive or confrontational in your messaging",
        "Making exaggerated claims that you can't substantiate",
        "Dismissing alternative viewpoints or customer concerns",
      ],
      inspiration:
        "Nike – Their 'Just Do It' mentality permeates all communication with confident, direct statements that inspire action. This approach would help your business establish authority in your space while motivating your audience to engage with your solutions.",
    },
    {
      id: "playful",
      title: "Playful",
      color: pillarColors[1].color,
      bgColor: pillarColors[1].bgColor,
      means: [
        "Incorporate light humor and wordplay that resonates with your audience",
        "Use conversational language that feels like a friend talking",
        "Include unexpected elements that surprise and delight readers",
      ],
      doesntMean: [
        "Using humor that might be perceived as unprofessional or inappropriate",
        "Sacrificing clarity for the sake of being clever",
        "Forcing humor into serious topics where it doesn't belong",
      ],
      inspiration:
        "Mailchimp – Balances playful copy with useful information, using a conversational tone and occasional humor that makes technical content approachable. This would help your business build rapport with your audience while making complex information more digestible and engaging.",
    },
    {
      id: "direct",
      title: "Direct",
      color: pillarColors[2].color,
      bgColor: pillarColors[2].bgColor,
      means: [
        "Get to the point quickly without unnecessary preamble",
        "Use simple, clear language that avoids jargon and buzzwords",
        "Structure content with the most important information first",
      ],
      doesntMean: [
        "Being blunt or lacking empathy in your communication",
        "Oversimplifying complex topics to the point of inaccuracy",
        "Avoiding necessary context or details that add value",
      ],
      inspiration:
        "Stripe – Uses clear, direct language to explain complex financial products without unnecessary jargon. This approach would benefit your business by building trust through transparency and respecting your audience's time and intelligence.",
    },
  ]

  // Use the generated sample blog post if available, otherwise use a default
  const sampleBlogPost = generatedData?.sampleBlogPost || {
    title: `The Future of ${businessName}: Innovation Meets Purpose`,
    intro: `In today's rapidly evolving marketplace, businesses face unprecedented challenges. At ${businessName}, we understand these challenges firsthand. Since our founding in ${yearFounded}, we've been ${businessDescription.toLowerCase()}.`,
    sections: [
      {
        heading: "Our Approach",
        content: `We believe that ${businessValues[0]} shouldn't come at the expense of ${businessValues[1]}. That's why we've developed solutions that balance both, creating value that extends beyond immediate results.`,
        quote:
          'Our clients often tell us they struggled with [common industry challenge] before finding us. "We tried everything," they say. And we get it—we\'ve been there too.',
      },
      {
        heading: "What Sets Us Apart",
        content: `Unlike traditional approaches that focus solely on [conventional method], we take a more holistic view. By integrating ${businessValues[2]} into every aspect of our process, we deliver results that are not just effective, but sustainable.`,
        callToAction: "Ready to transform how you approach [key benefit area]? Let's start this journey together.",
      },
    ],
  }

  // Add color information to the pillars if using generated data
  const coloredPillars = (generatedData?.pillars || brandVoicePillars).map((pillar, index) => {
    return {
      ...pillar,
      color: pillar.color || pillarColors[index % pillarColors.length].color,
      bgColor: pillar.bgColor || pillarColors[index % pillarColors.length].bgColor,
    }
  })

  const handleRegeneratePillar = async (index: number) => {
    if (!generatedData) return

    setRegeneratingPillar(index)

    const formData = {
      businessName,
      yearFounded,
      businessDescription,
      businessValues,
      selectedDemographics,
      additionalInfo,
    }

    try {
      const result = await regeneratePillar(formData, index, coloredPillars)

      if (result.success && result.data) {
        onRegeneratePillar(index, result.data)
      }
    } catch (error) {
      console.error("Error regenerating pillar:", error)
    } finally {
      setRegeneratingPillar(null)
    }
  }

  const highlightKeywords = (text: string) => {
    const keywords = [
      "confident",
      "direct",
      "inspire",
      "action",
      "playful",
      "conversational",
      "humor",
      "approachable",
      "clear",
      "simple",
      "transparent",
      "trust",
    ]

    return text.split(" ").map((word, index) => {
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, "")
      if (keywords.includes(lowerWord)) {
        return <strong key={index}>{word} </strong>
      }
      return word + " "
    })
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg">{executiveSummary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Brand Voice Pillars */}
      <Tabs defaultValue="pillars" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pillars">Brand Voice Pillars</TabsTrigger>
          <TabsTrigger value="sample">Sample Blog Post</TabsTrigger>
        </TabsList>

        <TabsContent value="pillars" className="space-y-6">
          {coloredPillars.map((pillar, index) => (
            <Card key={index} className="border shadow-sm overflow-hidden">
              <CardHeader className={`${pillar.color.split(" ")[0]} bg-opacity-30 border-b`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">{pillar.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRegeneratePillar(index)}
                    disabled={regeneratingPillar !== null}
                  >
                    {regeneratingPillar === index ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={`p-6 ${pillar.bgColor} bg-opacity-30`}>
                {regeneratingPillar === index ? (
                  <div className="py-8">
                    <LoadingMessages context="pillar" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-primary" />
                            What It Means
                          </h3>
                          <ul className="space-y-2">
                            {pillar.means.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <X className="h-5 w-5 text-destructive" />
                          What It Doesn't Mean
                        </h3>
                        <ul className="space-y-2">
                          {pillar.doesntMean.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Minus className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        Iconic Inspiration
                      </h3>
                      <div className="bg-white bg-opacity-50 p-4 rounded-md border border-slate-200">
                        <p className="text-sm">
                          <strong>{pillar.inspiration.split(" – ")[0]}</strong> –{" "}
                          {highlightKeywords(pillar.inspiration.split(" – ")[1])}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sample">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sample Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-slate-200">
                  <h1 className="text-3xl font-bold text-slate-900 mb-6">{sampleBlogPost.title}</h1>

                  <p className="text-lg leading-relaxed mb-8">{sampleBlogPost.intro}</p>

                  {sampleBlogPost.sections.map((section, i) => (
                    <div key={i} className="mb-8">
                      <h2 className="text-2xl font-semibold text-slate-800 mb-4">{section.heading}</h2>
                      <p className="mb-4">{section.content}</p>

                      {section.quote && (
                        <div className="border-l-4 border-primary pl-4 py-2 my-6 bg-slate-50 rounded-r-md">
                          <div className="flex items-start gap-2">
                            <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <p className="italic text-slate-700">{section.quote}</p>
                          </div>
                        </div>
                      )}

                      {section.callToAction && (
                        <p className="text-lg font-medium text-primary mt-6">{section.callToAction}</p>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-center mt-8">
                    <div className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 cursor-pointer">
                      Read More
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

