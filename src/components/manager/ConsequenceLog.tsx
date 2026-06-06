import type { ConsequenceEvent } from '../../types'
import { employees } from '../../data/employees'
import { Badge } from '../ui/Badge'
import { IconAlertTriangle, IconCalendar, IconBook, IconCreditCard, IconGift } from '../ui/Icons'

const typeConfig: Record<string, {
  Icon: React.ComponentType<{ size?: number; className?: string }>
  badge: string
  label: string
}> = {
  warning:              { Icon: IconAlertTriangle, badge: 'bg-apple-yellow/15 text-apple-yellow border border-apple-yellow/25', label: 'Warning' },
  'check-in':           { Icon: IconCalendar,      badge: 'bg-apple-blue/15 text-apple-blue border border-apple-blue/25',     label: 'Check-in' },
  training:             { Icon: IconBook,          badge: 'bg-apple-purple/15 text-apple-purple border border-apple-purple/25',label: 'Training' },
  'payroll-adjustment': { Icon: IconCreditCard,    badge: 'bg-apple-red/15 text-apple-red border border-apple-red/25',        label: 'Payroll Adj.' },
  'perk-awarded':       { Icon: IconGift,          badge: 'bg-apple-green/15 text-apple-green border border-apple-green/25',  label: 'Perk Awarded' },
}

interface Props {
  events: ConsequenceEvent[]
  showEmployee?: boolean
}

export function ConsequenceLog({ events, showEmployee = true }: Props) {
  return (
    <div className="space-y-2">
      {events.map(ev => {
        const emp = employees.find(e => e.id === ev.employeeId)
        const cfg = typeConfig[ev.type]
        const { Icon } = cfg
        return (
          <div key={ev.id} className="apple-card p-4 flex gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.badge}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                {showEmployee && emp && (
                  <span className="text-sm font-medium text-label-primary tracking-tight">{emp.name}</span>
                )}
                <Badge label={cfg.label} className={cfg.badge} />
                {ev.amount !== undefined && ev.amount !== 0 && (
                  <span className={`text-xs font-semibold ${ev.amount > 0 ? 'text-apple-green' : 'text-apple-red'}`}>
                    {ev.amount > 0 ? '+' : ''}
                    {ev.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                )}
                <span className="text-xs text-label-tertiary ml-auto">{ev.date}</span>
              </div>
              <p className="text-xs text-label-secondary leading-relaxed">{ev.description}</p>
              <p className="text-[11px] text-label-tertiary mt-1">Trigger: {ev.trigger}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
