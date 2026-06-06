import { useState } from 'react'
import { useRoleStore } from '../../store/useRoleStore'
import { useTaskStore } from '../../store/useTaskStore'
import { TaskCard } from '../../components/employee/TaskCard'
import type { TaskStatus } from '../../types'
import { IconFilter, IconCheckSquare } from '../../components/ui/Icons'

const filters: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Submitted',   value: 'submitted' },
  { label: 'Approved',    value: 'approved' },
  { label: 'Overdue',     value: 'late' },
]

export function MyTasks() {
  const { activeEmployeeId } = useRoleStore()
  const { tasks } = useTaskStore()
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')

  const myTasks = tasks.filter(t => t.employeeId === activeEmployeeId)
  const visible = filter === 'all' ? myTasks : myTasks.filter(t => t.status === filter)

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
            <IconCheckSquare size={22} className="text-apple-blue" />
          </div>
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Track and submit your micro-deliverables.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <IconFilter size={13} className="text-label-tertiary" />
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-100 ${
              filter === f.value
                ? 'bg-apple-blue text-white'
                : 'bg-bg-elevated text-label-secondary hover:text-label-primary border border-separator'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-label-tertiary">
          <p className="text-sm">No tasks in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visible.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      )}
    </div>
  )
}
