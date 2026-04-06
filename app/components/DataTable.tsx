'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'
import SourceBadge from './SourceBadge'
import StatusBadge from './StatusBadge'
import { formatDate, formatCurrency, truncate } from '@/app/lib/formatters'
import type { TabKey, SortState, Customer, Contract, Invoice, Vendor, RevRec } from '@/app/lib/types'

interface DataTableProps {
  tab: TabKey
  data: (Customer | Contract | Invoice | Vendor | RevRec)[]
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
  revrec: [
    { key: 'Source', label: 'Source', type: 'source' },
    { key: 'Customer', label: 'Customer', type: 'customer-bold' },
    { key: 'Performance Obligation', label: 'Performance Obligation', type: 'capitalize' },
    { key: 'Obligation Type', label: 'Type', type: 'obligation-type' },
    { key: 'Total Value', label: 'Total Value', type: 'currency-bold' },
    { key: 'Monthly Recognition', label: 'Monthly Rev', type: 'currency' },
    { key: 'Recognized To Date', label: 'Recognized', type: 'recognized' },
    { key: 'Deferred Revenue', label: 'Deferred', type: 'deferred' },
    { key: 'Recognition Pct', label: 'Progress', type: 'progress' },
    { key: 'Collectability', label: 'Collectability', type: 'collectability' },
    { key: 'Contract ID', label: 'Contract ID', type: 'mono-truncate' },
    { key: 'Term Months', label: 'Term', type: 'term' },
    { key: 'Term Start', label: 'Term Start', type: 'date' },
    { key: 'Term End', label: 'Term End', type: 'date' },
    { key: 'Invoice Number', label: 'Invoice #', type: 'mono' },
    { key: 'Invoice Status', label: 'Invoice Status', type: 'status' },
    { key: 'Amount Billed', label: 'Amount Billed', type: 'currency' },
    { key: 'Amount Paid', label: 'Amount Paid', type: 'amount-paid' },
    { key: 'Amount Outstanding', label: 'Amount Outstanding', type: 'amount-outstanding' },
    { key: 'Standalone Selling Price', label: 'SSP', type: 'currency' },
    { key: 'Allocation Pct', label: 'Allocation %', type: 'allocation' },
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
    case 'customer-bold':
      return <span className="font-semibold text-on-surface">{val}</span>
    case 'capitalize':
      return <span className="capitalize">{val}</span>
    case 'currency-bold':
      return (
        <span className="font-mono tabular-nums font-semibold">
          {formatCurrency(Number(val), row.Currency || 'USD')}
        </span>
      )
    case 'recognized':
      return (
        <span className="font-mono tabular-nums text-[#059669]">
          {formatCurrency(Number(val), row.Currency || 'USD')}
        </span>
      )
    case 'deferred':
      return (
        <span className="font-mono tabular-nums text-[#D97706]">
          {formatCurrency(Number(val), row.Currency || 'USD')}
        </span>
      )
    case 'progress':
      const pct = Number(val) || 0
      let fillClass = 'bg-[#E5E7EB]'
      if (pct > 0 && pct <= 33) fillClass = 'bg-[#EF4444]'
      else if (pct > 33 && pct <= 66) fillClass = 'bg-[#F59E0B]'
      else if (pct > 66 && pct < 100) fillClass = 'bg-[#7C3AED]'
      else if (pct >= 100) fillClass = 'bg-[#059669]'
      return (
        <div className="flex items-center gap-2">
          <div className="w-[80px] h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
            <div className={`h-full ${fillClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <span className="text-xs font-semibold">{pct}%</span>
        </div>
      )
    case 'collectability':
      const cStyles: Record<string, string> = {
        Confirmed: 'bg-[#ECFDF5] text-[#059669]',
        Probable: 'bg-[#EFF6FF] text-[#2563EB]',
        Partial: 'bg-[#FFF7ED] text-[#EA580C]',
        Pending: 'bg-[#FEF2F2] text-[#DC2626]',
      }
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${cStyles[String(val)] || 'bg-surface-container text-on-surface-variant'}`}>
          {val}
        </span>
      )
    case 'obligation-type':
      const obStyles: Record<string, string> = {
        Plan: 'bg-[#EFF6FF] text-[#2563EB]',
        Addon: 'bg-[#F3F4F6] text-[#6B7280]',
      }
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${obStyles[String(val)] || 'bg-surface-container text-on-surface-variant'}`}>
          {val}
        </span>
      )
    case 'mono-truncate':
      const truncated = String(val).length > 15 ? String(val).slice(0, 15) + '...' : val
      return <span className="font-mono text-xs" title={String(val)}>{truncated}</span>
    case 'term':
      return <span>{val} mo</span>
    case 'mono':
      return <span className="font-mono text-xs">{val}</span>
    case 'amount-paid':
      const paid = Number(val) || 0
      return (
        <span className={`font-mono tabular-nums ${paid > 0 ? 'text-[#059669]' : ''}`}>
          {formatCurrency(paid, row.Currency || 'USD')}
        </span>
      )
    case 'amount-outstanding':
      const out = Number(val) || 0
      return (
        <span className={`font-mono tabular-nums ${out > 0 ? 'text-[#DC2626]' : ''}`}>
          {formatCurrency(out, row.Currency || 'USD')}
        </span>
      )
    case 'allocation':
      return <span>{Number(val).toFixed(2)}%</span>
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
