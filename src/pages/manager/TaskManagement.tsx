import { useState, useEffect } from 'react'
import { useRoleStore } from '../../store/useRoleStore'
import { useTaskStore } from '../../store/useTaskStore'
import { getTeamEmployees } from '../../data/employees'
import { QualityReviewQueue } from '../../components/manager/QualityReviewQueue'
import { TaskCard } from '../../components/employee/TaskCard'
import { TaskCreationModal } from '../../components/manager/TaskCreationModal'
import { IconClipboard, IconPlus, IconClock } from '../../components/ui/Icons'
import { Button } from '../../components/ui/Button'
import type { Task } from '../../types'

export function TaskManagement() {
  const { activeManagerId } = useRoleStore()
  const { tasks, addTask, autoApproveOverdue } = useTaskStore()
  const team = getTeamEmployees(activeManagerId)
  const teamIds = team.map(e => e.id)
  const teamTasks = tasks.filter(t => teamIds.includes(t.employeeId))
  const queueCount = teamTasks.filter(t => t.status === 'submitted' || t.status === 'under-review').length
  const [showCreate, setShowCreate] = useState(false)
  const [autoApproveCount, setAutoApproveCount] = useState(0)

  // Check every 60 seconds for overdue review deadlines
  useEffect(() => {
    const interval = setInterval(() => {
      const before = tasks.filter(t => t.status === 'submitted' || t.status === 'under-review').length
      autoApproveOverdue()
      const after = useTaskStore.getState().tasks.filter(t => t.status === 'submitted' || t.status === 'under-review').length
      const approved = before - after
      if (approved > 0) setAutoApproveCount(c => c + approved)
    }, 60000)
    return () => clearInterval(interval)
  }, [tasks, autoApproveOverdue])

  const handleCreateTask = (task: Task) => addTask(task)

  const teamMembers = team.map(e => ({ id: e.id, name: e.name, role: e.role }))

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
              <IconClipboard size={22} className="text-apple-blue" />
            </div>
            <div>
              <h1 className="page-title">Task Management</h1>
              <p className="text-label-secondary text-[14px] mt-0.5">Create, assign, and review team deliverables.</p>
            </div>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <IconPlus size={14} /> New Task
          </Button>
        </div>
      </div>

      {autoApproveCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-apple-blue/5 border border-apple-blue/20 rounded-apple text-sm text-apple-blue">
          <IconClock size={14} />
          {autoApproveCount} task{autoApproveCount > 1 ? 's' : ''} auto-approved after 4-hour review deadline passed.
        </div>
      )}

      <div>
        <h2 className="section-title mb-4">Quality Review Queue <span className="text-label-tertiary font-normal">({queueCount})</span></h2>
        <QualityReviewQueue tasks={teamTasks} />
      </div>

      <div>
        <h2 className="section-title mb-4">All Team Tasks</h2>
        <div className="space-y-6">
          {team.map(emp => {
            const empTasks = teamTasks.filter(t => t.employeeId === emp.id)
            if (!empTasks.length) return null
            return (
              <div key={emp.id}>
                <p className="text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-2">{emp.name}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {empTasks.map(t => <TaskCard key={t.id} task={t} showActions={false} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TaskCreationModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateTask}
        teamMembers={teamMembers}
      />
    </div>
  )
}
