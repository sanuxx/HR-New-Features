import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { ScorePoint } from '../../types'

interface Props {
  data: ScorePoint[]
  height?: number
}

export function AccountabilityTrendChart({ data, height = 180 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0071e3" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="date" tick={{ fill: '#86868b', fontSize: 10, fontFamily: 'system-ui' }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#86868b', fontSize: 10, fontFamily: 'system-ui' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          labelStyle={{ color: '#1d1d1f', fontSize: 12, fontWeight: 600 }}
          formatter={(v) => [`${v}/100`, 'Score']}
        />
        <Area type="monotone" dataKey="score" stroke="#0071e3" fill="url(#blueGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#0071e3' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
