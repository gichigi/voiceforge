"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

// Common business values
const BUSINESS_VALUES = [
  "Innovation",
  "Quality",
  "Customer Focus",
  "Integrity",
  "Collaboration",
  "Accessibility",
  "Sustainability",
  "Diversity",
  "Transparency",
  "Excellence",
  "Creativity",
  "Trust",
]

interface BusinessValuesSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}

export function BusinessValuesSelector({ value = [], onChange, maxSelections = 10 }: BusinessValuesSelectorProps) {
  const [customValue, setCustomValue] = useState("")

  const handleAddValue = (businessValue: string) => {
    if (value.includes(businessValue) || value.length >= maxSelections) return
    onChange([...value, businessValue])
  }

  const handleRemoveValue = (businessValue: string) => {
    onChange(value.filter((v) => v !== businessValue))
  }

  const handleAddCustomValue = () => {
    if (!customValue.trim() || value.includes(customValue) || value.length >= maxSelections) return
    onChange([...value, customValue])
    setCustomValue("")
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">
          Selected Values ({value.length}/{maxSelections})
        </Label>
        <div className="mt-2 flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md bg-background">
          {value.length === 0 ? (
            <div className="text-sm text-muted-foreground">No values selected</div>
          ) : (
            value.map((businessValue, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {businessValue}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(businessValue)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Common Business Values</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {BUSINESS_VALUES.map((value) => (
            <Badge
              key={value}
              variant={value.includes(value) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
              onClick={() => handleAddValue(value)}
            >
              {value}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-value">Add Custom Value</Label>
        <div className="flex gap-2">
          <Input
            id="custom-value"
            placeholder="E.g., Playfulness"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddCustomValue}
            disabled={!customValue.trim() || value.length >= maxSelections}
          >
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Add any specific values not listed above</p>
      </div>
    </div>
  )
}

