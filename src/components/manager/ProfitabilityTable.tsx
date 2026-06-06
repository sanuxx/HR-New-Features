import { useState } from 'react'
import type { Employee } from '../../types'
import { Modal } from '../ui/Modal'
import { PnLTimelineChart } from '../charts/PnLTimelineChart'
import { fmt$, fmtPct, teamLabel } from '../../utils/formatters'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { IconArrowUp, IconArrowDown, IconMinus, IconDownload } from '../ui/Icons'
import { exportToCSV } from '../../utils/formatters'

interface Props { employees: Employee[] }
type SortKey = 'name' | 'revenueAttributable' | 'fullyLoadedCost' | 'netContribution' | 'lev'

function getLEV(emp: Employee) {
  const standardCost = emp.salary / 12
  return standardCost - emp.fullyLoadedCost
}

const avatarColors = ['bg-blue-600','bg-purple-600','bg-emerald-600','bg-orange-600','bg-pink-600','bg-teal-600','bg-rose-600','bg-indigo-600','bg-yellow-600','bg-cyan-600','bg-lime-600','bg-fuchsia-600','bg-sky-600','bg-amber-600','bg-violet-600']

export function ProfitabilityTable({ employees }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'netContribution', dir: -1 })
  const [selected, setSelected] = useState<Employee | null>(null)

  const sorted = [...employees].sort((a, b) => {
    const aVal = sort.key === 'lev' ? getLEV(a) : a[sort.key as Exclude<SortKey,'lev'>]
    const bVal = sort.key === 'lev' ? getLEV(b) : b[sort.key as Exclude<SortKey,'lev'>]
    return sort.dir * (aVal > bVal ? 1 : -1)
  })
  const toggle = (key: SortKey) => setSort(s => s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 })

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sort.key !== k) return <IconMinus size={11} className="text-label-quaternary" />
    return sort.dir === -1 ? <IconArrowDown size={11} className="text-apple-blue" /> : <IconArrowUp size={11} className="text-apple-blue" />
  }

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="text-left text-[11px] font-semibold text-label-tertiary uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-label-primary transition-colors whitespace-nowrap select-none"
      onClick={() => toggle(k)}
    >
      <span className="flex items-center gap-1">{label} <SortIcon k={k} /></span>
    </th>
  )

  const handleExport = () => exportToCSV(
    sorted.map(e => ({ name: e.name, team: e.team, role: e.role, revenue: e.revenueAttributable, cost: e.fullyLoadedCost, net: e.netContribution })),
    'earrow-profitability.csv'
  )

  return (
    <>
      <div className="overflow-x-auto rounded-apple-lg border border-separator">
        <table className="w-full">
          <thead className="bg-bg-secondary border-b border-separator">
            <tr>
              <Th label="Employee" k="name" />
              <th className="text-left text-[11px] font-semibold text-label-tertiary uppercase tracking-wider px-4 py-3 whitespace-nowrap">Team</th>
              <Th label="Revenue/mo" k="revenueAttributable" />
              <Th label="Cost/mo" k="fullyLoadedCost" />
              <Th label="Net Contribution" k="netContribution" />
              <Th label="LEV" k="lev" />
              <th className="text-left text-[11px] font-semibold text-label-tertiary uppercase tracking-wider px-4 py-3">Trend</th>
              <th className="text-left text-[11px] font-semibold text-label-tertiary uppercase tracking-wider px-4 py-3">Margin</th>
              <th className="px-4 py-3">
                <button onClick={handleExport} className="flex items-center gap-1 text-[11px] font-semibold text-label-tertiary hover:text-apple-blue transition-colors uppercase tracking-wider">
                  <IconDownload size={11} /> Export
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-separator/50">
            {sorted.map((emp, i) => {
              const margin = emp.revenueAttributable > 0 ? emp.netContribution / emp.revenueAttributable : -1
              const sparkData = emp.pnlHistory.slice(-14).map(p => ({ v: p.net }))
              const netPositive = emp.netContribution >= 0
              return (
                <tr
                  key={emp.id}
                  className="hover:bg-bg-secondary cursor-pointer transition-colors group"
                  onClick={() => setSelected(emp)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                        {emp.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-label-primary tracking-tight">{emp.name}</p>
                        <p className="text-xs text-label-tertiary">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-label-tertiary">{teamLabel[emp.team]}</td>
                  <td className="px-4 py-3 text-sm font-medium text-apple-green tabular-nums">{fmt$(emp.revenueAttributable)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-apple-red tabular-nums">{fmt$(emp.fullyLoadedCost)}</td>
                  <td className={`px-4 py-3 text-sm font-bold tabular-nums ${netPositive ? 'text-apple-green' : 'text-apple-red'}`}>{fmt$(emp.netContribution)}</td>
                  <td className="px-4 py-3">
                    {(() => {
                      const lev = getLEV(emp)
                      const levPct = (lev / (emp.salary / 12)) * 100
                      const favorable = lev > 0
                      return (
                        <div>
                          <p className={`text-sm font-medium tabular-nums ${favorable ? 'text-apple-green' : 'text-apple-red'}`}>{fmt$(Math.abs(lev))}</p>
                          <p className={`text-[11px] ${favorable ? 'text-apple-green' : 'text-apple-red'}`}>{favorable ? '▼' : '▲'} {Math.abs(levPct).toFixed(1)}% vs std</p>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <ResponsiveContainer width={80} height={28}>
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="v" stroke={netPositive ? '#30d158' : '#ff453a'} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium tabular-nums ${margin >= 0 ? 'text-apple-green' : 'text-apple-red'}`}>{fmtPct(margin)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-label-tertiary group-hover:text-apple-blue transition-colors">View →</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal
          open title={selected.name}
          subtitle={`${selected.role} · ${teamLabel[selected.team]}`}
          onClose={() => setSelected(null)} wide
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Revenue/mo', value: fmt$(selected.revenueAttributable), color: 'text-apple-green' },
              { label: 'Cost/mo',    value: fmt$(selected.fullyLoadedCost),      color: 'text-apple-red' },
              { label: 'Net',        value: fmt$(selected.netContribution),       color: selected.netContribution >= 0 ? 'text-apple-green' : 'text-apple-red' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-elevated rounded-apple p-4 text-center">
                <p className="label-secondary mb-1">{label}</p>
                <p className={`text-xl font-bold tracking-tight tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <p className="label-secondary mb-3">Revenue vs Cost vs Net — Last 30 Days</p>
          <PnLTimelineChart data={selected.pnlHistory} height={280} />
        </Modal>
      )}
    </>
  )
}
