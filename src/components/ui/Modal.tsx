import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { IconX } from './Icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, subtitle, children, wide }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${wide ? 'max-w-5xl' : 'max-w-2xl'} max-h-[88vh] flex flex-col bg-white border border-separator rounded-apple-xl shadow-apple-lg overflow-hidden`}>
        <div className="flex items-start justify-between p-6 border-b border-separator shrink-0">
          <div>
            <h2 className="text-[17px] font-semibold text-label-primary tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-label-secondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-elevated hover:bg-bg-hover flex items-center justify-center text-label-secondary hover:text-label-primary transition-colors ml-4 shrink-0"
          >
            <IconX size={14} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
