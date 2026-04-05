'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'
import SourceBadge from './SourceBadge'
import StatusBadge from './StatusBadge'
import { formatDate, formatCurrency, truncate } from '@/app/lib/formatters'
import type { TabKey, SortState, Customer, Contract, Invoice, Vendor } from '@/app/lib/types'

interface DataTableProps {
  tab: TabKey
  data: (Customer | Contract | Invoice | Vendor)[]
  sort: SortState
  onSort: (column: string) => void
}

const columnDefs: Record<TabKey, { key: string; label: string; type?: string }[]> = {
  customers: [
    { key: 'Source', label: 'Source', type: 'source' },
    { key: 'Source ID', label: 'Source ID' },
    { key: 'Customer Name', label: 'Customer Name' },
    { key: 'Company Name', label: 'Company' },
    { key: 'Account Number', label: 'Account #' },
    { key: 'Email', label: 'Email', type: 'truncate' },
    { key: 'Status', label: 'Status', type: 'status' },
    { key: 'Currency', label: 'Currency' },
  ],
  contracts: [
    { key: 'Source', label: 'Source', type: 'source' },
    { key: 'Source ID', label: 'Source ID' },
    { key: 'Contract Name', label: 'Contract Name' },
    { key: 'Plan Name', label: 'Plan' },
    { key: 'Start Date', label: 'Start Date', type: 'date' },
    { key: 'End Date', label: 'End Date', type: 'date' },
    { key: 'Status', label: 'Status', type: 'status' },
    { key: 'Billing Period', label: 'Billing Period' },
  ],
  invoices: [
    { key: 'Source', label: 'Source', type: 'source' },
    { key: 'Invoice Number', label: 'Invoice #' },
    { key: 'Customer Source ID', label: 'Customer ID', type: 'truncate' },
    { key: 'Amount', label: 'Amount', type: 'currency' },
    { key: 'Balance', label: 'Balance', type: 'currency' },
    { key: 'Status', label: 'Status', type: 'status' },
    { key: 'Invoice Date', label: 'Invoice Date', type: 'date' },
    { key: 'Due Date', label: 'Due Date', type: 'date' },
    { key: 'Currency', label: 'Currency' },
  ],
  vendors: [
    { key: 'Source', label: 'Source', type: 'source' },
    { key: 'Vendor Name', label: 'Vendor Name' },
    { key: 'Vendor ID', label: 'Vendor ID' },
    { key: 'Email', label: 'Email', type: 'truncate' },
    { key: 'Phone', label: 'Phone' },
    { key: 'Address', label: 'Address', type: 'truncate' },
    { key: 'Payment Terms', label: 'Payment Terms' },
    { key: 'Status', label: 'Status', type: 'status' },
    { key: 'Currency', label: 'Currency' },
    { key: 'Contact', label: 'Contact', type: 'truncate' },
    { key: 'Subsidiary', label: 'Subsidiary', type: 'truncate' },
    { key: 'Outstanding Balance', label: 'Balance', type: 'balance' },
    { key: 'Created Date', label: 'Created', type: 'date' },
  ],
}

function renderCell(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any,
  col: { key: string; label: string; type?: string },
) {
  const val = row[col.key]

  switch (col.type) {
    case 'source':
      return <SourceBadge source={val} />
    case 'status':
      return <StatusBadge status={val} />
    case 'date':
      return <span>{formatDate(val)}</span>
    case 'currency':
      return (
        <span className="font-mono tabular-nums">
          {formatCurrency(Number(val), row.Currency || 'USD')}
        </span>
      )
    case 'balance':
      const amount = Number(val) || 0
      return (
        <span className={`font-mono tabular-nums ${amount > 0 ? 'text-red-600 font-semibold' : ''}`}>
          {formatCurrency(amount, row.Currency || 'USD')}
        </span>
      )
    case 'truncate':
      return <span title={val}>{truncate(val)}</span>
    default:
      return <span>{val ?? '—'}</span>
  }
}

export default function DataTable({ tab, data, sort, onSort }: DataTableProps) {
  const columns = columnDefs[tab]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sort.column === col.key
              return (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.05em]
                    text-on-surface-variant/70 cursor-pointer select-none
                    hover:text-on-surface-variant transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {isSorted && (
                      sort.direction === 'asc'
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="transition-colors hover:bg-surface-container-low/60"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3.5 text-on-surface whitespace-nowrap"
                >
                  {renderCell(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
