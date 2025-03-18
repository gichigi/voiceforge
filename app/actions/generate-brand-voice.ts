"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

type BrandVoiceData = {
  businessName: string
  yearFounded: string
  businessDescription: string
  selectedDemographics?: string[]
  businessValues: string[]
  additionalInfo?: string
}

// Default brand voice to use as fallback
const DEFAULT_BRAND_VOICE = {
  executiveSummary:
    "A balanced brand voice that combines professionalism with approachability, designed to build trust while maintaining engagement.",
  pillars: [
    {
      id: "authentic",
      title: "Authentic",
      means: [
        "Speak honestly about capabilities and limitations",
        "Share real examples and case studies when possible",
        "Acknowledge challenges and how they're addressed",
      ],
      doesntMean: [
        "Overpromising or exaggerating benefits",
        "Using generic, meaningless claims",
        "Hiding important information",
      ],
      inspiration:
        "Patagonia – Known for transparent communication about their products, processes, and environmental impact. Their authenticity builds deep customer loyalty and trust.",
    },
    {
      id: "clear",
      title: "Clear",
      means: [
        "Use straightforward language without jargon",
        "Structure content with logical flow and hierarchy",
        "Provide specific examples to illustrate points",
      ],
      doesntMean: [
        "Oversimplifying complex topics",
        "Being vague or ambiguous",
        "Using unnecessarily technical language",
      ],
      inspiration:
        "Apple – Communicates complex technology in simple, clear terms that focus on benefits rather than specifications. Their clarity makes innovation accessible.",
    },
    {
      id: "helpful",
      title: "Helpful",
      means: [
        "Anticipate questions and provide answers proactively",
        "Focus on solving customer problems",
        "Include actionable next steps or recommendations",
      ],
      doesntMean: [
        "Being pushy or sales-focused",
        "Providing generic advice without context",
        "Overwhelming with too much information",
      ],
      inspiration:
        "Notion – Their content consistently focuses on helping users accomplish tasks and solve problems, with practical templates and guides that demonstrate helpfulness.",
    },
  ],
  sampleBlogPost: {
    title: "How to Make the Most of Our Platform",
    intro:
      "Getting started with a new tool can be both exciting and challenging. We've designed our platform with your needs in mind, focusing on simplicity without sacrificing powerful features.",
    sections: [
      {
        heading: "Understanding the Basics",
        content:
          "Our dashboard provides a central hub for all your activities. You'll find navigation intuitive, with the most common actions prominently displayed. We've carefully organized features based on user feedback to ensure you can find what you need quickly.",
        quote: "The best tools are those that feel like a natural extension of how you already work.",
      },
      {
        heading: "Advanced Features Worth Exploring",
        content:
          "Once you're comfortable with the basics, explore our automation capabilities. These features can save you hours each week by handling repetitive tasks. We've made complex processes simple through thoughtful design and clear user pathways.",
        callToAction:
          "Ready to take your experience to the next level? Check out our advanced tutorials in the Help Center.",
      },
    ],
  },
}

