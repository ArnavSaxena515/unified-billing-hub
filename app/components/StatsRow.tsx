'use client'

import { Users, FileText, Receipt, Store, TrendingUp } from 'lucide-react'

interface StatsRowProps {
  customers: number
  contracts: number
  invoices: number
  vendors: number
  revrec: number
}

const stats = [
  { key: 'customers', label: 'Customers', icon: Users, color: 'text-primary' },
  { key: 'contracts', label: 'Contracts', icon: FileText, color: 'text-secondary' },
  { key: 'invoices', label: 'Invoices', icon: Receipt, color: 'text-tertiary' },
  { key: 'vendors', label: 'Vendors', icon: Store, color: 'text-primary-dark' },
  { key: 'revrec', label: 'Rev Rec Schedules', icon: TrendingUp, color: 'text-[#7C3AED]' },
] as const

export default function StatsRow({ customers, contracts, invoices, vendors, revrec }: StatsRowProps) {
  const counts = { customers, contracts, invoices, vendors, revrec }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-8 -mt-6 relative z-10">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-surface-container-lowest rounded-xl p-5 transition-colors hover:bg-surface-container-low"
          style={{ boxShadow: '0 8px 40px -10px rgba(234, 221, 255, 0.12)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant">
              {label}
            </span>
            <Icon className={`w-4 h-4 ${color} opacity-70`} />
          </div>
          <p className="text-2xl font-semibold text-on-surface tracking-tight">
            {counts[key].toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
