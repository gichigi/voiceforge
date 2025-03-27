"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bold, Italic, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  initialValue: string
  onChange: (value: string) => void
  onSave?: () => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  initialValue,
  onChange,
  onSave,
  placeholder = "Start typing...",
  className = "",
}: RichTextEditorProps) {
  // Track if content has been modified
  const [isDirty, setIsDirty] = useState(false)

  // Refs to store DOM element and initial value
  const editorRef = useRef<HTMLDivElement>(null)
  const initialValueRef = useRef(initialValue)

  // Initialize editor with initial value
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue
      initialValueRef.current = initialValue
    }
  }, [initialValue])

  // Save changes only when explicitly requested
  const handleSave = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      initialValueRef.current = editorRef.current.innerHTML
      setIsDirty(false)
      if (onSave) onSave()
    }
  }

  // Cancel changes by reverting to initial value
  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValueRef.current
      setIsDirty(false)
    }
  }

  // Apply formatting without losing focus
  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-3">
          <div
            ref={editorRef}
            contentEditable
            onInput={() => setIsDirty(true)}
            className="min-h-[200px] outline-none"
            placeholder={placeholder}
          />
        </CardContent>
      </Card>

      {isDirty && (
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel} size="sm" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm">
            Save changes
          </Button>
        </div>
      )}
    </div>
  )
}

