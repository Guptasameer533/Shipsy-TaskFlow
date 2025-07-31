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
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedHeading = heading.trim()
    const trimmedDescription = description.trim()

    if (trimmedHeading.length === 0) {
      setError("Please enter a task heading")
      return
    }

    if (trimmedDescription.length === 0) {
      setError("Please enter a task description")
      return
    }

    try {
      setIsSubmitting(true)
      setError("")
      await onAddTodo(trimmedHeading, trimmedDescription)
      setHeading("")
      setDescription("")
    } catch (err) {
      setError("Failed to add task. Please try again.")
    } finally {
      setIsSubmitting(false)
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
            onChange={(e) => {
              setHeading(e.target.value)
              if (error) setError("")
            }}
            placeholder="e.g., Deliver to Mumbai Port, Process customs clearance..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            disabled={isSubmitting}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (error) setError("")
            }}
            placeholder="Detailed description of the shipment or task requirements..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
            disabled={isSubmitting}
            rows={3}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>
      </div>

      {error && (
        <p id="error-message" className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !heading.trim() || !description.trim()}
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
