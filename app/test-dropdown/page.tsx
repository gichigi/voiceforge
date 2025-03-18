"use client"

import { ProfileDropdown } from "@/components/profile-dropdown"

export default function TestDropdownPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-2xl font-bold">Profile Dropdown Test</h1>
      <div className="flex items-center justify-center gap-4 p-4 border rounded-lg">
        <p>Click the profile icon:</p>
        <ProfileDropdown />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        This page is for testing the ProfileDropdown component in isolation.
      </p>
    </div>
  )
}

