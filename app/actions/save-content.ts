"use server"

import { saveContent as saveContentToDb } from "@/convex/content"

export async function saveContent(contentData: {
  contentType: string
  topic: string
  content: string
  outline?: string
}) {
  try {
    const result = await saveContentToDb(contentData)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error saving content:", error)
    return {
      success: false,
      error: "An error occurred while saving the content. Please try again.",
    }
  }
}

