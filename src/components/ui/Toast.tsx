import { useToastStore } from '../../store/useToastStore'
import { IconCheck, IconAlertTriangle, IconInfo, IconX } from './Icons'

export function Toast() {
  const { toasts, remove } = useToastStore()

  const config = {
    success: {
      icon: <IconCheck size={15} strokeWidth={2.5} />,
      bg: 'bg-[#1c7c3c]',
      border: 'border-[#145a2c]',
    },
    error: {
      icon: <IconAlertTriangle size={15} />,
      bg: 'bg-[#d93025]',
      border: 'border-[#b22823]',
    },
    info: {
      icon: <IconInfo size={15} />,
      bg: 'bg-[#1d1d1f]',
      border: 'border-[#333]',
    },
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
      {toasts.map(toast => {
        const c = config[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-[0_8px_32px_rgba(0,0,0,0.22)] ${c.bg} ${c.border} pointer-events-auto fade-in max-w-xs`}
          >
            <div className="text-white/90 shrink-0">{c.icon}</div>
            <p className="text-[13px] font-medium text-white leading-tight flex-1">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="text-white/60 hover:text-white transition-colors shrink-0 p-0.5"
            >
              <IconX size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
