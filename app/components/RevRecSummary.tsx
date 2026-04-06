import type { RevRec } from '@/app/lib/types'
import { formatCurrency } from '@/app/lib/formatters'

interface RevRecSummaryProps {
  data: RevRec[]
}

export default function RevRecSummary({ data }: RevRecSummaryProps) {
  const totals = data.reduce(
    (acc, row) => {
      acc.tcv += Number(row['Total Value']) || 0
      acc.recognized += Number(row['Recognized To Date']) || 0
      acc.deferred += Number(row['Deferred Revenue']) || 0
      acc.pctSum += Number(row['Recognition Pct']) || 0
      return acc
    },
    { tcv: 0, recognized: 0, deferred: 0, pctSum: 0 }
  )

  const avgPct = data.length > 0 ? totals.pctSum / data.length : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-outline-variant/10 bg-surface-container-lowest">
      <div className="p-5 flex flex-col gap-1 border-r border-outline-variant/10 last:border-r-0">
        <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">Total Contract Value</span>
        <span className="text-xl font-bold font-mono tracking-tight text-primary">{formatCurrency(totals.tcv, 'USD')}</span>
      </div>
      <div className="p-5 flex flex-col gap-1 border-r border-outline-variant/10 last:border-r-0">
        <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">Recognized to Date</span>
        <span className="text-xl font-bold font-mono tracking-tight text-[#059669]">{formatCurrency(totals.recognized, 'USD')}</span>
      </div>
      <div className="p-5 flex flex-col gap-1 border-r border-outline-variant/10 last:border-r-0">
        <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">Deferred Revenue</span>
        <span className="text-xl font-bold font-mono tracking-tight text-[#D97706]">{formatCurrency(totals.deferred, 'USD')}</span>
      </div>
      <div className="p-5 flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">Avg Recognition</span>
        <span className="text-xl font-bold font-mono tracking-tight text-[#7C3AED]">{avgPct.toFixed(1)}%</span>
      </div>
    </div>
  )
}
