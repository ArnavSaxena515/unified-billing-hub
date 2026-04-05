'use client'

import { Users, FileText, Receipt, Store } from 'lucide-react'
import type { TabKey } from '@/app/lib/types'

interface DataTabsProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
  counts: Record<TabKey, number>
}

const tabs: { key: TabKey; label: string; icon: typeof Users }[] = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'contracts', label: 'Contracts', icon: FileText },
  { key: 'invoices', label: 'Invoices', icon: Receipt },
  { key: 'vendors', label: 'Vendors', icon: Store },
]

export default function DataTabs({ activeTab, onChange, counts }: DataTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-outline-variant/15 px-8">
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {counts[key] > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {counts[key]}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
