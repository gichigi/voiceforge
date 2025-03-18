# VoiceForge

VoiceForge is an AI-powered tool that helps businesses create a consistent brand voice and generate compelling content across multiple channels.

![VoiceForge](https://placehold.co/600x400?text=VoiceForge)

## Features

- **Brand Voice Generation**: Answer questions about your business to generate a unique 3-pillar brand voice framework.
- **Multi-Channel Content**: Create blog posts, social media content, emails, and more with your brand voice.
- **Content Management**: Store and organize all your generated content in one place.
- **User Authentication**: Secure login and user account management.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex (serverless database and backend)
- **Authentication**: Clerk
- **AI**: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PNPM
- OpenAI API key
- Clerk account for authentication
- Convex account for database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gichigi/voiceforge.git
   cd voiceforge
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration values

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Main application routes and pages
- `/components`: Reusable React components
- `/convex`: Convex database schema and functions
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and helpers
- `/prisma`: Prisma database schema (if used)
- `/public`: Static assets
- `/styles`: Global CSS and styling utilities

## Usage

1. Sign up for an account or log in
2. Complete the onboarding process to define your brand voice
3. Navigate to the dashboard to generate content
4. Save and export your content as needed

## Environment Variables

Create a `.env.local` file with the following variables:

```
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Clerk](https://clerk.dev/) for authentication
- [Convex](https://www.convex.dev/) for the backend
- [OpenAI](https://openai.com/) for AI capabilities 