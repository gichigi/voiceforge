"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { testOpenAI } from "@/app/actions/test-openai"

export default function OpenAITestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: any
    error?: string
  } | null>(null)

  const runTest = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const testResult = await testOpenAI()
      setResult(testResult)
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>OpenAI API Test</CardTitle>
          <CardDescription>Test if the OpenAI API is properly configured and working</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Testing OpenAI API connection...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {result.success ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success!</AlertTitle>
                  <AlertDescription className="text-green-700">{result.message}</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {result.message}
                    {result.error && (
                      <div className="mt-2 p-2 bg-destructive/10 rounded text-sm font-mono overflow-auto">
                        {result.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {result.data && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">API Response:</h3>
                  <pre className="bg-slate-100 p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Click the button below to test the OpenAI API connection
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runTest} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Run OpenAI API Test"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

