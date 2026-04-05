'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ResetModalProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ResetModal({ open, onConfirm, onCancel }: ResetModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface-container-lowest rounded-2xl p-6 w-full max-w-md mx-4"
        style={{ boxShadow: '0 24px 80px -20px rgba(124, 58, 237, 0.15)' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-on-surface-variant/50 hover:text-on-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-on-surface mb-1">
              Reset all data?
            </h3>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed">
              This will permanently delete all customers, contracts, invoices, and vendors from Redis. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant
              hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-on-error
              bg-error hover:bg-error/90 active:scale-[0.98] transition-all"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  )
}
