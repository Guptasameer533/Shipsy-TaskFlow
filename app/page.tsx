"use client"

import { useState, useEffect } from "react"
import { TodoForm } from "@/components/todo-form"
import { TodoItem } from "@/components/todo-item"
import { Navigation } from "@/components/navigation"
import { getTodos, addTodo, updateTodo, deleteTodo } from "@/lib/todo-storage"
import type { Todo } from "@/types/todo"

export default function ActiveTodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const allTodos = await getTodos()
      setTodos(allTodos.filter((todo) => !todo.completed))
      setError(null)
    } catch (err) {
      setError("Failed to load shipments. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (heading: string, description: string) => {
    try {
      const newTodo = await addTodo(heading, description)
      setTodos((prev) => [newTodo, ...prev])
      setError(null)
    } catch (err) {
      setError("Failed to add task. Please try again.")
    }
  }

  const handleToggleComplete = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id)
      if (todo) {
        await updateTodo(id, { completed: true })
        setTodos((prev) => prev.filter((t) => t.id !== id))
      }
      setError(null)
    } catch (err) {
      setError("Failed to update task. Please try again.")
    }
  }

  const handleEditTodo = async (id: string, heading: string, description: string) => {
    try {
      await updateTodo(id, { heading, description })
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, heading, description } : t)))
      setError(null)
    } catch (err) {
      setError("Failed to update task. Please try again.")
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      setError("Failed to delete task. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Shipsy <span className="text-yellow-400">TaskFlow</span>
          </h1>
          <p className="text-slate-300 text-lg">Streamline your logistics workflow</p>
        </header>

        <Navigation />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
            <button
              onClick={loadTodos}
              className="mt-2 mx-auto block px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <TodoForm onAddTodo={handleAddTodo} />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
              Active Shipments ({todos.length})
            </h2>

            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-slate-400 text-lg">No active shipments! Add one above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className="animate-in slide-in-from-top duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TodoItem
                      todo={todo}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTodo}
                      onDelete={handleDeleteTodo}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
