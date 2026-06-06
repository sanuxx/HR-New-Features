interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  label?: string
  showValue?: boolean
  height?: string
}

export function ProgressBar({ value, max = 100, color = 'bg-apple-blue', label, showValue, height = 'h-1.5' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-label-secondary">{label}</span>}
          {showValue && <span className="text-xs font-medium text-label-primary tabular-nums">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-bg-elevated rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
