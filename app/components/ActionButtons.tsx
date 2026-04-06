import { useState } from 'react'
import { RotateCcw, Loader2, RefreshCw, Play } from 'lucide-react'

interface ActionButtonsProps {
  onSyncStart: () => void
  onRefresh: () => void
  onReset: () => void
  isSyncing: boolean
}

export default function ActionButtons({ onSyncStart, onRefresh, onReset, isSyncing }: ActionButtonsProps) {
  const [selectedSource, setSelectedSource] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<{ text: string; error: boolean } | null>(null)

  const showToast = (text: string, error = false) => {
    setToastMessage({ text, error })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSync = async () => {
    if (!selectedSource) return
    onSyncStart()
    
    try {
      if (selectedSource === 'all') {
        showToast('Syncing all sources...', false)
        await Promise.all([
          fetch('/api/sync/zuora', { method: 'POST' }),
          fetch('/api/sync/chargebee', { method: 'POST' }),
          fetch('/api/sync/netsuite', { method: 'POST' }),
          fetch('/api/sync/stripe', { method: 'POST' })
        ])
      } else {
        await fetch(`/api/sync/${selectedSource}`, { method: 'POST' })
      }
    } catch {
      showToast('Failed to trigger sync', true)
    }
  }

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

      <span className="text-[14px] font-medium text-[#6B7280]">Sync from</span>
      
      <select
        value={selectedSource}
        onChange={(e) => setSelectedSource(e.target.value)}
        disabled={isSyncing}
        className="appearance-none border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#111827] bg-white hover:border-[#7C3AED] min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-colors"
      >
        <option value="" disabled>Select source ▾</option>
        <option value="zuora">🟢 Zuora</option>
        <option value="chargebee">🟠 Chargebee</option>
        <option value="netsuite">🔵 NetSuite</option>
        <option value="stripe">🟣 Stripe</option>
        <option value="all">⚪ All Sources</option>
      </select>

      <button
        onClick={handleSync}
        disabled={!selectedSource || isSyncing}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:scale-[0.98] disabled:opacity-50 transition-all font-medium"
      >
        <Play className="w-4 h-4 fill-current" />
        Sync
      </button>

      <button
        onClick={onRefresh}
        disabled={isSyncing}
        className="p-2 border border-transparent rounded-lg text-gray-500 hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50"
        title="Refresh Data"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <button
        onClick={onReset}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50
          border border-gray-200 transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  )
}
