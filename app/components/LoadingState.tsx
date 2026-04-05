'use client'

export default function LoadingState() {
  return (
    <div className="px-8 py-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-4 w-20" />
      </div>

      {/* Table header */}
      <div className="flex gap-4 mb-4 px-2">
        {[120, 100, 140, 80, 100, 80].map((w, i) => (
          <div key={i} className="skeleton h-3" style={{ width: w }} />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-4 px-2">
          <div className="skeleton h-5 w-16 rounded-md" />
          <div className="skeleton h-4 flex-[2]" />
          <div className="skeleton h-4 flex-[2]" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
