import { useState } from 'react'
import { getTeamEmployees } from '../../data/employees'
import { useConsequenceStore } from '../../store/useConsequenceStore'
import { useTaskStore } from '../../store/useTaskStore'
import { ConsequenceLog } from '../../components/manager/ConsequenceLog'
import { useRoleStore } from '../../store/useRoleStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { IconZap, IconCheck, IconAlertTriangle } from '../../components/ui/Icons'
import type { ConsequenceRule } from '../../types'

function RuleCard({ rule, onUpdate }: { rule: ConsequenceRule; onUpdate: (updates: Partial<ConsequenceRule>) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ trigger: rule.trigger, consequence: rule.consequence, threshold: rule.threshold })

  const save = () => {
    onUpdate(draft)
    setEditing(false)
  }
  const cancel = () => {
    setDraft({ trigger: rule.trigger, consequence: rule.consequence, threshold: rule.threshold })
    setEditing(false)
  }

  const isReward = rule.type === 'reward'

  return (
    <Card className={!rule.enabled ? 'opacity-50' : ''}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isReward ? 'bg-apple-green/15 text-apple-green' : 'bg-apple-red/15 text-apple-red'}`}>
          {isReward ? <IconCheck size={14} /> : <IconZap size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <div>
                <p className="text-[10px] font-semibold text-label-quaternary uppercase tracking-wider mb-1">Trigger</p>
                <input className="apple-input w-full text-sm" value={draft.trigger} onChange={e => setDraft(d => ({ ...d, trigger: e.target.value }))} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-label-quaternary uppercase tracking-wider mb-1">Consequence</p>
                <input className="apple-input w-full text-sm" value={draft.consequence} onChange={e => setDraft(d => ({ ...d, consequence: e.target.value }))} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-label-quaternary uppercase tracking-wider mb-1">Threshold</p>
                <input className="apple-input w-full text-sm" value={draft.threshold} onChange={e => setDraft(d => ({ ...d, threshold: e.target.value }))} />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={save}>Save</Button>
                <Button size="sm" variant="secondary" onClick={cancel}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-semibold text-label-tertiary uppercase tracking-wider mb-1">Trigger</p>
              <p className="text-sm font-medium text-label-primary mb-2">{rule.trigger}</p>
              <p className="text-[11px] font-semibold text-label-tertiary uppercase tracking-wider mb-1">Consequence</p>
              <p className={`text-sm mb-2 ${isReward ? 'text-apple-green' : 'text-apple-blue'}`}>{rule.consequence}</p>
              <p className="text-xs text-label-tertiary">{rule.threshold}</p>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onUpdate({ enabled: !rule.enabled })}
              className={`w-9 h-5 rounded-full transition-colors relative ${rule.enabled ? 'bg-apple-green' : 'bg-bg-hover'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-label-tertiary hover:text-apple-blue transition-colors px-1.5 py-0.5 rounded border border-separator hover:border-apple-blue/30"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

export function ConsequenceEngine() {
  const { activeManagerId } = useRoleStore()
  const { rules, events, updateRule, triggerConsequences } = useConsequenceStore()
  const { tasks } = useTaskStore()
  const team = getTeamEmployees(activeManagerId)
  const teamIds = team.map(e => e.id)
  const teamConsequences = events.filter(c => teamIds.includes(c.employeeId))
  const [triggered, setTriggered] = useState(false)

  const handleRunPipeline = () => {
    team.forEach(emp => {
      const empTasks = tasks.filter(t => t.employeeId === emp.id)
      const lateTasks = empTasks.filter(t => t.status === 'late').length
      triggerConsequences(emp.id, lateTasks, emp.qualityScore)
    })
    setTriggered(true)
    setTimeout(() => setTriggered(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-apple-red/10 rounded-2xl flex items-center justify-center">
              <IconZap size={22} className="text-apple-red" />
            </div>
            <div>
              <h1 className="page-title">Quality & Consequence Engine</h1>
              <p className="text-label-secondary text-[14px] mt-0.5">Configure rules and run consequence triggers for your team.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleRunPipeline}>
            <IconAlertTriangle size={14} />
            {triggered ? 'Pipeline run!' : 'Run Trigger Pipeline'}
          </Button>
        </div>
      </div>

      {triggered && (
        <div className="flex items-center gap-2 px-4 py-3 bg-apple-green/5 border border-apple-green/20 rounded-apple text-sm text-apple-green">
          <IconCheck size={14} />
          Consequence pipeline executed — new events added for qualifying employees.
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <IconZap size={15} className="text-apple-red" />
          <h2 className="section-title">Active Rules</h2>
          <span className="text-xs text-label-tertiary">Toggle or edit any rule</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rules.map(r => (
            <RuleCard key={r.id} rule={r} onUpdate={(updates) => updateRule(r.id, updates)} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Consequence Log</h2>
          <span className="text-xs text-label-tertiary">{teamConsequences.length} entries</span>
        </div>
        <ConsequenceLog events={teamConsequences} />
      </div>
    </div>
  )
}