export async function generateBrandVoice(data: BrandVoiceData, existingData?: any) {
  try {
    // Format the data for the prompt
    const demographics = Array.isArray(data.selectedDemographics)
      ? data.selectedDemographics.join(", ")
      : "Not specified"

    const businessValues = Array.isArray(data.businessValues)
      ? data.businessValues.join(", ")
      : data.businessValues || "Not specified"

    // Create a detailed prompt for the OpenAI model
    const prompt = `
Generate a practical brand voice framework for ${data.businessName}, founded in ${data.yearFounded}.

Context:
Business Description: ${data.businessDescription}
Target Demographics: ${demographics}
Core Values: ${businessValues}
Additional Info: ${data.additionalInfo || "None provided"}

First, generate a concise executive summary (1-2 sentences) that captures the essence of ${data.businessName}'s brand voice.

Then, analyze the business context and create THREE clear, actionable brand voice pillars that align with ${data.businessName}'s industry, values, and audience. Each pillar should be immediately useful for content creation.

IMPORTANT GUIDELINES FOR PILLARS:
- Use clear, straightforward descriptors like: Bold, Playful, Sophisticated, Adventurous, Direct, Empowering, Quirky, Inspirational, Vibrant, Provocative, Witty, Passionate, Candid, Elegant, Minimalist, Energetic, Thoughtful, Confident, Approachable, Conversational, Authoritative, Warm, Precise, Clever, Sincere, Enthusiastic, Calm, Respectful, Optimistic, Pragmatic
- AVOID these generic, overused terms: Consistent, Innovative, Professional, Empathetic, Authentic, Friendly, Informative, Ethical, Sustainable, Engaging, Dynamic, Trustworthy, Customer-centric, Reliable, Effective, Insightful, Quality-driven, Strategic, Visionary
- Each pillar should be a single, clear adjective or short phrase that immediately conveys a distinct communication style
- Pillars should be distinctive enough to help the brand stand out, but practical enough to apply to everyday content

For each pillar:
1. Use a clear, actionable adjective or short phrase as the title
2. Provide 3 specific "What it means" guidelines that show exactly how to implement this pillar in content
3. List 3 "What it doesn't mean" pitfalls to avoid when applying this pillar
4. Give 1 relevant brand inspiration example with a detailed explanation of why they excel at this aspect and how it relates to ${data.businessName}'s context

Finally, create a sample blog post that demonstrates these pillars in action, specifically for ${data.businessName}'s industry and audience.

Format the response as a structured JSON object with this structure:
{
 "executiveSummary": "1-2 sentence summary",
 "pillars": [
   {
     "id": "pillar-id",
     "title": "Clear Pillar Title",
     "means": ["Specific guideline 1", "Specific guideline 2", "Specific guideline 3"],
     "doesntMean": ["Specific pitfall 1", "Specific pitfall 2", "Specific pitfall 3"],
     "inspiration": "Brand Example – With detailed explanation of how they excel at this aspect and how it relates to ${data.businessName}"
   }
 ],
 "sampleBlogPost": {
   "title": "Industry-relevant title",
   "intro": "Introduction paragraph using the brand voice",
   "sections": [
     {
       "heading": "Section heading",
       "content": "Section content demonstrating brand voice",
       "quote": "Optional relevant quote"
     }
   ]
 }
}

IMPORTANT: 
- Each pillar must be immediately useful and easy to apply to content creation
- Pillars should be distinctive but not abstract or contrived
- The executive summary should be brief and impactful
- Return ONLY the JSON object without any markdown formatting or additional text`

    try {
      // Generate the brand voice using OpenAI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 2000,
      })

      // Extract JSON from the response by removing any markdown formatting
      const extractedJson = extractJsonFromText(text)

      if (extractedJson === null) {
        console.error("Invalid response from OpenAI:", text)
        console.log("Falling back to default brand voice")
        return { success: true, data: DEFAULT_BRAND_VOICE }
      }

      // Parse the response as JSON
      try {
        const brandVoice = JSON.parse(extractedJson)
        return { success: true, data: brandVoice }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        console.error("Raw response:", text)
        console.error("Extracted JSON:", extractedJson)
        console.log("Falling back to default brand voice")
        return { success: true, data: DEFAULT_BRAND_VOICE }
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError)
      console.log("Falling back to default brand voice")
      return { success: true, data: DEFAULT_BRAND_VOICE }
    }
  } catch (error) {
    console.error("Error generating brand voice:", error)
    return {
      success: true,
      data: DEFAULT_BRAND_VOICE,
      warning: "Used fallback brand voice due to an error. You can regenerate later.",
    }
  }
}

