import { useRoleStore } from '../../store/useRoleStore'
import { employees } from '../../data/employees'
import { MyPnLView } from '../../components/employee/MyPnLView'
import { IconTrendingUp } from '../../components/ui/Icons'

export function MyPnL() {
  const { activeEmployeeId } = useRoleStore()
  const emp = employees.find(e => e.id === activeEmployeeId)!

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-green/10 rounded-2xl flex items-center justify-center">
            <IconTrendingUp size={22} className="text-apple-green" />
          </div>
          <div>
            <h1 className="page-title">P&L Impact</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">See how your work directly affects the company's bottom line.</p>
          </div>
        </div>
      </div>
      <MyPnLView employee={emp} />
    </div>
  )
}
