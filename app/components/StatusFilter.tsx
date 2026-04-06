'use client'

import { Filter } from 'lucide-react'
import type { TabKey } from '@/app/lib/types'

interface StatusFilterProps {
  value: string
  onChange: (v: string) => void
  activeTab: TabKey
}

const statusOptions: Record<TabKey, string[]> = {
  customers: ['All', 'Active', 'Inactive', 'Suspended'],
  contracts: ['All', 'Active', 'Expired', 'Cancelled'],
  invoices: ['All', 'Paid', 'Posted', 'Draft', 'Cancelled'],
  vendors: ['All', 'Active', 'Inactive'],
  revrec: ['All'],
}

export default function StatusFilter({ value, onChange, activeTab }: StatusFilterProps) {
  const options = statusOptions[activeTab]

  return (
    <div className="relative flex items-center gap-2">
      <Filter className="w-3.5 h-3.5 text-on-surface-variant/60" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-surface-container-high/50 text-sm text-on-surface rounded-lg
          pl-3 pr-8 py-2 outline-none cursor-pointer
          focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30
          transition-all"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All Statuses' : s}
          </option>
        ))}
      </select>
    </div>
  )
}
