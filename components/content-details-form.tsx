"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ContentDetailsForm({ contentData, onUpdate, onNext }) {
  const [topic, setTopic] = useState(contentData.topic)
  const [generateOutline, setGenerateOutline] = useState(contentData.generateOutline)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate({ topic, generateOutline })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your content topic"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="generate-outline" checked={generateOutline} onCheckedChange={setGenerateOutline} />
        <Label htmlFor="generate-outline">Generate outline</Label>
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}

