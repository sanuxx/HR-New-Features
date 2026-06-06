interface BadgeProps {
  label: string
  className?: string
  dot?: boolean
}

export function Badge({ label, className = '', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {label}
    </span>
  )
}
