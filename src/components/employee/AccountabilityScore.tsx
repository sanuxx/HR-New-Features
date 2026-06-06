import type { Employee } from '../../types'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

interface Props { employee: Employee }

export function AccountabilityScore({ employee }: Props) {
  const score = employee.accountabilityScore
  const color = score >= 75 ? '#30d158' : score >= 50 ? '#ffd60a' : '#ff453a'
  const r = 52
  const circumference = 2 * Math.PI * r
  const strokeDash = (score / 100) * circumference

  return (
    <Card>
      <p className="label-secondary mb-4">Accountability Score</p>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#2c2c2e" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={r} fill="none"
              stroke={color} strokeWidth="8"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold tracking-tight" style={{ color }}>{score}</span>
            <span className="text-[11px] text-label-tertiary">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-3.5">
          <ProgressBar
            value={employee.onTimeRate * 100}
            color="bg-apple-green"
            label="On-Time Rate"
            showValue
            height="h-1"
          />
          <ProgressBar
            value={employee.qualityScore}
            color="bg-apple-blue"
            label="Quality Score"
            showValue
            height="h-1"
          />
          <ProgressBar
            value={employee.responsivenessScore}
            color="bg-apple-purple"
            label="Responsiveness"
            showValue
            height="h-1"
          />
        </div>
      </div>
    </Card>
  )
}
