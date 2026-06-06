import { RoleSwitcher } from '../components/ui/RoleSwitcher'
import { useRoleStore } from '../store/useRoleStore'
import { Avatar } from '../components/ui/Avatar'
import { IconMenu } from '../components/ui/Icons'

const personas = {
  employee: { name: 'Alex Chen',      initials: 'AC', index: 0 },
  manager:  { name: 'Sarah Johnson',  initials: 'SJ', index: 2 },
  cfo:      { name: 'David Park',     initials: 'DP', index: 3 },
}

const roleColors = {
  employee: 'text-[#0071e3]',
  manager:  'text-[#9b59b6]',
  cfo:      'text-[#1d8348]',
}

interface HeaderProps { onMenuToggle: () => void }

export function Header({ onMenuToggle }: HeaderProps) {
  const { role } = useRoleStore()
  const persona = personas[role]

  return (
    <header className="h-14 bg-white/95 backdrop-blur-sm border-b border-black/[0.07] flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#6e6e73] hover:bg-[#f5f5f7] active:bg-[#e8e8ed] transition-colors"
        >
          <IconMenu size={16} />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0071e3] to-[#5856d6] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,113,227,0.35)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#1d1d1f] tracking-tight">EARROW</span>
              <span className="text-[13px] font-light text-[#86868b] tracking-tight">HR</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-[#0071e3] to-[#5856d6] text-transparent bg-clip-text border border-[#0071e3]/25 px-1.5 py-0.5 rounded-full leading-tight">v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center — live indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f5f5f7] rounded-full border border-black/[0.06]">
        <div className="live-dot" />
        <span className="text-[11px] font-semibold text-[#1d1d1f] tracking-tight">Live · Q2 2026</span>
      </div>

      <div className="flex items-center gap-3">
        <RoleSwitcher />
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-black/[0.07]">
          <Avatar initials={persona.initials} size="sm" index={persona.index} />
          <div>
            <p className="text-xs font-semibold text-[#1d1d1f] tracking-tight leading-tight">{persona.name}</p>
            <p className={`text-[10px] font-semibold capitalize leading-tight ${roleColors[role]}`}>{role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
