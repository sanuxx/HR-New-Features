import { employees } from '../../data/employees'
import { retentionAlerts } from '../../data/retention'
import { Card } from '../../components/ui/Card'
import { OrgHeatmap } from '../../components/cfo/OrgHeatmap'
import { fmt$, fmtPct } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'
import { BASELINE_OUTPUTS } from '../../utils/simulatorEngine'
import { IconArrowRight, IconSliders, IconBarChart, IconDollarSign, IconAlertTriangle, IconUsers, IconTrendingUp } from '../../components/ui/Icons'

export function CFODashboard() {
  const navigate = useNavigate()
  const totalRevenue = employees.reduce((s, e) => s + e.revenueAttributable, 0)
  const totalCost    = employees.reduce((s, e) => s + e.fullyLoadedCost, 0)
  const totalNet     = totalRevenue - totalCost
  const revenuePerFTE = Math.round(totalRevenue / employees.length)
  const criticalCount = retentionAlerts.filter(a => a.level === 'critical').length

  const kpis = [
    { label: 'Monthly Revenue',  value: fmt$(totalRevenue),    sub: 'attributable this month', tile: 'kpi-green',  iconBg: 'bg-green-100 text-green-700',  Icon: IconTrendingUp,    onClick: () => navigate('/cfo/analytics') },
    { label: 'Monthly Cost',     value: fmt$(totalCost),       sub: 'fully-loaded payroll',    tile: 'kpi-red',    iconBg: 'bg-red-100 text-red-700',       Icon: IconDollarSign,    onClick: undefined },
    { label: 'Net Contribution', value: fmt$(totalNet),        sub: 'revenue minus cost',      tile: 'kpi-blue',   iconBg: 'bg-blue-100 text-blue-700',     Icon: IconBarChart,      onClick: () => navigate('/cfo/analytics') },
    { label: 'EBITDA Margin',    value: fmtPct(BASELINE_OUTPUTS.ebitdaMargin), sub: 'earnings before interest', tile: 'kpi-purple', iconBg: 'bg-purple-100 text-purple-700', Icon: IconSliders, onClick: () => navigate('/cfo/simulator') },
    { label: 'Revenue / FTE',    value: fmt$(revenuePerFTE),   sub: 'per employee monthly',    tile: 'kpi-gray',   iconBg: 'bg-gray-100 text-gray-600',     Icon: IconUsers,         onClick: undefined },
    { label: 'Critical Risk',    value: `${criticalCount}`,    sub: 'staff at >75% risk',      tile: 'kpi-red',    iconBg: 'bg-red-100 text-red-700',       Icon: IconAlertTriangle, onClick: () => navigate('/cfo/retention') },
  ]

  const retentionBreakdown = [
    { level: 'Critical', color: 'bg-apple-red',    textColor: 'text-apple-red',    count: retentionAlerts.filter(a => a.level === 'critical').length },
    { level: 'Watch',    color: 'bg-amber-400',    textColor: 'text-amber-600',    count: retentionAlerts.filter(a => a.level === 'watch').length },
    { level: 'Stable',   color: 'bg-apple-green',  textColor: 'text-apple-green',  count: employees.length - retentionAlerts.filter(a => a.level !== 'stable').length },
  ]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-green/10 rounded-2xl flex items-center justify-center">
            <IconBarChart size={22} className="text-apple-green" />
          </div>
          <div>
            <h1 className="page-title">Executive Dashboard</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">David Park · Org-wide financial and workforce intelligence</p>
          </div>
        </div>
      </div>

      {/* 6 KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(({ label, value, sub, tile, iconBg, Icon, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            className={`apple-card ${tile} p-4 ${onClick ? 'cursor-pointer apple-card-hover' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
              <Icon size={14} />
            </div>
            <p className="text-xl font-bold text-label-primary tracking-tight tabular-nums leading-none">{value}</p>
            <p className="text-[11px] font-semibold text-label-secondary mt-1.5">{label}</p>
            <p className="text-[10px] text-label-tertiary mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap + right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Workforce Profitability Heatmap</h2>
            <button onClick={() => navigate('/cfo/analytics')} className="flex items-center gap-1 text-xs text-apple-blue hover:text-apple-blue-hover transition-colors font-semibold">
              Full view <IconArrowRight size={12} />
            </button>
          </div>
          <OrgHeatmap employees={employees} />
        </Card>

        <div className="space-y-4">
          {/* P&L Simulator CTA */}
          <Card hover onClick={() => navigate('/cfo/simulator')}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-apple-blue">
                  <IconSliders size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-label-primary">P&L Simulator</p>
                  <p className="text-[11px] text-label-tertiary">Model financial scenarios</p>
                </div>
              </div>
              <IconArrowRight size={14} className="text-label-quaternary" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                { label: 'Baseline EBITDA', value: fmt$(BASELINE_OUTPUTS.ebitda) },
                { label: 'Revenue / FTE',   value: fmt$(BASELINE_OUTPUTS.revenuePerFTE) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-bg-elevated rounded-apple px-3 py-2.5">
                  <p className="text-[10px] text-label-tertiary font-medium">{label}</p>
                  <p className="text-sm font-bold text-label-primary tabular-nums mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Retention Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Retention Distribution</h2>
              <button onClick={() => navigate('/cfo/retention')} className="text-xs text-apple-blue font-semibold hover:text-apple-blue-hover transition-colors">
                Details
              </button>
            </div>
            <div className="space-y-3">
              {retentionBreakdown.map(({ level, color, textColor, count }) => {
                const pct = (count / employees.length) * 100
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold ${textColor}`}>{level}</span>
                      <span className="text-xs text-label-tertiary tabular-nums font-medium">{count} of {employees.length}</span>
                    </div>
                    <div className="bg-bg-elevated rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-separator flex items-center justify-between">
              <span className="text-xs text-label-tertiary">Total workforce</span>
              <span className="text-sm font-bold text-label-primary">{employees.length} employees</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
