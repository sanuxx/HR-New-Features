import { useRoleStore } from '../../store/useRoleStore'
import { useTaskStore } from '../../store/useTaskStore'
import { getTeamEmployees } from '../../data/employees'
import { retentionAlerts } from '../../data/retention'
import { consequences } from '../../data/consequences'
import { Card } from '../../components/ui/Card'
import { RetentionRiskPanel } from '../../components/manager/RetentionRiskPanel'
import { ConsequenceLog } from '../../components/manager/ConsequenceLog'
import { Avatar } from '../../components/ui/Avatar'
import { fmt$ } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconAlertTriangle, IconCheck, IconClock, IconUsers, IconDollarSign } from '../../components/ui/Icons'

export function ManagerDashboard() {
  const { activeManagerId } = useRoleStore()
  const { tasks } = useTaskStore()
  const navigate = useNavigate()
  const team = getTeamEmployees(activeManagerId)
  const teamIds = team.map(e => e.id)
  const teamTasks = tasks.filter(t => teamIds.includes(t.employeeId))
  const reviewQueue = teamTasks.filter(t => t.status === 'submitted' || t.status === 'under-review')
  const lateTasks = teamTasks.filter(t => t.status === 'late')
  const avgScore = Math.round(team.reduce((s, e) => s + e.accountabilityScore, 0) / team.length)
  const teamNet = team.reduce((s, e) => s + e.netContribution, 0)
  const teamAlerts = retentionAlerts.filter(a => teamIds.includes(a.employeeId) && a.level !== 'stable')
  const recentConsequences = consequences.filter(c => teamIds.includes(c.employeeId)).slice(0, 4)

  const kpis = [
    {
      label: 'Review Queue', value: reviewQueue.length, sub: 'tasks awaiting review',
      tile: 'kpi-yellow', iconBg: 'bg-amber-100 text-amber-700', Icon: IconClock,
      onClick: () => navigate('/manager/tasks'),
    },
    {
      label: 'Overdue Tasks', value: lateTasks.length, sub: 'past deadline',
      tile: 'kpi-red', iconBg: 'bg-red-100 text-red-700', Icon: IconAlertTriangle,
      onClick: () => navigate('/manager/tasks'),
    },
    {
      label: 'Avg Accountability', value: `${avgScore}`, sub: 'team score / 100',
      tile: avgScore >= 75 ? 'kpi-green' : avgScore >= 50 ? 'kpi-yellow' : 'kpi-red',
      iconBg: avgScore >= 75 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
      Icon: IconCheck, onClick: undefined,
    },
    {
      label: 'Team Net', value: fmt$(teamNet), sub: 'net contribution this month',
      tile: teamNet >= 0 ? 'kpi-green' : 'kpi-red',
      iconBg: teamNet >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      Icon: IconDollarSign, onClick: () => navigate('/manager/profitability'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-purple/10 rounded-2xl flex items-center justify-center">
            <IconUsers size={22} className="text-apple-purple" />
          </div>
          <div>
            <h1 className="page-title">Team Overview</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Sarah Johnson · Team Alpha · {team.length} members</p>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ label, value, sub, tile, iconBg, Icon, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            className={`apple-card fade-in ${tile} p-5 ${onClick ? 'cursor-pointer apple-card-hover' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${iconBg}`}>
                <Icon size={17} />
              </div>
              {onClick && <IconArrowRight size={13} className="text-[#acacb2] mt-1 opacity-60" />}
            </div>
            <p className="stat-number text-[#1d1d1f] mt-1">{value}</p>
            <p className="text-[12px] font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">{label}</p>
            <p className="text-[11px] text-[#86868b] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Alerts + Consequences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Retention Alerts</h2>
            <button onClick={() => navigate('/manager/retention')} className="flex items-center gap-1 text-xs text-apple-blue hover:text-apple-blue-hover transition-colors font-semibold">
              View all <IconArrowRight size={12} />
            </button>
          </div>
          <RetentionRiskPanel alerts={teamAlerts} limit={3} />
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Consequences</h2>
            <button onClick={() => navigate('/manager/consequences')} className="flex items-center gap-1 text-xs text-apple-blue hover:text-apple-blue-hover transition-colors font-semibold">
              View all <IconArrowRight size={12} />
            </button>
          </div>
          <ConsequenceLog events={recentConsequences} />
        </Card>
      </div>

      {/* Team member grid */}
      <div>
        <h2 className="section-title mb-4">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {team.map((emp, i) => (
            <Card key={emp.id} padding="sm">
              <div className="flex flex-col items-center text-center p-2 pb-3">
                <Avatar initials={emp.initials} size="lg" index={i} />
                <p className="text-sm font-semibold text-label-primary tracking-tight mt-3 leading-tight">{emp.name}</p>
                <p className="text-[11px] text-label-tertiary mt-0.5">{emp.role}</p>
              </div>
              <div className="border-t border-separator pt-3 grid grid-cols-2 gap-2 text-center">
                {[
                  { label: 'Score', value: `${emp.accountabilityScore}`, positive: emp.accountabilityScore >= 75 },
                  { label: 'Risk',  value: `${emp.retentionRisk}%`,      positive: emp.retentionRisk < 50 },
                ].map(({ label, value, positive }) => (
                  <div key={label} className="bg-bg-elevated rounded-lg p-2">
                    <p className="text-[10px] text-label-tertiary mb-0.5">{label}</p>
                    <p className={`text-sm font-bold tabular-nums ${positive ? 'text-apple-green' : 'text-apple-red'}`}>{value}</p>
                  </div>
                ))}
              </div>
              <p className={`text-center text-sm font-bold tabular-nums mt-2 ${emp.netContribution >= 0 ? 'text-apple-green' : 'text-apple-red'}`}>
                {fmt$(emp.netContribution)}<span className="text-[10px] text-label-tertiary font-normal">/mo</span>
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
