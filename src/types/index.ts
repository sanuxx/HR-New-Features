export interface ScorePoint {
  date: string
  score: number
}

export interface PnLPoint {
  date: string
  revenue: number
  cost: number
  net: number
}

export interface Employee {
  id: string
  name: string
  initials: string
  role: string
  team: 'alpha' | 'beta' | 'gamma'
  managerId: string
  salary: number
  startDate: string
  accountabilityScore: number
  onTimeRate: number
  qualityScore: number
  responsivenessScore: number
  accountabilityHistory: ScorePoint[]
  retentionRisk: number
  loginFrequency: number
  taskAbandonRate: number
  qualityTrend: 'improving' | 'stable' | 'declining'
  collaborationEvents: number
  revenueAttributable: number
  fullyLoadedCost: number
  netContribution: number
  pnlHistory: PnLPoint[]
  mentorshipCredits: number
  peerRatingAvg: number
  bonusVestingPercent: number
  bonusTarget: number
}

export interface QualityCriterion {
  id: string
  label: string
  met: boolean | null
}

export type TaskStatus = 'pending' | 'in-progress' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'late'

export interface Task {
  id: string
  employeeId: string
  title: string
  description: string
  impactValue: number
  estimatedHours: number
  dueDate: string
  status: TaskStatus
  qualityCriteria: QualityCriterion[]
  submittedAt?: string
  reviewDeadline?: string
  reviewedBy?: string
  qualityScoreAwarded?: number
  autoApproved?: boolean
  loggedMinutes: number
}

export type ConsequenceType = 'warning' | 'check-in' | 'training' | 'payroll-adjustment' | 'perk-awarded'

export interface ConsequenceEvent {
  id: string
  employeeId: string
  type: ConsequenceType
  trigger: string
  description: string
  date: string
  amount?: number
  resolved: boolean
}

export interface RiskFactor {
  label: string
  weight: number
  value: string
}

export interface RetentionAlert {
  employeeId: string
  riskScore: number
  level: 'critical' | 'watch' | 'stable'
  factors: RiskFactor[]
  suggestedActions: string[]
  flaggedAt: string
  falsePositiveFeedback?: boolean
}

export interface SimulatorInputs {
  headcountDelta: number
  wageDelta: number
  retentionDelta: number
  productivityDelta: number
}

export interface SimulatorOutputs {
  totalPayrollCost: number
  projectedRevenue: number
  ebitda: number
  ebitdaMargin: number
  paybackPeriodMonths: number
  revenuePerFTE: number
}

export interface SavedScenario {
  id: string
  name: string
  inputs: SimulatorInputs
  outputs: SimulatorOutputs
  savedAt: string
}

export interface MentorshipCredit {
  id: string
  topic: string
  seniorName: string
  credits: number
  date: string
}

export interface PeerRating {
  id: string
  fromEmployeeId: string
  toEmployeeId: string
  score: number
  week: string
}

export type AppRole = 'employee' | 'manager' | 'cfo'

export interface ConsequenceRule {
  id: string
  trigger: string
  consequence: string
  threshold: string
  type: 'penalty' | 'reward'
  enabled: boolean
}

export interface MentorshipSession {
  id: string
  employeeId: string
  topic: string
  seniorName: string
  seniorRole: string
  date: string
  duration: number
  creditsEarned: number
  confirmed: boolean
}
