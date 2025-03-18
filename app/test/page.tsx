"use client"

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { user } = useUser()
  const createUser = useMutation(api.users.createUser)

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p>Logged in as: {user?.fullName || user?.emailAddresses[0].emailAddress}</p>
                <p>Clerk User ID: {user?.id}</p>
              </div>
              <SignOutButton>
                <Button>Sign Out</Button>
              </SignOutButton>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Not logged in</p>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

