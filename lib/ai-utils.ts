import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Default content templates for fallbacks
const DEFAULT_CONTENT_TEMPLATES = {
  "blog-post": `# [TOPIC]

## Introduction
Welcome to our blog post about [TOPIC]. In this article, we'll explore key aspects and provide valuable insights.

## Main Points
### First Key Point
This is where we would discuss the first important aspect of [TOPIC].

### Second Key Point
Here we would explore another critical dimension of [TOPIC].

### Third Key Point
Finally, we would cover this essential element of [TOPIC].

## Conclusion
Thank you for reading our thoughts on [TOPIC]. We hope you found this information helpful.
`,

  "social-media-post": `Excited to share our thoughts on [TOPIC]! 

Key takeaway: [TOPIC] is transforming how we think about our industry.

What's your experience with [TOPIC]? Share in the comments below!

#[TOPIC] #Insights #Industry
`,

  "email-newsletter": `Subject: Important Updates on [TOPIC]

Hello,

We hope this email finds you well. We wanted to share some important insights about [TOPIC] that we believe will be valuable to you.

[TOPIC] has been evolving rapidly, and here are three things you should know:
1. First key point about [TOPIC]
2. Second important aspect to consider
3. How this might impact you

We're always here to help if you have questions about [TOPIC].

Best regards,
The Team
`,

  "landing-page": `# Transform Your Experience with [TOPIC]

## The Solution You've Been Looking For

[TOPIC] provides the tools and insights you need to succeed in today's competitive environment.

### Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Why Choose Us

Our approach to [TOPIC] is unique because we focus on results.

## Get Started Today

Contact us to learn more about how [TOPIC] can work for you.
`,
}

// Word count to token mapping (approximate)
const WORD_TO_TOKEN_RATIO = 1.3 // Roughly 1.3 tokens per word on average

// Length settings with word counts
const LENGTH_SETTINGS = {
  short: { minWords: 300, maxWords: 400, targetWords: 350 },
  medium: { minWords: 400, maxWords: 500, targetWords: 450 },
  long: { minWords: 500, maxWords: 600, targetWords: 550 },
}

export async function generateAIContent(
  prompt: string,
  maxTokens = 2000,
  contentType = "blog-post",
  topic = "this topic",
  length = "medium",
) {
  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key is not set. Using fallback content.")
    return {
      success: true,
      data: generateFallbackContent(contentType, topic),
      warning: "Generated using fallback template. For better results, please set up your OpenAI API key.",
    }
  }

  try {
    // Get the length settings
    const lengthSetting = LENGTH_SETTINGS[length] || LENGTH_SETTINGS.medium

    // Calculate approximate token count needed
    const targetTokens = Math.round(lengthSetting.targetWords * WORD_TO_TOKEN_RATIO)

    // Add explicit length instructions to the prompt
    const enhancedPrompt = `${prompt}

IMPORTANT LENGTH REQUIREMENTS:
- This content should be ${lengthSetting.minWords}-${lengthSetting.maxWords} words in length
- Target word count: ${lengthSetting.targetWords} words
- Please count your words carefully to ensure the content meets these requirements
- The content should be substantial enough to cover the topic thoroughly within these word count constraints
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: enhancedPrompt,
      maxTokens: Math.max(targetTokens * 1.5, maxTokens), // Allow some buffer for the AI
      temperature: 0.5,
      apiKey: OPENAI_API_KEY,
    })

    return { success: true, data: text }
  } catch (error) {
    console.error("Error generating AI content:", error)

    // Use fallback content generation
    return {
      success: true,
      data: generateFallbackContent(contentType, topic),
      warning: "Generated using fallback template due to an API error. Please try again later.",
    }
  }
}

// Function to generate fallback content based on templates
function generateFallbackContent(contentType: string, topic: string): string {
  // Get the appropriate template or default to blog post
  const template = DEFAULT_CONTENT_TEMPLATES[contentType] || DEFAULT_CONTENT_TEMPLATES["blog-post"]

  // Replace [TOPIC] placeholders with the actual topic
  return template.replace(/\[TOPIC\]/g, topic)
}

