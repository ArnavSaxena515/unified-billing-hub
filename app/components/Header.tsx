'use client'

import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary-container" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(210,187,255,0.15),transparent_60%)]" />

      <div className="relative px-8 py-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Rillet</h1>
            <p className="text-[11px] font-medium text-white/60 uppercase tracking-[0.08em]">
              Billing Intelligence
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <span className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 backdrop-blur-sm">
            Dashboard
          </span>
          <span className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 transition-colors cursor-default">
            Analytics
          </span>
          <span className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 transition-colors cursor-default">
            Settings
          </span>
        </nav>
      </div>
    </header>
  )
}
