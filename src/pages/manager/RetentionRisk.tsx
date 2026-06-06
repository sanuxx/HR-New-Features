import { useRoleStore } from '../../store/useRoleStore'
import { getTeamEmployees } from '../../data/employees'
import { retentionAlerts } from '../../data/retention'
import { RetentionRiskPanel } from '../../components/manager/RetentionRiskPanel'
import { RetentionRiskChart } from '../../components/charts/RetentionRiskChart'
import { IconBell } from '../../components/ui/Icons'
import { Card } from '../../components/ui/Card'

export function RetentionRisk() {
  const { activeManagerId } = useRoleStore()
  const team = getTeamEmployees(activeManagerId)
  const teamIds = team.map(e => e.id)
  const teamAlerts = retentionAlerts.filter(a => teamIds.includes(a.employeeId))
  const critical = teamAlerts.filter(a => a.level === 'critical')
  const watch    = teamAlerts.filter(a => a.level === 'watch')
  const stable   = team.length - critical.length - watch.length

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-red/10 rounded-2xl flex items-center justify-center">
            <IconBell size={22} className="text-apple-red" />
          </div>
          <div>
            <h1 className="page-title">Retention Risk</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">AI-scored voluntary resignation probability — updated daily.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center border-apple-red/20">
          <p className="label-secondary mb-2">Critical</p>
          <p className="text-3xl font-bold text-apple-red tracking-tight">{critical.length}</p>
          <p className="text-xs text-label-tertiary mt-1">risk &gt;75%</p>
        </Card>
        <Card className="text-center border-apple-yellow/20">
          <p className="label-secondary mb-2">Watch</p>
          <p className="text-3xl font-bold text-apple-yellow tracking-tight">{watch.length}</p>
          <p className="text-xs text-label-tertiary mt-1">risk 50–74%</p>
        </Card>
        <Card className="text-center border-apple-green/20">
          <p className="label-secondary mb-2">Stable</p>
          <p className="text-3xl font-bold text-apple-green tracking-tight">{stable}</p>
          <p className="text-xs text-label-tertiary mt-1">risk &lt;50%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <h2 className="section-title mb-4">Risk Alerts</h2>
          <RetentionRiskPanel alerts={teamAlerts} />
        </div>
        <Card>
          <p className="label-secondary mb-4">Risk vs Accountability — Org-wide</p>
          <RetentionRiskChart height={340} />
        </Card>
      </div>
    </div>
  )
}
