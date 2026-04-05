export default function StatCard({ title, value, subtitle, icon, trend, trendLabel, color = '#22c55e', className = '' }) {
  const isPositive = trend >= 0

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6
      bg-slate-900 border border-white/5
      hover:border-white/10 hover:shadow-card-hover
      transition-all duration-300 group
      ${className}
    `}>
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at top right, ${color}10, transparent 70%)` }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-400 mb-1">{title}</div>
          <div className="text-2xl font-bold text-white mb-1 truncate">{value}</div>
          {subtitle && (
            <div className="text-xs text-slate-500">{subtitle}</div>
          )}
          {trend !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
              ${isPositive ? 'bg-brand-500/10 text-brand-400' : 'bg-red-500/10 text-red-400'}`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend).toFixed(1)}% {trendLabel}</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
