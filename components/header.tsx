import { UserButton } from "@clerk/nextjs"
import { SubscriptionStatus } from "@/components/subscription-status"

export function Header() {
  return (
    <header className="bg-background border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">VoiceForge</h1>
        <div className="flex items-center space-x-4">
          <SubscriptionStatus />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

