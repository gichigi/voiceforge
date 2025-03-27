"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, Check, Star, BookOpen, Wand2, FileType, Repeat } from "lucide-react"
import { useEffect, useState } from "react"
import { isOnboardingCompleted } from "@/lib/data-service"

export default function Home() {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if onboarding is completed
    const completed = isOnboardingCompleted()
    setOnboardingComplete(completed)
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Brand Voice Generator</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Button disabled>Loading...</Button>
            ) : onboardingComplete ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/onboarding">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Create Content They Can't Ignore
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Generate consistent, compelling content that resonates with your audience and reflects your brand
                  values.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row">
                {onboardingComplete ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button size="lg" className="gap-1.5">
                      Start for Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Three simple steps to define and leverage your brand voice
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Answer Questions</h3>
                <p className="text-center text-muted-foreground">
                  Tell us about your business, values, and target audience through our guided questionnaire.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Get Your Voice</h3>
                <p className="text-center text-muted-foreground">
                  We'll generate a unique brand voice framework with clear, actionable guidelines.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Create Content</h3>
                <p className="text-center text-muted-foreground">
                  Generate on-brand content for any channel with our AI-powered tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Powerful Features</h2>
              <p className="text-muted-foreground md:text-lg">
                Everything you need to create consistent, compelling content
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
              {[
                {
                  title: "Brand Voice Framework",
                  description: "Get a unique 3-pillar framework that captures your brand's personality and values.",
                  icon: Sparkles,
                },
                {
                  title: "Generate Blog Posts",
                  description: "Create compelling, on-brand content with AI assistance in minutes.",
                  icon: MessageSquare,
                },
                {
                  title: "Content Library",
                  description: "Store and organize all your generated content in one place for easy access.",
                  icon: BookOpen,
                },
                {
                  title: "Content Repurposing",
                  description: "Transform your content into different formats like social posts, emails, and more.",
                  icon: Repeat,
                  comingSoon: true,
                },
                {
                  title: "Content Fine-Tuning",
                  description: "Refine and perfect your content with advanced editing and enhancement tools.",
                  icon: Wand2,
                  comingSoon: true,
                },
                {
                  title: "Multiple Content Types",
                  description: "Generate various content formats from blog posts to social media and email campaigns.",
                  icon: FileType,
                  comingSoon: true,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-background relative"
                >
                  {feature.comingSoon && (
                    <div className="absolute -top-3 right-3 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full border border-amber-200 font-medium">
                      Coming Soon
                    </div>
                  )}
                  <div className="rounded-full p-3 bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
              <p className="text-muted-foreground md:text-lg">
                Join thousands of businesses creating better content with Brand Voice Generator
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Brand Voice Generator helped us maintain a consistent brand voice across all our marketing channels. It's like having an expert copywriter on demand.",
                  author: "Sarah Johnson",
                  role: "Marketing Director",
                  company: "TechStart Inc.",
                  image: "/images/sarah-johnson.jpeg",
                },
                {
                  quote:
                    "The brand voice framework is incredibly detailed and actionable. It's transformed how our team creates content.",
                  author: "Michael Chen",
                  role: "Content Manager",
                  company: "Growth Labs",
                  image: "/images/michael-chen.jpeg",
                },
                {
                  quote:
                    "We've seen a 40% increase in engagement since using Brand Voice Generator for our social media content.",
                  author: "Emma Rodriguez",
                  role: "Social Media Manager",
                  company: "Spark Digital",
                  image: "/images/emma-rodriguez.png",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border bg-background">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground md:text-lg">Choose the plan that's right for your business</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "Free",
                  description: "Perfect for trying out Brand Voice Generator",
                  features: [
                    "Basic brand voice framework",
                    "10 content generations/month",
                    "Blog post generation",
                    "Social media content",
                    "Basic analytics",
                  ],
                },
                {
                  name: "Pro",
                  price: "$29",
                  description: "Best for growing businesses",
                  features: [
                    "Advanced brand voice framework",
                    "100 content generations/month",
                    "All content types",
                    "Content library",
                    "Team collaboration",
                    "Advanced analytics",
                    "Priority support",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For large organizations",
                  features: [
                    "Custom brand voice framework",
                    "Unlimited content generations",
                    "Custom content types",
                    "Advanced team management",
                    "API access",
                    "Custom integrations",
                    "Dedicated support",
                  ],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`flex flex-col p-6 rounded-lg border bg-background relative ${
                    plan.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  <ul className="flex-1 space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={plan.popular ? "bg-primary hover:bg-primary/90" : ""}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Brand Voice Generator</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Brand Voice Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

