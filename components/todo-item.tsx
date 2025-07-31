"use client"

import { useState } from "react"
import { Edit2, Trash2, Check, X, Package, FileText } from "lucide-react"
import type { Todo } from "@/types/todo"

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: string) => Promise<void>
  onEdit?: (id: string, heading: string, description: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isCompleted?: boolean
}

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete, isCompleted = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editHeading, setEditHeading] = useState(todo.heading)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = async () => {
    if (!onEdit) return

    const trimmedHeading = editHeading.trim()
    const trimmedDescription = editDescription.trim()

    if (trimmedHeading.length === 0) {
      setError("Task heading cannot be empty")
      return
    }

    if (trimmedDescription.length === 0) {
      setError("Task description cannot be empty")
      return
    }

    if (trimmedHeading === todo.heading && trimmedDescription === todo.description) {
      setIsEditing(false)
      setError("")
      return
    }

    try {
      setIsLoading(true)
      await onEdit(todo.id, trimmedHeading, trimmedDescription)
      setIsEditing(false)
      setError("")
    } catch (err) {
      setError("Failed to update task")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditHeading(todo.heading)
    setEditDescription(todo.description)
    setIsEditing(false)
    setError("")
  }

  const handleToggle = async () => {
    try {
      setIsLoading(true)
      await onToggleComplete(todo.id)
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await onDelete(todo.id)
    } catch (err) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-5 transition-all duration-200 ${isCompleted ? "opacity-75" : ""}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            todo.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-400 hover:border-blue-400"
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Shipment/Task Heading
                </label>
                <input
                  type="text"
                  value={editHeading}
                  onChange={(e) => {
                    setEditHeading(e.target.value)
                    if (error) setError("")
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  disabled={isLoading}
                  aria-label="Edit task heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Task Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => {
                    setEditDescription(e.target.value)
                    if (error) setError("")
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  disabled={isLoading}
                  rows={3}
                  aria-label="Edit task description"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm" role="alert">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center gap-2"
                  aria-label="Save changes"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 flex items-center gap-2"
                  aria-label="Cancel editing"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Shipment</span>
                </div>
                <h3
                  className={`text-lg font-semibold text-white break-words ${todo.completed ? "line-through opacity-75" : ""}`}
                >
                  {todo.heading}
                </h3>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</span>
                </div>
                <p
                  className={`text-slate-300 break-words leading-relaxed ${todo.completed ? "line-through opacity-75" : ""}`}
                >
                  {todo.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && !isCompleted && (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                aria-label="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
