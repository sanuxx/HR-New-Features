import type { RetentionAlert } from '../types'

export const retentionAlerts: RetentionAlert[] = [
  {
    employeeId: 'emp-tyler',
    riskScore: 83,
    level: 'critical',
    factors: [
      { label: 'Late task rate (7-day)', weight: 0.35, value: '28% of tasks late' },
      { label: 'Login frequency drop', weight: 0.25, value: '2.2 days/week (was 4.8)' },
      { label: 'Quality score trend', weight: 0.25, value: 'Declining — avg 48 this month' },
      { label: 'Collaboration events', weight: 0.15, value: 'Only 2 this week (avg 11)' },
    ],
    suggestedActions: [
      'Schedule a confidential 1:1 to discuss workload and career concerns',
      'Offer role flexibility or project rotation within Team Gamma',
      'Connect with HR for a wellness check-in',
    ],
    flaggedAt: '2026-06-03T09:00:00Z',
  },
  {
    employeeId: 'emp-ethan',
    riskScore: 81,
    level: 'critical',
    factors: [
      { label: 'Task abandon rate', weight: 0.40, value: '32% — highest on team' },
      { label: 'Collaboration events', weight: 0.30, value: 'Only 2 this week' },
      { label: 'Login frequency', weight: 0.20, value: '2.0 days/week' },
      { label: 'Quality score', weight: 0.10, value: 'Score: 48 — below threshold' },
    ],
    suggestedActions: [
      'Review task complexity — may be assigned beyond current skill level',
      'Pair with a senior engineer (Maya or Aisha) for mentoring',
      'Discuss compensation competitiveness — market rate for role may be higher',
    ],
    flaggedAt: '2026-06-03T09:00:00Z',
  },
  {
    employeeId: 'emp-zoe',
    riskScore: 78,
    level: 'critical',
    factors: [
      { label: 'Late task rate (7-day)', weight: 0.35, value: '25% of tasks late' },
      { label: 'Quality score trend', weight: 0.30, value: 'Declining — avg 62 → 55' },
      { label: 'Login frequency', weight: 0.20, value: '2.6 days/week' },
      { label: 'Peer rating average', weight: 0.15, value: '2.4 / 5 — lowest in team' },
    ],
    suggestedActions: [
      'Schedule a 1:1 to identify if the role aligns with career goals',
      'Offer a design mentorship session with a senior designer',
      'Consider task load reduction for 2 weeks to rebuild momentum',
    ],
    flaggedAt: '2026-06-02T09:00:00Z',
  },
  {
    employeeId: 'emp-carlos',
    riskScore: 71,
    level: 'watch',
    factors: [
      { label: 'Task abandon rate', weight: 0.35, value: '20% — above team average' },
      { label: 'Quality score trend', weight: 0.30, value: 'Declining over last 3 weeks' },
      { label: 'Collaboration events', weight: 0.20, value: '4 this week (avg 9)' },
      { label: 'Login frequency', weight: 0.15, value: '3.0 days/week' },
    ],
    suggestedActions: [
      'Include in the weekly retention digest — monitor for 2 more weeks',
      'Encourage participation in team collaboration activities',
    ],
    flaggedAt: '2026-06-03T09:00:00Z',
  },
  {
    employeeId: 'emp-jordan',
    riskScore: 67,
    level: 'watch',
    factors: [
      { label: 'Quality score trend', weight: 0.40, value: 'Declining — avg 58 this month' },
      { label: 'Task abandon rate', weight: 0.30, value: '18% — needs attention' },
      { label: 'Login frequency', weight: 0.20, value: '3.1 days/week' },
      { label: 'Collaboration events', weight: 0.10, value: '5 this week' },
    ],
    suggestedActions: [
      'Assign the "Writing Testable Code" training and follow up on progress',
      'Check for blockers on the current project',
    ],
    flaggedAt: '2026-06-01T09:00:00Z',
  },
  {
    employeeId: 'emp-noah',
    riskScore: 52,
    level: 'watch',
    factors: [
      { label: 'Task abandon rate', weight: 0.40, value: '12% — slightly elevated' },
      { label: 'Login frequency', weight: 0.30, value: '3.8 days/week' },
      { label: 'Quality score', weight: 0.20, value: 'Stable at 68' },
      { label: 'Collaboration events', weight: 0.10, value: '7 this week' },
    ],
    suggestedActions: [
      'Add to weekly digest — no immediate action required',
    ],
    flaggedAt: '2026-06-01T09:00:00Z',
  },
  {
    employeeId: 'emp-james',
    riskScore: 49,
    level: 'stable',
    factors: [
      { label: 'Task abandon rate', weight: 0.40, value: '11% — average for role' },
      { label: 'Login frequency', weight: 0.30, value: '3.9 days/week' },
      { label: 'Quality score', weight: 0.20, value: 'Stable at 67' },
      { label: 'Collaboration events', weight: 0.10, value: '8 this week' },
    ],
    suggestedActions: [
      'No immediate action needed — monitor monthly',
    ],
    flaggedAt: '2026-06-01T09:00:00Z',
  },
]
