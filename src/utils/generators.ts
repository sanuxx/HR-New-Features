import type { PnLPoint, ScorePoint } from '../types'

export function generatePnLHistory(baseRevenue: number, baseCost: number, days = 30): PnLPoint[] {
  const points: PnLPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const jitter = () => (Math.random() - 0.5) * 0.15
    const revenue = Math.round(baseRevenue * (1 + jitter()))
    const cost = Math.round(baseCost * (1 + jitter() * 0.05))
    points.push({ date: date.toISOString().split('T')[0], revenue, cost, net: revenue - cost })
  }
  return points
}

export function generateScoreHistory(baseScore: number, days = 30): ScorePoint[] {
  const points: ScorePoint[] = []
  let current = baseScore
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    current = Math.max(20, Math.min(100, current + (Math.random() - 0.48) * 4))
    points.push({ date: date.toISOString().split('T')[0], score: Math.round(current) })
  }
  return points
}
