"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Package } from "lucide-react"

interface TodoFormProps {
  onAddTodo: (heading: string, description: string) => Promise<void>
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [heading, setHeading] = useState("")
  const [description, setDescription] = useState("")
  const [headingError, setHeadingError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateFields = () => {
    let isValid = true
    const trimmedHeading = heading.trim()
    const trimmedDescription = description.trim()

    // Reset errors
    setHeadingError("")
    setDescriptionError("")

    // Validate heading
    if (trimmedHeading.length === 0) {
      setHeadingError("Please enter a task heading")
      isValid = false
    }

    // Validate description
    if (trimmedDescription.length === 0) {
      setDescriptionError("Please enter a task description")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateFields()) {
      return
    }

    const trimmedHeading = heading.trim()
    const trimmedDescription = description.trim()

    try {
      setIsSubmitting(true)
      await onAddTodo(trimmedHeading, trimmedDescription)
      setHeading("")
      setDescription("")
      setHeadingError("")
      setDescriptionError("")
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeading(e.target.value)
    if (headingError && e.target.value.trim().length > 0) {
      setHeadingError("")
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    if (descriptionError && e.target.value.trim().length > 0) {
      setDescriptionError("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label htmlFor="heading" className="block text-sm font-medium text-slate-300 mb-2">
            <Package className="w-4 h-4 inline mr-2" />
            Shipment/Task Heading
          </label>
          <input
            id="heading"
            type="text"
            value={heading}
            onChange={handleHeadingChange}
            placeholder="e.g., Deliver to Mumbai Port, Process customs clearance..."
            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
              headingError ? "border-red-400 focus:ring-red-400" : "border-white/20"
            }`}
            disabled={isSubmitting}
            aria-describedby={headingError ? "heading-error" : undefined}
          />
          {headingError && (
            <p id="heading-error" className="text-red-400 text-sm mt-1 flex items-center" role="alert">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
              {headingError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Detailed description of the shipment or task requirements..."
            className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none ${
              descriptionError ? "border-red-400 focus:ring-red-400" : "border-white/20"
            }`}
            disabled={isSubmitting}
            rows={3}
            aria-describedby={descriptionError ? "description-error" : undefined}
          />
          {descriptionError && (
            <p id="description-error" className="text-red-400 text-sm mt-1 flex items-center" role="alert">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
              {descriptionError}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Add new shipment task"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Add Shipment Task
      </button>
    </form>
  )
}
