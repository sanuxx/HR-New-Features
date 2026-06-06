const palettes = [
  { bg: 'bg-blue-600',   text: 'text-white' },
  { bg: 'bg-purple-600', text: 'text-white' },
  { bg: 'bg-emerald-600',text: 'text-white' },
  { bg: 'bg-orange-600', text: 'text-white' },
  { bg: 'bg-pink-600',   text: 'text-white' },
  { bg: 'bg-teal-600',   text: 'text-white' },
  { bg: 'bg-indigo-600', text: 'text-white' },
  { bg: 'bg-rose-600',   text: 'text-white' },
]

interface AvatarProps {
  initials: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  index?: number
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

export function Avatar({ initials, size = 'md', index = 0 }: AvatarProps) {
  const palette = palettes[index % palettes.length]
  return (
    <div className={`${sizes[size]} ${palette.bg} ${palette.text} rounded-full flex items-center justify-center font-semibold shrink-0 select-none tracking-tight`}>
      {initials.slice(0, 2)}
    </div>
  )
}
