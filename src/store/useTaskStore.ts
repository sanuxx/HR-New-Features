import { create } from 'zustand'
import type { Task, TaskStatus } from '../types'
import { tasks as initialTasks } from '../data/tasks'

interface TaskStore {
  tasks: Task[]
  scoreAdjustments: Record<string, number>
  updateStatus: (taskId: string, status: TaskStatus) => void
  logMinutes: (taskId: string, minutes: number) => void
  submitTask: (taskId: string) => void
  approveTask: (taskId: string, score: number) => void
  rejectTask: (taskId: string) => void
  addTask: (task: Task) => void
  autoApproveOverdue: () => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  scoreAdjustments: {},
  updateStatus: (taskId, status) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) })),
  logMinutes: (taskId, minutes) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, loggedMinutes: minutes } : t)) })),
  submitTask: (taskId) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'submitted' as TaskStatus,
              submittedAt: new Date().toISOString(),
              reviewDeadline: new Date(Date.now() + 4 * 3600000).toISOString(),
            }
          : t
      ),
    })),
  approveTask: (taskId, score) =>
    set((s) => {
      const task = s.tasks.find(t => t.id === taskId)
      const empId = task?.employeeId
      return {
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'approved' as TaskStatus, qualityScoreAwarded: score } : t
        ),
        scoreAdjustments: empId
          ? { ...s.scoreAdjustments, [empId]: (s.scoreAdjustments[empId] ?? 0) + 3 }
          : s.scoreAdjustments,
      }
    }),
  rejectTask: (taskId) =>
    set((s) => {
      const task = s.tasks.find(t => t.id === taskId)
      const empId = task?.employeeId
      return {
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: 'rejected' as TaskStatus } : t)),
        scoreAdjustments: empId
          ? { ...s.scoreAdjustments, [empId]: (s.scoreAdjustments[empId] ?? 0) - 4 }
          : s.scoreAdjustments,
      }
    }),
  addTask: (task) =>
    set((s) => ({ tasks: [task, ...s.tasks] })),
  autoApproveOverdue: () => {
    const now = Date.now()
    const { tasks } = get()
    const toApprove = tasks.filter(
      t => (t.status === 'submitted' || t.status === 'under-review') &&
        t.reviewDeadline && new Date(t.reviewDeadline).getTime() <= now
    )
    if (!toApprove.length) return
    set((s) => ({
      tasks: s.tasks.map((t) =>
        toApprove.find(a => a.id === t.id)
          ? { ...t, status: 'approved' as TaskStatus, qualityScoreAwarded: 75, autoApproved: true }
          : t
      ),
      scoreAdjustments: toApprove.reduce((acc, t) => ({
        ...acc,
        [t.employeeId]: (s.scoreAdjustments[t.employeeId] ?? 0) + 2,
      }), { ...s.scoreAdjustments }),
    }))
  },
}))
