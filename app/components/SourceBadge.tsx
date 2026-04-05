'use client'

interface SourceBadgeProps {
  source: string
}

const badgeStyles: Record<string, string> = {
  Zuora: 'bg-primary/10 text-primary',
  Chargebee: 'bg-secondary/10 text-secondary',
  NetSuite: 'bg-tertiary/10 text-tertiary',
}

export default function SourceBadge({ source }: SourceBadgeProps) {
  const style = badgeStyles[source] || 'bg-surface-container text-on-surface-variant'

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-[0.03em] ${style}`}>
      {source}
    </span>
  )
}
