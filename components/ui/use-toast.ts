"use client"

import type React from "react"

// Create a simple toast implementation
type ToastProps = {
  title?: string
  description?: string | React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

// Simple toast implementation
export const toast = ({ title, description, variant, duration = 5000 }: ToastProps) => {
  // Make sure all syntax is correct
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.style.position = "fixed"
    toastContainer.style.top = "1rem"
    toastContainer.style.right = "1rem"
    toastContainer.style.zIndex = "9999"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toastElement = document.createElement("div")
  toastElement.className = `toast ${variant === "destructive" ? "toast-destructive" : "toast-default"}`
  toastElement.style.backgroundColor = variant === "destructive" ? "#fee2e2" : "#f3f4f6"
  toastElement.style.color = variant === "destructive" ? "#b91c1c" : "#1f2937"
  toastElement.style.padding = "1rem"
  toastElement.style.borderRadius = "0.375rem"
  toastElement.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  toastElement.style.marginBottom = "0.75rem"
  toastElement.style.width = "20rem"
  toastElement.style.maxWidth = "100%"
  toastElement.style.transition = "all 0.3s ease"
  toastElement.style.opacity = "0"
  toastElement.style.transform = "translateY(-1rem)"

  // Add title if provided
  if (title) {
    const titleElement = document.createElement("div")
    titleElement.className = "toast-title"
    titleElement.style.fontWeight = "bold"
    titleElement.style.marginBottom = "0.25rem"
    titleElement.textContent = title
    toastElement.appendChild(titleElement)
  }

  // Add description if provided
  if (description) {
    const descElement = document.createElement("div")
    descElement.className = "toast-description"
    if (typeof description === "string") {
      descElement.textContent = description
    } else {
      // For React nodes, we'll just show a generic message
      descElement.textContent = "Notification"
    }
    toastElement.appendChild(descElement)
  }

  // Add to container
  toastContainer.appendChild(toastElement)

  // Animate in
  setTimeout(() => {
    toastElement.style.opacity = "1"
    toastElement.style.transform = "translateY(0)"
  }, 10)

  // Remove after duration
  setTimeout(() => {
    toastElement.style.opacity = "0"
    toastElement.style.transform = "translateY(-1rem)"

    // Remove from DOM after animation
    setTimeout(() => {
      if (toastContainer.contains(toastElement)) {
        toastContainer.removeChild(toastElement)
      }
    }, 300)
  }, duration)
}

// Hook for components
export const useToast = () => {
  return { toast }
}

