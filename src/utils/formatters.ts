export const fmt$ = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const fmtPct = (n: number, decimals = 1) => `${(n * 100).toFixed(decimals)}%`

export const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n)

export const riskColor = (score: number) => {
  if (score >= 75) return 'text-apple-red'
  if (score >= 50) return 'text-apple-yellow'
  return 'text-apple-green'
}

export const riskBg = (score: number) => {
  if (score >= 75) return 'bg-red-50 text-apple-red border border-red-200'
  if (score >= 50) return 'bg-amber-50 text-amber-700 border border-amber-200'
  return 'bg-green-50 text-apple-green border border-green-200'
}

export const scoreColor = (score: number) => {
  if (score >= 75) return 'text-apple-green'
  if (score >= 50) return 'text-apple-yellow'
  return 'text-apple-red'
}

export const netColor = (net: number) => (net >= 0 ? 'text-apple-green' : 'text-apple-red')

export const statusBadge: Record<string, string> = {
  pending:      'bg-gray-100 text-gray-600 border border-gray-200',
  'in-progress':'bg-blue-50 text-apple-blue border border-blue-200',
  submitted:    'bg-amber-50 text-amber-700 border border-amber-200',
  'under-review':'bg-purple-50 text-purple-700 border border-purple-200',
  approved:     'bg-green-50 text-apple-green border border-green-200',
  rejected:     'bg-red-50 text-apple-red border border-red-200',
  late:         'bg-red-50 text-apple-red border border-red-200',
}

export function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0]).join(',')
  const body = rows.map((r) => Object.values(r).join(',')).join('\n')
  const blob = new Blob([headers + '\n' + body], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const teamLabel: Record<string, string> = { alpha: 'Team Alpha', beta: 'Team Beta', gamma: 'Team Gamma' }

export function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function timeUntil(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now()
  if (diff < 0) return 'Overdue'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m left`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h left`
  return `${Math.floor(hrs / 24)}d left`
}
