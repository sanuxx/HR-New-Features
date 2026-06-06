import type { Task } from '../../types'
import { Button } from '../ui/Button'
import { useTaskStore } from '../../store/useTaskStore'
import { useToastStore } from '../../store/useToastStore'
import { employees } from '../../data/employees'
import { fmt$, timeAgo, timeUntil } from '../../utils/formatters'
import { IconCheck, IconX, IconClock } from '../ui/Icons'

interface Props { tasks: Task[] }

export function QualityReviewQueue({ tasks }: Props) {
  const { approveTask, rejectTask } = useTaskStore()
  const { show: toast } = useToastStore()
  const reviewable = tasks.filter(t => t.status === 'submitted' || t.status === 'under-review')

  if (!reviewable.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-label-tertiary">
        <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center mb-3">
          <IconCheck size={20} className="text-apple-green" />
        </div>
        <p className="text-sm font-medium text-label-secondary">Queue is clear</p>
        <p className="text-xs mt-1">No tasks awaiting review</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviewable.map(task => {
        const emp = employees.find(e => e.id === task.employeeId)
        return (
          <div key={task.id} className="apple-card p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-label-primary tracking-tight">{task.title}</p>
                {emp && <p className="text-xs text-label-tertiary mt-0.5">{emp.name} · {emp.role}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-label-tertiary">{task.submittedAt ? timeAgo(task.submittedAt) : ''}</p>
                {task.reviewDeadline && (
                  <p className="text-[11px] text-apple-yellow flex items-center gap-1 justify-end mt-0.5">
                    <IconClock size={10} />
                    Auto-approve {timeUntil(task.reviewDeadline)}
                  </p>
                )}
              </div>
            </div>

            {task.qualityCriteria.length > 0 && (
              <div className="bg-bg-elevated rounded-xl p-3 mb-3 space-y-1.5">
                {task.qualityCriteria.map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${c.met === true ? 'bg-apple-green/20 text-apple-green' : 'bg-bg-hover text-label-tertiary'}`}>
                      {c.met === true && <IconCheck size={8} strokeWidth={3} />}
                    </div>
                    <span className="text-label-secondary">{c.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-apple-green font-medium">{fmt$(task.impactValue)} impact</span>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={() => {
                  rejectTask(task.id)
                  toast(`✗ Task rejected — ${emp?.name}`, 'info')
                }}>
                  <IconX size={11} /> Reject
                </Button>
                <Button size="sm" variant="success" onClick={() => {
                  approveTask(task.id, 85)
                  toast(`✓ Task approved — ${emp?.name} +3 accountability`, 'success')
                }}>
                  <IconCheck size={11} /> Approve
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
