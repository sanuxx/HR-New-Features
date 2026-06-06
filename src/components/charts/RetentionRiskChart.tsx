import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ZAxis } from 'recharts'
import { employees } from '../../data/employees'

export function RetentionRiskChart({ height = 260 }: { height?: number }) {
  const data = employees.map(e => ({
    name: e.name,
    x: e.accountabilityScore,
    y: e.retentionRisk,
    z: e.salary / 10000,
    fill: e.retentionRisk >= 75 ? '#d93025' : e.retentionRisk >= 50 ? '#f59e0b' : '#1d8348',
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="x" name="Accountability Score" type="number" domain={[0, 100]}
          label={{ value: 'Accountability Score', position: 'insideBottom', offset: -12, fill: '#86868b', fontSize: 11 }}
          tick={{ fill: '#86868b', fontSize: 10 }} axisLine={false} tickLine={false}
        />
        <YAxis
          dataKey="y" name="Retention Risk %" type="number" domain={[0, 100]}
          label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: '#86868b', fontSize: 11 }}
          tick={{ fill: '#86868b', fontSize: 10 }} axisLine={false} tickLine={false}
        />
        <ZAxis dataKey="z" range={[40, 160]} />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0,0,0,0.15)' }}
          content={({ payload }) => {
            if (!payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="bg-white border border-separator rounded-apple p-3 shadow-apple text-xs">
                <p className="font-semibold text-label-primary mb-1">{d.name}</p>
                <p className="text-label-secondary">Accountability: {d.x}</p>
                <p className="text-label-secondary">Risk: {d.y}%</p>
              </div>
            )
          }}
        />
        <Scatter data={data} shape={(props: any) => {
          const { cx, cy, payload } = props
          return <circle cx={cx} cy={cy} r={7} fill={payload.fill} fillOpacity={0.85} stroke={payload.fill} strokeOpacity={0.2} strokeWidth={6} />
        }} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
