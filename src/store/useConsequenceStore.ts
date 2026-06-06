import { create } from 'zustand'
import type { ConsequenceEvent, ConsequenceRule } from '../types'
import { consequences as initialConsequences } from '../data/consequences'

const defaultRules: ConsequenceRule[] = [
  { id: 'rule-1', trigger: '3 late tasks in 7 days', consequence: 'Auto-schedule manager check-in', threshold: '7-day rolling window', type: 'penalty', enabled: true },
  { id: 'rule-2', trigger: 'Quality score <70% twice consecutively', consequence: 'Assign mandatory micro-training module', threshold: '2 consecutive reviews', type: 'penalty', enabled: true },
  { id: 'rule-3', trigger: 'Missed quality gate without override', consequence: 'Payroll hold (2% of period pay)', threshold: 'Per missed gate', type: 'penalty', enabled: true },
  { id: 'rule-4', trigger: 'On-time >90% AND quality >85% for 30d', consequence: 'Unlock $200 learning budget credit', threshold: '30-day streak', type: 'reward', enabled: true },
]

interface ConsequenceStore {
  rules: ConsequenceRule[]
  events: ConsequenceEvent[]
  updateRule: (id: string, updates: Partial<ConsequenceRule>) => void
  addConsequence: (event: ConsequenceEvent) => void
  resolveConsequence: (id: string) => void
  triggerConsequences: (employeeId: string, lateCount: number, qualityScore: number) => void
}

export const useConsequenceStore = create<ConsequenceStore>((set, get) => ({
  rules: defaultRules,
  events: initialConsequences,

  updateRule: (id, updates) =>
    set((s) => ({ rules: s.rules.map(r => r.id === id ? { ...r, ...updates } : r) })),

  addConsequence: (event) =>
    set((s) => ({ events: [event, ...s.events] })),

  resolveConsequence: (id) =>
    set((s) => ({ events: s.events.map(e => e.id === id ? { ...e, resolved: true } : e) })),

  triggerConsequences: (employeeId, lateCount, qualityScore) => {
    const { rules, events } = get()
    const today = new Date().toISOString().split('T')[0]
    const newEvents: ConsequenceEvent[] = []

    const rule1 = rules.find(r => r.id === 'rule-1')
    if (rule1?.enabled && lateCount >= 3) {
      const alreadyFired = events.some(
        e => e.employeeId === employeeId && e.trigger === rule1.trigger &&
          e.date >= new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      )
      if (!alreadyFired) {
        newEvents.push({
          id: `auto-${Date.now()}-1`,
          employeeId,
          type: 'check-in',
          trigger: rule1.trigger,
          description: `Automatic check-in triggered: ${lateCount} late tasks detected in rolling 7-day window.`,
          date: today,
          resolved: false,
        })
      }
    }

    const rule2 = rules.find(r => r.id === 'rule-2')
    if (rule2?.enabled && qualityScore < 70) {
      const alreadyFired = events.some(
        e => e.employeeId === employeeId && e.trigger === rule2.trigger &&
          e.date >= new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]
      )
      if (!alreadyFired) {
        newEvents.push({
          id: `auto-${Date.now()}-2`,
          employeeId,
          type: 'training',
          trigger: rule2.trigger,
          description: `Mandatory training assigned: quality score ${qualityScore} falls below 70% threshold.`,
          date: today,
          resolved: false,
        })
      }
    }

    if (newEvents.length > 0) {
      set((s) => ({ events: [...newEvents, ...s.events] }))
    }
  },
}))
