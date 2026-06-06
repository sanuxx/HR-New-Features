import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import type { PnLPoint } from '../../types'
import { fmt$ } from '../../utils/formatters'

interface Props {
  data: PnLPoint[]
  height?: number
}

export function PnLTimelineChart({ data, height = 260 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="date" tick={{ fill: '#86868b', fontSize: 10, fontFamily: 'system-ui' }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#86868b', fontSize: 10, fontFamily: 'system-ui' }} tickFormatter={fmt$} width={72} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          labelStyle={{ color: '#1d1d1f', fontSize: 12, fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ fontSize: 12, fontFamily: 'system-ui' }}
          formatter={(val) => [fmt$(val as number), '']}
        />
        <Legend wrapperStyle={{ color: '#6e6e73', fontSize: 12, paddingTop: 8 }} />
        <Line type="monotone" dataKey="revenue" stroke="#1d8348" strokeWidth={2} dot={false} name="Revenue" activeDot={{ r: 4, fill: '#1d8348' }} />
        <Line type="monotone" dataKey="cost"    stroke="#d93025" strokeWidth={2} dot={false} name="Cost"    activeDot={{ r: 4, fill: '#d93025' }} />
        <Line type="monotone" dataKey="net"     stroke="#0071e3" strokeWidth={2} dot={false} name="Net"     activeDot={{ r: 4, fill: '#0071e3' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
