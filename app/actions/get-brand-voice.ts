"use server"

// TODO: Replace this mock implementation with actual Convex query
// import { getBrandVoice as getBrandVoiceFromDb } from "@/convex/brandVoice"

// Mock brand voice data
const mockBrandVoice = {
  executiveSummary: "Our brand voice is confident, innovative, and user-friendly.",
  pillars: [
    {
      id: "1",
      title: "Confidence",
      means: ["Assertive", "Knowledgeable", "Authoritative"],
      doesntMean: ["Arrogant", "Boastful", "Dismissive"],
      inspiration: "We speak with the assurance of an industry leader.",
    },
    {
      id: "2",
      title: "Innovation",
      means: ["Forward-thinking", "Creative", "Cutting-edge"],
      doesntMean: ["Reckless", "Untested", "Gimmicky"],
      inspiration: "We showcase our commitment to pushing boundaries and creating new solutions.",
    },
    {
      id: "3",
      title: "User-friendly",
      means: ["Approachable", "Clear", "Helpful"],
      doesntMean: ["Oversimplified", "Patronizing", "Vague"],
      inspiration: "We make complex concepts accessible and easy to understand for all users.",
    },
  ],
}

// Fallback brand voice data if everything else fails
const fallbackBrandVoice = {
  executiveSummary: "A balanced brand voice that combines professionalism with approachability.",
  pillars: [
    {
      id: "fallback-1",
      title: "Clear",
      means: ["Use simple language", "Avoid jargon", "Be concise"],
      doesntMean: ["Oversimplified", "Vague", "Incomplete"],
      inspiration: "We communicate complex ideas in accessible ways.",
    },
    {
      id: "fallback-2",
      title: "Helpful",
      means: ["Focus on solutions", "Anticipate needs", "Provide value"],
      doesntMean: ["Pushy", "Patronizing", "Overpromising"],
      inspiration: "We prioritize being useful over being promotional.",
    },
    {
      id: "fallback-3",
      title: "Authentic",
      means: ["Be honest", "Show personality", "Stay consistent"],
      doesntMean: ["Unprofessional", "Oversharing", "Inconsistent"],
      inspiration: "We build trust through genuine communication.",
    },
  ],
}

export async function getBrandVoice() {
  try {
    // First try to get from localStorage (client-side)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("generatedBrandVoice")
      if (savedData) {
        return { success: true, data: JSON.parse(savedData) }
      }
    }

    // TODO: Replace this mock implementation with actual Convex query
    // try {
    //   const brandVoice = await getBrandVoiceFromDb()
    //   return { success: true, data: brandVoice }
    // } catch (dbError) {
    //   console.error("Database error:", dbError)
    //   // Fall back to mock data
    //   return { success: true, data: mockBrandVoice, warning: "Using mock data due to database error" }
    // }

    // For now, return mock data
    return { success: true, data: mockBrandVoice }
  } catch (error) {
    console.error("Error fetching brand voice:", error)

    // Ultimate fallback
    return {
      success: true,
      data: fallbackBrandVoice,
      warning: "Using fallback brand voice due to an error. Please try regenerating your brand voice.",
    }
  }
}

