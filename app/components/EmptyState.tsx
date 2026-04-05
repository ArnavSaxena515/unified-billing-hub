'use client'

import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  tab: string
}

export default function EmptyState({ tab }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mb-5">
        <Inbox className="w-7 h-7 text-on-surface-variant/40" />
      </div>
      <h3 className="text-base font-semibold text-on-surface mb-1.5">
        No {tab} data yet
      </h3>
      <p className="text-sm text-on-surface-variant/70 text-center max-w-xs">
        Send data via webhook or click <strong>Load Data</strong> to fetch records from Redis.
      </p>
    </div>
  )
}
