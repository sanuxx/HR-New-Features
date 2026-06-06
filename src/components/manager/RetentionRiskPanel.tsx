import { useState } from 'react'
import type { RetentionAlert } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { employees } from '../../data/employees'
import { IconChevronDown, IconChevronUp, IconThumbsDown, IconArrowRight, IconCalendar, IconCheck } from '../ui/Icons'

interface Props {
  alerts: RetentionAlert[]
  limit?: number
}

const levelConfig = {
  critical: { label: 'Critical', badge: 'bg-apple-red/15 text-apple-red border border-apple-red/25', bar: 'bg-apple-red' },
  watch:    { label: 'Watch',    badge: 'bg-apple-yellow/15 text-apple-yellow border border-apple-yellow/25', bar: 'bg-apple-yellow' },
  stable:   { label: 'Stable',  badge: 'bg-apple-green/15 text-apple-green border border-apple-green/25', bar: 'bg-apple-green' },
}

const avatarColors = ['bg-blue-600','bg-purple-600','bg-emerald-600','bg-orange-600','bg-pink-600','bg-teal-600','bg-rose-600','bg-indigo-600']

function generateActionPlan(alert: RetentionAlert, empName: string) {
  const topFactor = [...alert.factors].sort((a, b) => b.weight - a.weight)[0]
  const plans: Record<string, string[]> = {
    'Login frequency': [
      `Schedule a 30-min re-engagement 1:1 this week to understand ${empName}'s current blockers.`,
      'Review recent ticket load — check if burnout signals are present.',
      'Offer a flexible work arrangement or async option for 2 weeks.',
    ],
    'Task abandon rate': [
      `Break ${empName}'s next sprint tasks into smaller 2-hour micro-deliverables.`,
      'Pair ${empName} with Maya Patel for the next task cycle as accountability partner.',
      'Review clarity of task descriptions — rewrite the 3 most-abandoned task types.',
    ],
    'Quality trend': [
      `Schedule code/design review sessions twice weekly with ${empName}.`,
      `Assign a mandatory 2-hour training module aligned with ${empName}'s weakest domain.`,
      'Add a "draft PR" checkpoint before submission to catch quality issues early.',
    ],
    'Collaboration events': [
      `Invite ${empName} to lead the next team standup to boost ownership.`,
      `Pair ${empName} on a cross-functional initiative with high visibility.`,
      'Recognize a recent win publicly in the team Slack channel this week.',
    ],
  }

  const base = plans[topFactor?.label] ?? [
    `Schedule a 1:1 with ${empName} this week to understand current pain points.`,
    'Review compensation benchmarks against market rate for their role.',
    'Offer a stretch project or learning budget to re-engage motivation.',
  ]

  return [
    ...base,
    `Set a 2-week check-in cadence to track ${empName}'s satisfaction score.`,
    'Log outcome in the Consequence Engine regardless of result.',
  ]
}

export function RetentionRiskPanel({ alerts, limit }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [planFor, setPlanFor] = useState<RetentionAlert | null>(null)
  const [generatedPlans, setGeneratedPlans] = useState<Set<string>>(new Set())
  const visible = alerts.filter(a => !dismissed.includes(a.employeeId)).slice(0, limit)

  const planEmp = planFor ? employees.find(e => e.id === planFor.employeeId) : null

  return (
    <>
      <div className="space-y-2">
        {visible.map((alert, idx) => {
          const emp = employees.find(e => e.id === alert.employeeId)
          if (!emp) return null
          const isOpen = expanded === alert.employeeId
          const cfg = levelConfig[alert.level]
          const hasPlan = generatedPlans.has(alert.employeeId)

          return (
            <Card key={alert.employeeId} padding="none" className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-bg-elevated transition-colors"
                onClick={() => setExpanded(isOpen ? null : alert.employeeId)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                    {emp.initials}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-medium text-label-primary tracking-tight">{emp.name}</p>
                    <p className="text-xs text-label-tertiary">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  {hasPlan && (
                    <span className="flex items-center gap-1 text-[10px] text-apple-green font-medium">
                      <IconCheck size={10} /> Plan active
                    </span>
                  )}
                  <Badge label={`${alert.riskScore}%`} className={cfg.badge} dot />
                  <span className="text-label-tertiary">
                    {isOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-separator">
                  <div className="pt-4 space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-label-tertiary uppercase tracking-wider mb-2.5">Risk Factors</p>
                      <div className="space-y-2">
                        {alert.factors.map((f, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-24 shrink-0">
                              <div className="bg-bg-elevated rounded h-1">
                                <div className={`h-1 rounded ${cfg.bar}`} style={{ width: `${f.weight * 100}%` }} />
                              </div>
                            </div>
                            <span className="text-xs text-label-secondary flex-1">{f.label}</span>
                            <span className="text-xs text-label-tertiary shrink-0">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-label-tertiary uppercase tracking-wider mb-2">Suggested Actions</p>
                      <div className="space-y-1.5">
                        {alert.suggestedActions.map((a, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-label-secondary">
                            <IconArrowRight size={12} className="text-apple-blue shrink-0 mt-0.5" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => { setPlanFor(alert); setGeneratedPlans(s => new Set([...s, alert.employeeId])) }}>
                        <IconCalendar size={12} /> Generate 1:1 Plan
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDismissed(d => [...d, alert.employeeId])}>
                        <IconThumbsDown size={12} /> False Positive
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {planFor && planEmp && (
        <Modal
          open
          title={`1:1 Action Plan — ${planEmp.name}`}
          subtitle={`${planEmp.role} · Risk score ${planFor.riskScore}% · Generated ${new Date().toLocaleDateString()}`}
          onClose={() => setPlanFor(null)}
        >
          <div className="space-y-4">
            <div className={`px-4 py-3 rounded-apple border ${levelConfig[planFor.level].badge}`}>
              <p className="text-sm font-semibold">Risk Level: {levelConfig[planFor.level].label}</p>
              <p className="text-xs mt-0.5 opacity-80">
                Primary driver: {[...planFor.factors].sort((a, b) => b.weight - a.weight)[0]?.label}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-3">Recommended Actions</p>
              <div className="space-y-3">
                {generateActionPlan(planFor, planEmp.name).map((action, i) => (
                  <div key={i} className="flex items-start gap-3 bg-bg-elevated rounded-apple px-4 py-3">
                    <div className="w-5 h-5 rounded-full bg-apple-blue/15 text-apple-blue flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-label-primary">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-elevated rounded-apple p-4">
              <p className="text-xs font-semibold text-label-tertiary uppercase tracking-wider mb-2">Suggested 1:1 Agenda</p>
              {[
                'Check-in on wellbeing and current workload (5 min)',
                'Walk through top risk factor together and ask for their perspective (10 min)',
                'Agree on 2–3 concrete changes for the next 2 weeks (10 min)',
                'Set follow-up date and success metrics (5 min)',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-label-secondary mt-2">
                  <IconCheck size={11} className="text-apple-green shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button variant="secondary" onClick={() => setPlanFor(null)}>Close</Button>
              <Button onClick={() => {
                const blob = new Blob([
                  `1:1 Action Plan — ${planEmp.name}\nGenerated: ${new Date().toLocaleString()}\n\n` +
                  generateActionPlan(planFor, planEmp.name).map((a, i) => `${i+1}. ${a}`).join('\n')
                ], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `action-plan-${planEmp.name.toLowerCase().replace(' ','-')}.txt`
                a.click()
              }}>
                Download Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
