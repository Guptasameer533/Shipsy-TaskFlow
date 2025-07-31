import type { Todo } from "@/types/todo"

const STORAGE_KEY = "todo-master-todos"

// Simulate network delay for realistic UX
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTodos(): Promise<Todo[]> {
  await delay(100)

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const todos = JSON.parse(stored)
    return todos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to load todos:", error)
    return []
  }
}

export async function addTodo(heading: string, description: string): Promise<Todo> {
  await delay(200)

  const trimmedHeading = heading.trim()
  const trimmedDescription = description.trim()

  if (trimmedHeading.length === 0) {
    throw new Error("Todo heading cannot be empty")
  }

  if (trimmedDescription.length === 0) {
    throw new Error("Todo description cannot be empty")
  }

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    heading: trimmedHeading,
    description: trimmedDescription,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const existingTodos = await getTodos()
  const todos = [...existingTodos, newTodo]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

  return newTodo
}

export async function updateTodo(
  id: string,
  updates: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>,
): Promise<Todo> {
  await delay(150)

  const todos = await getTodos()
  const todoIndex = todos.findIndex((todo) => todo.id === id)

  if (todoIndex === -1) {
    throw new Error("Todo not found")
  }

  // Basic validation for heading
  if (updates.heading !== undefined) {
    const trimmedHeading = updates.heading.trim()
    if (trimmedHeading.length === 0) {
      throw new Error("Todo heading cannot be empty")
    }
    updates.heading = trimmedHeading
  }

  // Basic validation for description
  if (updates.description !== undefined) {
    const trimmedDescription = updates.description.trim()
    if (trimmedDescription.length === 0) {
      throw new Error("Todo description cannot be empty")
    }
    updates.description = trimmedDescription
  }

  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date(),
  }

  todos[todoIndex] = updatedTodo
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

  return updatedTodo
}

export async function deleteTodo(id: string): Promise<void> {
  await delay(100)

  const todos = await getTodos()
  const filteredTodos = todos.filter((todo) => todo.id !== id)

  // Don't throw error if todo doesn't exist - just silently succeed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTodos))
}
