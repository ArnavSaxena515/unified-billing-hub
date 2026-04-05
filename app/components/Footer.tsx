'use client'

export default function Footer() {
  return (
    <footer className="mt-auto px-8 py-5 flex items-center justify-between text-xs text-on-surface-variant/50">
      <p>© {new Date().getFullYear()} Rillet · Unified Billing Hub</p>
      <div className="flex items-center gap-4">
        <span className="hover:text-on-surface-variant transition-colors cursor-default">Privacy Policy</span>
        <span className="hover:text-on-surface-variant transition-colors cursor-default">Terms of Service</span>
      </div>
    </footer>
  )
}
