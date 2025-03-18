import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, BarChart3, Check, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>VoiceForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/onboarding">
              <Button>Get Started</Button>
            </Link>
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
                <Link href="/onboarding">
                  <Button size="lg" className="gap-1.5">
                    Start for Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline">
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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Brand Voice Framework",
                  description: "Get a unique 3-pillar framework that captures your brand's personality and values.",
                  icon: Sparkles,
                },
                {
                  title: "Multi-Channel Content",
                  description: "Generate content for blogs, social media, emails, and more with one click.",
                  icon: MessageSquare,
                },
                {
                  title: "Smart Analytics",
                  description: "Track content performance and get insights to improve engagement.",
                  icon: BarChart3,
                },
                {
                  title: "Content Library",
                  description: "Store and organize all your generated content in one place.",
                  icon: MessageSquare,
                },
                {
                  title: "Team Collaboration",
                  description: "Share brand guidelines and content with your team members.",
                  icon: MessageSquare,
                },
                {
                  title: "Export & Integrate",
                  description: "Export content in multiple formats or use our API for seamless integration.",
                  icon: MessageSquare,
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg border bg-background">
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
                Join thousands of businesses creating better content with VoiceForge
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "VoiceForge helped us maintain a consistent brand voice across all our marketing channels. It's like having an expert copywriter on demand.",
                  author: "Sarah Johnson",
                  role: "Marketing Director",
                  company: "TechStart Inc.",
                },
                {
                  quote:
                    "The brand voice framework is incredibly detailed and actionable. It's transformed how our team creates content.",
                  author: "Michael Chen",
                  role: "Content Manager",
                  company: "Growth Labs",
                },
                {
                  quote: "We've seen a 40% increase in engagement since using VoiceForge for our social media content.",
                  author: "Emma Rodriguez",
                  role: "Social Media Manager",
                  company: "Spark Digital",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-lg border bg-background">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
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
                  description: "Perfect for trying out VoiceForge",
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
            <span>VoiceForge</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 VoiceForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

