import { useRoleStore } from '../../store/useRoleStore'
import { useTaskStore } from '../../store/useTaskStore'
import { employees } from '../../data/employees'
import { consequences } from '../../data/consequences'
import { AccountabilityScore } from '../../components/employee/AccountabilityScore'
import { TaskCard } from '../../components/employee/TaskCard'
import { BonusVestingBar } from '../../components/employee/BonusVestingBar'
import { AccountabilityTrendChart } from '../../components/charts/AccountabilityTrendChart'
import { Card } from '../../components/ui/Card'
import { IconAlertTriangle, IconArrowRight, IconUser } from '../../components/ui/Icons'
import { useNavigate } from 'react-router-dom'

export function EmployeeDashboard() {
  const { activeEmployeeId } = useRoleStore()
  const { tasks } = useTaskStore()
  const navigate = useNavigate()
  const emp = employees.find(e => e.id === activeEmployeeId)!
  const myTasks = tasks.filter(t => t.employeeId === activeEmployeeId).slice(0, 3)
  const myNotices = consequences.filter(c => c.employeeId === activeEmployeeId && !c.resolved)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,113,227,0.35)]">
            <IconUser size={20} className="text-white" />
          </div>
          <div>
            <h1 className="page-title">Good morning, {emp.name.split(' ')[0]} 👋</h1>
            <p className="text-[#6e6e73] text-[13px] mt-1 font-medium">{emp.role} · {emp.team.charAt(0).toUpperCase() + emp.team.slice(1)} Team · accountability score <span className="text-[#1d1d1f] font-bold">{emp.accountabilityScore}</span></p>
          </div>
        </div>
      </div>

      {/* Top 3-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AccountabilityScore employee={emp} />
        <BonusVestingBar employee={emp} />
        <Card>
          <p className="label-secondary mb-3">30-Day Accountability Trend</p>
          <AccountabilityTrendChart data={emp.accountabilityHistory} height={150} />
        </Card>
      </div>

      {/* Notices */}
      {myNotices.length > 0 && (
        <div className="apple-card kpi-yellow p-4 border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <IconAlertTriangle size={13} className="text-amber-700" />
            </div>
            <span className="text-sm font-semibold text-amber-800">
              {myNotices.length} Active {myNotices.length === 1 ? 'Notice' : 'Notices'}
            </span>
          </div>
          <div className="space-y-2">
            {myNotices.map(c => (
              <div key={c.id} className="text-xs text-amber-800 bg-white/70 rounded-xl p-3 leading-relaxed border border-amber-200">
                <span className="font-semibold">{c.date} — </span>{c.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Active Tasks</h2>
          <button onClick={() => navigate('/employee/tasks')} className="flex items-center gap-1 text-xs text-apple-blue hover:text-apple-blue-hover transition-colors font-semibold">
            View all <IconArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {myTasks.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </div>
    </div>
  )
}
