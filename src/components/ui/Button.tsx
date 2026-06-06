import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

const variants = {
  primary:   'bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#005dc4] text-white shadow-[0_1px_3px_rgba(0,113,227,0.35)] hover:shadow-[0_3px_10px_rgba(0,113,227,0.4)] active:shadow-none',
  secondary: 'bg-white hover:bg-[#f5f5f7] active:bg-[#e8e8ed] text-[#1d1d1f] border border-[rgba(0,0,0,0.12)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
  danger:    'bg-[#ff3b30] hover:bg-[#ff453a] active:bg-[#d70015] text-white shadow-[0_1px_3px_rgba(255,59,48,0.35)]',
  ghost:     'bg-transparent hover:bg-[rgba(0,0,0,0.05)] active:bg-[rgba(0,0,0,0.08)] text-[#6e6e73] hover:text-[#1d1d1f] border border-[rgba(0,0,0,0.10)]',
  success:   'bg-[#1c7c3c] hover:bg-[#1d8348] active:bg-[#145a2c] text-white shadow-[0_1px_3px_rgba(28,124,60,0.35)]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-[13px] rounded-[10px] gap-2',
  lg: 'px-6 py-2.5 text-[15px] rounded-xl gap-2',
}

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-semibold tracking-tight
        transition-all duration-150
        active:scale-[0.96]
        disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none
        select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}
