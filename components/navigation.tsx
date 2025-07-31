"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle, Circle } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="mb-8" role="navigation" aria-label="Main navigation">
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          <div className="flex space-x-1">
            <Link
              href="/"
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-200 ${
                pathname === "/" ? "bg-blue-400 text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
              }`}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              <Circle className="w-4 h-4 mr-2" />
              Active Shipments
            </Link>
            <Link
              href="/completed"
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-200 ${
                pathname === "/completed" ? "bg-blue-400 text-slate-900 shadow-lg" : "text-white hover:bg-white/10"
              }`}
              aria-current={pathname === "/completed" ? "page" : undefined}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed Shipments
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
