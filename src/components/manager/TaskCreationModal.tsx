import { useState } from 'react'
import type { Task, QualityCriterion } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { IconPlus, IconX } from '../ui/Icons'
import { useToastStore } from '../../store/useToastStore'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
  teamMembers: { id: string; name: string; role: string }[]
}

export function TaskCreationModal({ open, onClose, onSubmit, teamMembers }: Props) {
  const { show: toast } = useToastStore()
  const [employeeId, setEmployeeId] = useState(teamMembers[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [impactValue, setImpactValue] = useState(2000)
  const [estimatedHours, setEstimatedHours] = useState(2)
  const [dueHours, setDueHours] = useState(24)
  const [criteria, setCriteria] = useState<string[]>([''])

  const addCriterion = () => setCriteria(c => [...c, ''])
  const removeCriterion = (i: number) => setCriteria(c => c.filter((_, idx) => idx !== i))
  const updateCriterion = (i: number, val: string) =>
    setCriteria(c => c.map((x, idx) => idx === i ? val : x))

  const handleSubmit = () => {
    if (!title.trim() || !employeeId) return
    const qualityCriteria: QualityCriterion[] = criteria
      .filter(c => c.trim())
      .map((label, i) => ({ id: `nc-${i}`, label, met: null }))

    const employee = teamMembers.find(m => m.id === employeeId)
    const task: Task = {
      id: `task-${Date.now()}`,
      employeeId,
      title: title.trim(),
      description: description.trim(),
      impactValue,
      estimatedHours,
      dueDate: new Date(Date.now() + dueHours * 3600000).toISOString(),
      status: 'pending',
      loggedMinutes: 0,
      qualityCriteria,
    }
    onSubmit(task)
    toast(`✓ Task created for ${employee?.name}`, 'success')
    // reset
    setTitle('')
    setDescription('')
    setImpactValue(2000)
    setEstimatedHours(2)
    setDueHours(24)
    setCriteria([''])
    onClose()
  }

  return (
    <Modal open={open} title="Create New Task" subtitle="Assign a micro-deliverable to a team member" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Assign To</label>
          <select
            className="apple-input w-full"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
          >
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Task Title</label>
          <input
            className="apple-input w-full"
            placeholder="e.g. Implement OAuth2 login flow"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            className="apple-input w-full resize-none"
            rows={3}
            placeholder="What needs to be done and why it matters..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Impact Value ($)</label>
            <input
              type="number"
              className="apple-input w-full"
              value={impactValue}
              min={100}
              step={100}
              onChange={e => setImpactValue(+e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Est. Hours</label>
            <input
              type="number"
              className="apple-input w-full"
              value={estimatedHours}
              min={0.5}
              step={0.5}
              onChange={e => setEstimatedHours(+e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Due In (hours)</label>
            <input
              type="number"
              className="apple-input w-full"
              value={dueHours}
              min={1}
              onChange={e => setDueHours(+e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-label-tertiary uppercase tracking-wider">Quality Criteria</label>
            <button onClick={addCriterion} className="flex items-center gap-1 text-xs text-apple-blue hover:underline">
              <IconPlus size={11} /> Add criterion
            </button>
          </div>
          <div className="space-y-2">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="apple-input flex-1"
                  placeholder={`Criterion ${i + 1}…`}
                  value={c}
                  onChange={e => updateCriterion(i, e.target.value)}
                />
                {criteria.length > 1 && (
                  <button onClick={() => removeCriterion(i)} className="text-label-tertiary hover:text-apple-red p-1 transition-colors">
                    <IconX size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>Create Task</Button>
        </div>
      </div>
    </Modal>
  )
}
