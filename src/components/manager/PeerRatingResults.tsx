import { usePeerRatingStore } from '../../store/usePeerRatingStore'
import { employees } from '../../data/employees'
import { Card } from '../ui/Card'
import { IconStar } from '../ui/Icons'

interface Props {
  managerId: string
}

export function PeerRatingResults({ managerId }: Props) {
  const { getEmployeeAvg, getEmployeeRatings } = usePeerRatingStore()
  const team = employees.filter(e => e.managerId === managerId)

  return (
    <Card>
      <div className="flex items-center gap-2 mb-5">
        <IconStar size={15} className="text-apple-yellow" />
        <p className="text-sm font-semibold text-label-primary">Peer Rating Summary — This Week</p>
      </div>
      <div className="space-y-3">
        {team.map(emp => {
          const avg = getEmployeeAvg(emp.id)
          const ratings = getEmployeeRatings(emp.id)
          const baseAvg = emp.peerRatingAvg
          const displayAvg = ratings.length > 0 ? avg : baseAvg
          const count = ratings.length > 0 ? ratings.length : '—'
          const pct = (displayAvg / 5) * 100

          const color =
            displayAvg >= 4.5 ? 'text-apple-green' :
            displayAvg >= 3.5 ? 'text-apple-blue' :
            displayAvg >= 2.5 ? 'text-apple-yellow' : 'text-apple-red'

          const barColor =
            displayAvg >= 4.5 ? 'bg-apple-green' :
            displayAvg >= 3.5 ? 'bg-apple-blue' :
            displayAvg >= 2.5 ? 'bg-apple-yellow' : 'bg-apple-red'

          const needsCheckIn = displayAvg < 3.0

          return (
            <div key={emp.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {emp.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-label-primary">{emp.name}</p>
                    {needsCheckIn && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-apple-red/10 text-apple-red border border-apple-red/20">
                        Check-in recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold tabular-nums ${color}`}>{displayAvg.toFixed(1)}</span>
                    <span className="text-xs text-label-quaternary">({count} ratings)</span>
                  </div>
                </div>
                <div className="relative w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-label-quaternary mt-4">Ratings are anonymous. "Check-in recommended" triggers when average drops below 3.0.</p>
    </Card>
  )
}
