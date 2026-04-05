'use client'

interface StatusBadgeProps {
  status: string
}

const badgeStyles: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-600',
  Paid: 'bg-emerald-500/10 text-emerald-600',
  Posted: 'bg-primary/10 text-primary',
  Draft: 'bg-amber-500/10 text-amber-600',
  Cancelled: 'bg-red-500/10 text-red-600',
  Expired: 'bg-red-500/10 text-red-600',
  Inactive: 'bg-surface-container-high text-on-surface-variant',
  Suspended: 'bg-amber-500/10 text-amber-600',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()
  const style = badgeStyles[normalized] || 'bg-surface-container text-on-surface-variant'

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${style}`}>
      {normalized || '—'}
    </span>
  )
}
