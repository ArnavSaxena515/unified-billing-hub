'use client'

import { Download, RotateCcw, Loader2 } from 'lucide-react'

interface ActionButtonsProps {
  onLoad: () => void
  onReset: () => void
  loading: boolean
}

export default function ActionButtons({ onLoad, onReset, loading }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onLoad}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary
          bg-gradient-to-br from-primary-dark to-primary
          hover:opacity-90 active:scale-[0.98] disabled:opacity-50
          shadow-[0_4px_20px_-4px_rgba(124,58,237,0.4)]
          transition-all"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {loading ? 'Loading…' : 'Load Data'}
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
          text-on-surface-variant bg-transparent
          hover:bg-surface-container-high active:scale-[0.98]
          border border-outline-variant/20
          transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  )
}
