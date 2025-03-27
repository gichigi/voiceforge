import type { Metadata } from "next"
import ContentGeneratorClientPage from "./ContentGeneratorClientPage"

export const metadata: Metadata = {
  title: "Content Generator",
  description: "Generate content using AI models.",
}

export default function ContentGeneratorPage() {
  return <ContentGeneratorClientPage />
}

