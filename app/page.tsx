'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import StatsRow from './components/StatsRow'
import DataTabs from './components/DataTabs'
import SourceFilter from './components/SourceFilter'
import SearchBar from './components/SearchBar'
import StatusFilter from './components/StatusFilter'
import ActionButtons from './components/ActionButtons'
import DataTable from './components/DataTable'
import EmptyState from './components/EmptyState'
import LoadingState from './components/LoadingState'
import ResetModal from './components/ResetModal'
import Footer from './components/Footer'
import RevRecSummary from './components/RevRecSummary'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type {
  Customer,
  Contract,
  Invoice,
  Vendor,
  TabKey,
  SourceFilter as SourceFilterType,
  SortState,
  BillingData,
  RevRec,
} from './lib/types'

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [revrec, setRevrec] = useState<RevRec[]>([])
  const [loading, setLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete' | 'timeout'>('idle')
  const [activeTab, setActiveTab] = useState<TabKey>('customers')
  const [sourceFilter, setSourceFilter] = useState<SourceFilterType>('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)
  const [sort, setSort] = useState<SortState>({ column: null, direction: null })

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset status filter when tab changes
  useEffect(() => {
    setStatusFilter('All')
    setSort({ column: null, direction: null })
  }, [activeTab])

  // Automatically switch to Vendors tab if source filter is NetSuite
  useEffect(() => {
    if (sourceFilter === 'NetSuite') {
      setActiveTab('vendors')
    }
  }, [sourceFilter])

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/data')
    const json = await res.json()
    setCustomers(json.customers || [])
    setContracts(json.contracts || [])
    setInvoices(json.invoices || [])
    setVendors(json.vendors || [])
    setRevrec(json.revrec || [])
    return json
  }, [])

  // Behavior 1: Load existing data on mount (no polling)
  useEffect(() => {
    fetchData().catch(err => console.error('Failed to load existing data on mount:', err))
  }, [fetchData])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      await fetchData()
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchData])

  const handleSyncStart = useCallback(() => {
    setIsSyncing(true)
    setSyncStatus('syncing')
  }, [])

  // Behavior 2: Start polling after sync
  const startPolling = useCallback(() => {
    let previousCount = 0
    let stablePolls = 0

    const interval = setInterval(async () => {
      try {
        const json = await fetchData()

        const totalCount =
          (json.counts?.customers || 0) +
          (json.counts?.contracts || 0) +
          (json.counts?.invoices || 0) +
          (json.counts?.vendors || 0) +
          (json.counts?.revrec || 0)

        if (totalCount === previousCount && totalCount > 0) {
          stablePolls++
          if (stablePolls >= 2) {
            clearInterval(interval)
            setIsSyncing(false)
            setSyncStatus('complete')
            setTimeout(() => setSyncStatus('idle'), 3000)
          }
        } else {
          stablePolls = 0
        }
        previousCount = totalCount
      } catch (err) {
        console.error('Error during polling:', err)
      }
    }, 3000)

    // Safety timeout — stop after 90 seconds
    setTimeout(() => {
      clearInterval(interval)
      setIsSyncing((prev) => {
        if (prev) {
          setSyncStatus('timeout')
          return false
        }
        return prev
      })
    }, 90000)
  }, [fetchData])

  const handleReset = useCallback(async () => {
    try {
      await fetch('/api/reset', { method: 'POST' })
      setCustomers([])
      setContracts([])
      setInvoices([])
      setVendors([])
      setRevrec([])
      setShowResetModal(false)
    } catch (err) {
      console.error('Failed to reset:', err)
    }
  }, [])

  const handleSort = useCallback(
    (column: string) => {
      setSort((prev) => {
        if (prev.column !== column) return { column, direction: 'asc' as const }
        if (prev.direction === 'asc') return { column, direction: 'desc' as const }
        return { column: null, direction: null }
      })
    },
    [],
  )

  // Get current tab data
  const rawData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<TabKey, any[]> = {
      customers,
      contracts,
      invoices,
      vendors,
      revrec,
    }
    return map[activeTab]
  }, [activeTab, customers, contracts, invoices, vendors, revrec])

  // Apply all 3 filters (AND logic)
  const filteredData = useMemo(() => {
    let data = rawData

    // Source filter applies to ALL tabs
    if (sourceFilter !== 'All') {
      data = data.filter((r) => (r as { Source: string }).Source === sourceFilter)
    }

    // Status filter
    if (statusFilter !== 'All') {
      data = data.filter(
        (r) =>
          (r as { Status: string }).Status?.toLowerCase() ===
          statusFilter.toLowerCase(),
      )
    }

    // Search — case-insensitive partial match across all visible text values
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      data = data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(q),
        ),
      )
    }

    return data
  }, [rawData, sourceFilter, statusFilter, debouncedSearch])

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sort.column || !sort.direction) return filteredData

    const col = sort.column
    const dir = sort.direction === 'asc' ? 1 : -1

    return [...filteredData].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[col]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[col]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir
      }

      return String(aVal).localeCompare(String(bVal)) * dir
    })
  }, [filteredData, sort])

  const counts = useMemo(
    () => ({
      customers: customers.length,
      contracts: contracts.length,
      invoices: invoices.length,
      vendors: vendors.length,
      revrec: revrec.length,
    }),
    [customers, contracts, invoices, vendors, revrec],
  )

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />

      <StatsRow
        customers={counts.customers}
        contracts={counts.contracts}
        invoices={counts.invoices}
        vendors={counts.vendors}
        revrec={counts.revrec}
      />

      {/* Title area */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-on-surface tracking-tight">
              Unified Billing Hub
            </h2>
            <p className="text-sm text-on-surface-variant/70 mt-0.5">
              Manage and sync billing data across multiple cloud ERP sources.
            </p>
          </div>
          <ActionButtons
            onSyncStart={handleSyncStart}
            onStartPolling={startPolling}
            onRefresh={loadData}
            onReset={() => setShowResetModal(true)}
            isSyncing={isSyncing}
          />
        </div>

        {/* Sync Status Banner */}
        {syncStatus !== 'idle' && (
          <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-sm border ${
            syncStatus === 'syncing' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
            syncStatus === 'complete' ? 'bg-green-50 border-green-100 text-green-700' :
            'bg-yellow-50 border-yellow-100 text-yellow-700'
          }`}>
            {syncStatus === 'syncing' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="font-medium animate-pulse">Syncing... waiting for data</span>
                <span className="text-indigo-500/80 mx-2">|</span>
                <span>{counts.customers} customers · {counts.contracts} contracts · {counts.invoices} invoices · {counts.vendors} vendors · {counts.revrec} obligations</span>
              </>
            )}
            {syncStatus === 'complete' && (
              <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium">Sync complete — {counts.customers + counts.contracts + counts.invoices + counts.vendors + counts.revrec} total records</span>
              </div>
            )}
            {syncStatus === 'timeout' && (
              <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Sync may still be running. Click refresh to check.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <DataTabs activeTab={activeTab} onChange={setActiveTab} counts={counts} />

      {/* Filter bar */}
      <div className="px-8 py-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <SourceFilter value={sourceFilter} onChange={setSourceFilter} />
        <div className="flex items-center gap-3 flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            activeTab={activeTab}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-8">
        <div
          className="bg-surface-container-lowest rounded-xl overflow-hidden"
          style={{ boxShadow: '0 8px 40px -10px rgba(234, 221, 255, 0.10)' }}
        >
          {loading ? (
            <LoadingState />
          ) : sortedData.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <>
              {activeTab === 'revrec' && <RevRecSummary data={sortedData as RevRec[]} />}
              <DataTable
                tab={activeTab}
                data={sortedData}
                sort={sort}
                onSort={handleSort}
              />
              <div className="px-4 py-3 text-xs text-on-surface-variant/50 border-t border-outline-variant/10">
                Showing {sortedData.length} of {rawData.length} records
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      <ResetModal
        open={showResetModal}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}
