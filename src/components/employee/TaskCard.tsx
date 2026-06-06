import { useState, useEffect, useRef } from 'react'
import type { Task } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useTaskStore } from '../../store/useTaskStore'
import { fmt$ } from '../../utils/formatters'
import { IconPlay, IconPause, IconCheck, IconClock, IconDollarSign, IconAlertTriangle } from '../ui/Icons'

interface Props {
  task: Task
  showActions?: boolean
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:       { label: 'Pending',      className: 'bg-white/6 text-label-secondary border border-separator' },
  'in-progress': { label: 'In Progress',  className: 'bg-apple-blue/15 text-apple-blue border border-apple-blue/25' },
  submitted:     { label: 'Submitted',    className: 'bg-apple-yellow/15 text-apple-yellow border border-apple-yellow/25' },
  'under-review':{ label: 'In Review',    className: 'bg-apple-purple/15 text-apple-purple border border-apple-purple/25' },
  approved:      { label: 'Approved',     className: 'bg-apple-green/15 text-apple-green border border-apple-green/25' },
  rejected:      { label: 'Rejected',     className: 'bg-apple-red/15 text-apple-red border border-apple-red/25' },
  late:          { label: 'Overdue',      className: 'bg-apple-red/15 text-apple-red border border-apple-red/25' },
}

function formatDue(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0) return 'Overdue'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export function TaskCard({ task, showActions = true }: Props) {
  const { updateStatus, logMinutes, submitTask } = useTaskStore()
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(task.loggedMinutes * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(p => {
          const next = p + 1
          if (next % 10 === 0) logMinutes(task.id, Math.floor(next / 60))
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const totalSecs = elapsed
  const hh = Math.floor(totalSecs / 3600)
  const mm = Math.floor((totalSecs % 3600) / 60)
  const ss = totalSecs % 60
  const timeStr = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
  const estimatedSecs = task.estimatedHours * 3600
  const pct = Math.min(100, (elapsed / estimatedSecs) * 100)
  const overTime = elapsed > estimatedSecs * 1.2
  const mins = Math.floor(elapsed / 60)
  const cfg = statusConfig[task.status] ?? statusConfig.pending

  const isOverdue = task.status === 'late'
  const dueLabel = formatDue(task.dueDate)

  return (
    <Card className={isOverdue ? 'border-apple-red/20' : ''}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-label-primary tracking-tight leading-snug truncate">{task.title}</h4>
          <p className="text-xs text-label-secondary mt-0.5 line-clamp-2 leading-relaxed">{task.description}</p>
        </div>
        <Badge label={cfg.label} className={`${cfg.className} shrink-0`} />
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1 text-xs text-label-tertiary">
          <IconClock size={12} />
          <span>{task.estimatedHours}h est.</span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-apple-red' : 'text-label-tertiary'}`}>
          {isOverdue && <IconAlertTriangle size={12} />}
          <span>{dueLabel}</span>
        </div>
        {task.impactValue > 0 && (
          <div className="flex items-center gap-1 text-xs text-apple-green font-medium ml-auto">
            <IconDollarSign size={11} />
            <span>{fmt$(task.impactValue)}</span>
          </div>
        )}
      </div>

      {(task.status === 'in-progress' || (task.status === 'pending' && showActions)) && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-base font-semibold text-label-primary tracking-wider">{timeStr}</span>
            {overTime && (
              <span className="text-[11px] text-apple-yellow flex items-center gap-1">
                <IconAlertTriangle size={11} /> Over estimate
              </span>
            )}
          </div>
          <div className="w-full bg-bg-elevated rounded-full h-1 overflow-hidden">
            <div
              className={`h-1 rounded-full transition-all ${overTime ? 'bg-apple-yellow' : 'bg-apple-blue'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {task.qualityCriteria.length > 0 && (
        <div className="space-y-1.5 mb-3 p-3 bg-bg-elevated rounded-xl">
          <p className="text-[11px] font-semibold text-label-tertiary uppercase tracking-wider mb-2">Quality Criteria</p>
          {task.qualityCriteria.map(c => (
            <div key={c.id} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${c.met === true ? 'bg-apple-green/20 text-apple-green' : c.met === false ? 'bg-apple-red/20 text-apple-red' : 'bg-bg-hover text-label-tertiary'}`}>
                {c.met === true && <IconCheck size={9} strokeWidth={2.5} />}
                {c.met !== true && <span className="text-[8px]">{c.met === false ? '×' : '·'}</span>}
              </div>
              <span className={c.met === true ? 'text-apple-green' : 'text-label-secondary'}>{c.label}</span>
            </div>
          ))}
        </div>
      )}

      {showActions && (task.status === 'pending' || task.status === 'in-progress') && (
        <div className="flex gap-2 pt-1">
          {task.status === 'pending' && (
            <Button size="sm" onClick={() => { updateStatus(task.id, 'in-progress'); setRunning(true) }}>
              <IconPlay size={11} /> Start Task
            </Button>
          )}
          {task.status === 'in-progress' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => setRunning(r => !r)}>
                {running ? <><IconPause size={11} /> Pause</> : <><IconPlay size={11} /> Resume</>}
              </Button>
              <Button
                size="sm" variant="success"
                onClick={() => { if (mins >= 1) { submitTask(task.id); setRunning(false) } }}
                disabled={mins < 1}
              >
                Submit for Review
              </Button>
            </>
          )}
        </div>
      )}

      {task.qualityScoreAwarded !== undefined && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-apple-green font-medium">
          <IconCheck size={12} strokeWidth={2.5} />
          Quality score: {task.qualityScoreAwarded}/100
        </div>
      )}
    </Card>
  )
}
