import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { MentorshipSession } from '../../types'

const seniorOptions = [
  { name: 'Sarah Johnson', role: 'Engineering Manager' },
  { name: 'Marcus Williams', role: 'Product Director' },
  { name: 'Rachel Kim', role: 'Design Lead' },
  { name: 'David Park', role: 'CFO' },
]

const topicSuggestions = [
  'AI/ML tooling & prompting',
  'Modern frontend frameworks',
  'TypeScript advanced patterns',
  'CI/CD & DevOps best practices',
  'Data visualization techniques',
  'API design patterns',
]

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (session: MentorshipSession) => void
  employeeId: string
}

export function ReverseMentorshipModal({ open, onClose, onSubmit, employeeId }: Props) {
  const [topic, setTopic] = useState('')
  const [seniorIdx, setSeniorIdx] = useState(0)
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')

  const creditsEarned = Math.floor(duration / 30) * 5

  const handleSubmit = () => {
    if (!topic.trim()) return
    const senior = seniorOptions[seniorIdx]
    onSubmit({
      id: `ms-${Date.now()}`,
      employeeId,
      topic: topic.trim(),
      seniorName: senior.name,
      seniorRole: senior.role,
      date: new Date().toISOString().split('T')[0],
      duration,
      creditsEarned,
      confirmed: false,
    })
    setTopic('')
    setNotes('')
    setDuration(60)
    onClose()
  }

  return (
    <Modal open={open} title="Log Mentorship Session" subtitle="Teach a senior — earn credits when they confirm" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Senior Mentee</label>
          <select
            className="apple-input w-full"
            value={seniorIdx}
            onChange={e => setSeniorIdx(+e.target.value)}
          >
            {seniorOptions.map((s, i) => (
              <option key={i} value={i}>{s.name} — {s.role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Topic</label>
          <input
            className="apple-input w-full"
            placeholder="What did you teach?"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {topicSuggestions.map(s => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="text-[11px] px-2 py-1 rounded-lg bg-bg-elevated border border-separator text-label-secondary hover:border-apple-blue hover:text-apple-blue transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">
            Duration: {duration} min
          </label>
          <input
            type="range" min={30} max={180} step={30} value={duration}
            onChange={e => setDuration(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-label-quaternary mt-1">
            <span>30 min</span><span>1 hr</span><span>90 min</span><span>2 hr</span><span>2.5 hr</span><span>3 hr</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-1.5">Notes (optional)</label>
          <textarea
            className="apple-input w-full resize-none"
            rows={2}
            placeholder="Key takeaways, resources shared, follow-up planned..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="bg-apple-blue/5 border border-apple-blue/20 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-label-primary">Credits to earn</p>
            <p className="text-xs text-label-tertiary">Awarded after senior confirms</p>
          </div>
          <span className="text-2xl font-bold text-apple-blue">+{creditsEarned}</span>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!topic.trim()}>Submit for Confirmation</Button>
        </div>
      </div>
    </Modal>
  )
}
