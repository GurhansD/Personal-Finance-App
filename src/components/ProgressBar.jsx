export default function ProgressBar({ value, max, color = '#22c55e', showLabel = true, size = 'md' }) {
  const percentage = Math.min((value / max) * 100, 100)
  const isOver = value > max

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>{Math.round(percentage)}%</span>
          {isOver && <span className="text-red-400 font-medium">Over limit!</span>}
        </div>
      )}
      <div className={`${heights[size]} bg-slate-800 rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: isOver ? '#ef4444' : color,
            boxShadow: `0 0 8px ${isOver ? '#ef4444' : color}60`,
          }}
        />
      </div>
    </div>
  )
}
