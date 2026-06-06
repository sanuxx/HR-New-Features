import { NavLink } from 'react-router-dom'
import { useRoleStore } from '../store/useRoleStore'
import {
  IconHome, IconCheckSquare, IconTrendingUp, IconAward,
  IconClipboard, IconZap, IconBell, IconDollarSign,
  IconMap, IconSliders, IconBarChart, IconStar
} from '../components/ui/Icons'

const employeeNav = [
  { to: '/employee/dashboard',    label: 'Dashboard',       Icon: IconHome },
  { to: '/employee/tasks',        label: 'My Tasks',         Icon: IconCheckSquare },
  { to: '/employee/pnl',          label: 'P&L Impact',       Icon: IconTrendingUp },
  { to: '/employee/gamification', label: 'Rewards & Growth', Icon: IconAward },
]

const managerNav = [
  { to: '/manager/dashboard',     label: 'Dashboard',        Icon: IconHome },
  { to: '/manager/tasks',         label: 'Task Management',  Icon: IconClipboard },
  { to: '/manager/consequences',  label: 'Quality Engine',   Icon: IconZap },
  { to: '/manager/retention',     label: 'Retention Risk',   Icon: IconBell },
  { to: '/manager/profitability', label: 'Profitability',    Icon: IconDollarSign },
  { to: '/manager/peer-ratings',  label: 'Peer Ratings',     Icon: IconStar },
]

const cfoNav = [
  { to: '/cfo/dashboard',  label: 'Dashboard',    Icon: IconHome },
  { to: '/cfo/analytics',  label: 'Org Analytics',Icon: IconMap },
  { to: '/cfo/simulator',  label: 'P&L Simulator',Icon: IconSliders },
  { to: '/cfo/retention',  label: 'Retention',    Icon: IconBarChart },
]

const roleConfig = {
  employee: { label: 'Employee', color: 'bg-[#0071e3]', textColor: 'text-[#0071e3]', bg: 'bg-[#0071e3]/8' },
  manager:  { label: 'Manager',  color: 'bg-[#9b59b6]', textColor: 'text-[#9b59b6]', bg: 'bg-[#9b59b6]/8' },
  cfo:      { label: 'CFO',      color: 'bg-[#1d8348]', textColor: 'text-[#1d8348]', bg: 'bg-[#1d8348]/8' },
}

interface SidebarProps { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: SidebarProps) {
  const { role } = useRoleStore()
  const nav = role === 'employee' ? employeeNav : role === 'manager' ? managerNav : cfoNav
  const cfg = roleConfig[role]

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed lg:static top-0 left-0 h-full z-30 lg:z-auto w-60 bg-white border-r border-black/[0.07] flex flex-col transition-transform duration-200 ease-out shadow-[2px_0_24px_rgba(0,0,0,0.06)] ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>

        {/* Mobile header */}
        <div className="h-14 flex items-center px-5 border-b border-black/[0.07] lg:hidden">
          <span className="text-sm font-bold text-[#1d1d1f]">EARROW HR</span>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-5 pb-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${cfg.bg}`}>
            <div className={`w-2 h-2 rounded-full ${cfg.color} flex-shrink-0`} />
            <span className={`text-[11px] font-bold uppercase tracking-[0.06em] ${cfg.textColor}`}>
              {cfg.label} View
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {nav.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-black/[0.06]">
          <div className="rounded-xl overflow-hidden border border-black/[0.07]">
            <div className="bg-gradient-to-br from-[#0071e3]/8 to-[#5856d6]/8 px-3 py-2.5">
              <p className="text-[10px] font-bold text-[#1d1d1f] uppercase tracking-[0.07em]">Accountability Suite</p>
              <p className="text-[11px] text-[#86868b] mt-0.5 font-medium">EARROW HR Platform</p>
            </div>
            <div className="bg-white px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#aeaeb2] uppercase tracking-wider">Version</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-[#0071e3] to-[#5856d6] text-transparent bg-clip-text">v2.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