// New function to regenerate a single pillar
export async function regeneratePillar(data: BrandVoiceData, pillarIndex: number, existingPillars: any[]) {
  try {
    // Format the data for the prompt
    const demographics = Array.isArray(data.selectedDemographics)
      ? data.selectedDemographics.join(", ")
      : "Not specified"

    const businessValues = Array.isArray(data.businessValues)
      ? data.businessValues.join(", ")
      : data.businessValues || "Not specified"

    // Create context from existing pillars
    const otherPillars = existingPillars
      .filter((_, index) => index !== pillarIndex)
      .map((p) => p.title)
      .join(", ")

    // Create a detailed prompt for the OpenAI model
    const prompt = `
Generate a new brand voice pillar for ${data.businessName}, founded in ${data.yearFounded}.

Context:
Business Description: ${data.businessDescription}
Target Demographics: ${demographics}
Core Values: ${businessValues}
Additional Info: ${data.additionalInfo || "None provided"}
Existing Pillars: ${otherPillars}

IMPORTANT GUIDELINES FOR THE NEW PILLAR:
- Use clear, straightforward descriptors like: Bold, Playful, Sophisticated, Adventurous, Direct, Empowering, Quirky, Inspirational, Vibrant, Provocative, Witty, Passionate, Candid, Elegant, Minimalist, Energetic, Thoughtful, Confident, Approachable, Conversational, Authoritative, Warm, Precise, Clever, Sincere, Enthusiastic, Calm, Respectful, Optimistic, Pragmatic
- AVOID these generic, overused terms: Consistent, Innovative, Professional, Empathetic, Authentic, Friendly, Informative, Ethical, Sustainable, Engaging, Dynamic, Trustworthy, Customer-centric, Reliable, Effective, Insightful, Quality-driven, Strategic, Visionary
- The pillar should be a single, clear adjective or short phrase that immediately conveys a distinct communication style
- The pillar should be distinctive from the existing pillars: ${otherPillars}
- The pillar should be practical enough to apply to everyday content
- The new pillar MUST be different from the one being replaced: ${existingPillars[pillarIndex].title}

For the pillar:
1. Use a clear, actionable adjective or short phrase as the title
2. Provide 3 specific "What it means" guidelines that show exactly how to implement this pillar in content
3. List 3 "What it doesn't mean" pitfalls to avoid when applying this pillar
4. Give 1 relevant brand inspiration example with a detailed explanation of why they excel at this aspect and how it relates to ${data.businessName}'s context

Format the response as a structured JSON object with this structure:
{
 "id": "pillar-id",
 "title": "Clear Pillar Title",
 "means": ["Specific guideline 1", "Specific guideline 2", "Specific guideline 3"],
 "doesntMean": ["Specific pitfall 1", "Specific pitfall 2", "Specific pitfall 3"],
 "inspiration": "Brand Example – With detailed explanation of how they excel at this aspect and how it relates to ${data.businessName}"
}

IMPORTANT: 
- The pillar must be immediately useful and easy to apply to content creation
- The pillar should be distinctive but not abstract or contrived
- Return ONLY the JSON object without any markdown formatting or additional text`

    try {
      // Generate the brand voice using OpenAI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 1000,
      })

      // Extract JSON from the response by removing any markdown formatting
      const extractedJson = extractJsonFromText(text)

      // Parse the response as JSON
      try {
        const newPillar = JSON.parse(extractedJson)
        return { success: true, data: newPillar }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        console.error("Raw response:", text)
        console.error("Extracted JSON:", extractedJson)

        // Fallback to a default pillar
        return {
          success: true,
          data: {
            id: "fallback-pillar",
            title: "Distinctive",
            means: [
              "Stand out with a unique perspective on industry topics",
              "Use memorable language and phrasing that's recognizably yours",
              "Develop signature content formats that audiences associate with your brand",
            ],
            doesntMean: [
              "Being different just for the sake of it",
              "Using gimmicks or clickbait tactics",
              "Abandoning clarity for uniqueness",
            ],
            inspiration:
              "Spotify – Their year-end Wrapped campaign is instantly recognizable and creates a personal connection with users through distinctive data visualization and tone.",
          },
          warning: "Used fallback pillar due to an error. You can regenerate again.",
        }
      }
    } catch (apiError) {
      console.error("OpenAI API error:", apiError)

      // Fallback to a default pillar
      return {
        success: true,
        data: {
          id: "fallback-pillar",
          title: "Distinctive",
          means: [
            "Stand out with a unique perspective on industry topics",
            "Use memorable language and phrasing that's recognizably yours",
            "Develop signature content formats that audiences associate with your brand",
          ],
          doesntMean: [
            "Being different just for the sake of it",
            "Using gimmicks or clickbait tactics",
            "Abandoning clarity for uniqueness",
          ],
          inspiration:
            "Spotify – Their year-end Wrapped campaign is instantly recognizable and creates a personal connection with users through distinctive data visualization and tone.",
        },
        warning: "Used fallback pillar due to an API error. You can regenerate again.",
      }
    }
  } catch (error) {
    console.error("Error regenerating pillar:", error)

    // Fallback to a default pillar
    return {
      success: true,
      data: {
        id: "fallback-pillar",
        title: "Distinctive",
        means: [
          "Stand out with a unique perspective on industry topics",
          "Use memorable language and phrasing that's recognizably yours",
          "Develop signature content formats that audiences associate with your brand",
        ],
        doesntMean: [
          "Being different just for the sake of it",
          "Using gimmicks or clickbait tactics",
          "Abandoning clarity for uniqueness",
        ],
        inspiration:
          "Spotify – Their year-end Wrapped campaign is instantly recognizable and creates a personal connection with users through distinctive data visualization and tone.",
      },
      warning: "Used fallback pillar due to an error. You can regenerate again.",
    }
  }
}

// Helper function to extract JSON from text that might contain markdown formatting
function extractJsonFromText(text: string): string {
  // Remove markdown code blocks if present
  const cleanedText = text.trim()

  // Check if the text starts with \`\`\` and ends with \`\`\`
  const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)```$/
  const match = cleanedText.match(codeBlockRegex)

  if (match && match[1]) {
    // Return the content inside the code block
    return match[1].trim()
  }

  // If no code block is found, check if the text is already valid JSON
  try {
    JSON.parse(cleanedText)
    return cleanedText
  } catch (e) {
    // If it's not valid JSON, return null
    return null
  }
}

