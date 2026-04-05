'use client'

import { useState } from 'react'
import { Download, RotateCcw, Loader2, RefreshCw } from 'lucide-react'

interface ActionButtonsProps {
  onLoad: () => void
  onReset: () => void
  loading: boolean
}

export default function ActionButtons({ onLoad, onReset, loading }: ActionButtonsProps) {
  const [syncingZuora, setSyncingZuora] = useState(false)
  const [syncingChargebee, setSyncingChargebee] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; error: boolean } | null>(null)

  const showToast = (text: string, error = false) => {
    setToastMessage({ text, error })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSyncZuora = async () => {
    setSyncingZuora(true)
    try {
      const res = await fetch('/api/sync/zuora', { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      showToast('Zuora sync triggered. Data will arrive shortly.', false)
    } catch {
      showToast('Failed to trigger Zuora sync', true)
    } finally {
      setSyncingZuora(false)
    }
  }

  const handleSyncChargebee = async () => {
    setSyncingChargebee(true)
    try {
      const res = await fetch('/api/sync/chargebee', { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      showToast('Chargebee sync triggered. Data will arrive shortly.', false)
    } catch {
      showToast('Failed to trigger Chargebee sync', true)
    } finally {
      setSyncingChargebee(false)
    }
  }

  const isSyncing = syncingZuora || syncingChargebee

  return (
    <div className="flex flex-wrap items-center gap-3 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-14 right-0 flex justify-end z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap ${
              toastMessage.error ? 'bg-red-500 text-white' : 'bg-[#059669] text-white'
            }`}
          >
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Sync Zuora Button */}
      <button
        onClick={handleSyncZuora}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white
          bg-[#059669] hover:bg-[#047857] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_4px_20px_-4px_rgba(5,150,105,0.4)]"
      >
        {syncingZuora ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {syncingZuora ? 'Syncing Zuora...' : 'Sync Zuora'}
      </button>

      {/* Sync Chargebee Button */}
      <button
        onClick={handleSyncChargebee}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white
          bg-[#EA580C] hover:bg-[#C2410C] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_4px_20px_-4px_rgba(234,88,12,0.4)]"
      >
        {syncingChargebee ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {syncingChargebee ? 'Syncing Chargebee...' : 'Sync Chargebee'}
      </button>

      {/* Load Data Button */}
      <button
        onClick={onLoad}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-on-primary
          bg-gradient-to-br from-primary-dark to-primary
          hover:opacity-90 active:scale-[0.98] disabled:opacity-50
          shadow-[0_4px_20px_-4px_rgba(124,58,237,0.4)]
          transition-all"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {loading ? 'Loading…' : 'Load Data'}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
          text-on-surface-variant bg-transparent
          hover:bg-surface-container-high active:scale-[0.98] disabled:opacity-50
          border border-outline-variant/20
          transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  )
}
