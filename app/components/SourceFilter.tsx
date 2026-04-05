'use client'

import type { SourceFilter as SourceFilterType } from '@/app/lib/types'

interface SourceFilterProps {
  value: SourceFilterType
  onChange: (v: SourceFilterType) => void
}

const sources: SourceFilterType[] = ['All', 'Zuora', 'Chargebee', 'NetSuite']

const sourceColors: Record<string, string> = {
  Zuora: 'bg-primary/10 text-primary border-primary/20',
  Chargebee: 'bg-secondary/10 text-secondary border-secondary/20',
  NetSuite: 'bg-tertiary/10 text-tertiary border-tertiary/20',
}

export default function SourceFilter({ value, onChange }: SourceFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant mr-1">
        Source
      </span>
      {sources.map((src) => {
        const isActive = value === src
        const base = src === 'All'
          ? isActive
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          : isActive
            ? sourceColors[src]
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'

        return (
          <button
            key={src}
            onClick={() => onChange(src)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${base} ${
              isActive ? 'ring-1 ring-current/20' : ''
            }`}
          >
            {src}
          </button>
        )
      })}
    </div>
  )
}
