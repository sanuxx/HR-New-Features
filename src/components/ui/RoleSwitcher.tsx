import { useNavigate } from 'react-router-dom'
import { useRoleStore } from '../../store/useRoleStore'
import type { AppRole } from '../../types'
import { IconUser, IconUsers, IconBarChart } from './Icons'

const roles: { value: AppRole; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'employee', label: 'Employee', Icon: IconUser },
  { value: 'manager',  label: 'Manager',  Icon: IconUsers },
  { value: 'cfo',      label: 'CFO',      Icon: IconBarChart },
]

export function RoleSwitcher() {
  const { role, setRole } = useRoleStore()
  const navigate = useNavigate()

  const handleSwitch = (r: AppRole) => {
    setRole(r)
    navigate(r === 'employee' ? '/employee/dashboard' : r === 'manager' ? '/manager/dashboard' : '/cfo/dashboard')
  }

  return (
    <div className="flex items-center bg-bg-tertiary border border-separator rounded-[10px] p-1 gap-0.5">
      {roles.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => handleSwitch(value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all duration-150 ${
            role === value
              ? 'bg-white text-label-primary shadow-apple-sm'
              : 'text-label-secondary hover:text-label-primary'
          }`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}
