import { create } from 'zustand'
import type { PeerRating } from '../types'

const currentWeek = new Date().toISOString().split('T')[0].slice(0, 7)

const seedRatings: PeerRating[] = [
  { id: 'pr-001', fromEmployeeId: 'emp-maya', toEmployeeId: 'emp-alex', score: 4, week: currentWeek },
  { id: 'pr-002', fromEmployeeId: 'emp-liam', toEmployeeId: 'emp-alex', score: 4, week: currentWeek },
  { id: 'pr-003', fromEmployeeId: 'emp-zoe', toEmployeeId: 'emp-alex', score: 5, week: currentWeek },
  { id: 'pr-004', fromEmployeeId: 'emp-alex', toEmployeeId: 'emp-maya', score: 5, week: currentWeek },
  { id: 'pr-005', fromEmployeeId: 'emp-liam', toEmployeeId: 'emp-maya', score: 5, week: currentWeek },
  { id: 'pr-006', fromEmployeeId: 'emp-zoe', toEmployeeId: 'emp-maya', score: 4, week: currentWeek },
  { id: 'pr-007', fromEmployeeId: 'emp-alex', toEmployeeId: 'emp-liam', score: 4, week: currentWeek },
  { id: 'pr-008', fromEmployeeId: 'emp-maya', toEmployeeId: 'emp-jordan', score: 3, week: currentWeek },
  { id: 'pr-009', fromEmployeeId: 'emp-alex', toEmployeeId: 'emp-jordan', score: 2, week: currentWeek },
  { id: 'pr-010', fromEmployeeId: 'emp-liam', toEmployeeId: 'emp-jordan', score: 3, week: currentWeek },
  { id: 'pr-011', fromEmployeeId: 'emp-priya', toEmployeeId: 'emp-aisha', score: 5, week: currentWeek },
  { id: 'pr-012', fromEmployeeId: 'emp-aisha', toEmployeeId: 'emp-priya', score: 5, week: currentWeek },
  { id: 'pr-013', fromEmployeeId: 'emp-ethan', toEmployeeId: 'emp-sofia', score: 2, week: currentWeek },
  { id: 'pr-014', fromEmployeeId: 'emp-sofia', toEmployeeId: 'emp-priya', score: 4, week: currentWeek },
  { id: 'pr-015', fromEmployeeId: 'emp-noah', toEmployeeId: 'emp-aisha', score: 4, week: currentWeek },
]

interface PeerRatingStore {
  ratings: PeerRating[]
  submitRating: (rating: PeerRating) => void
  getEmployeeAvg: (empId: string) => number
  getEmployeeRatings: (empId: string) => PeerRating[]
  hasRatedThisWeek: (fromEmpId: string, toEmpId: string) => boolean
}

export const usePeerRatingStore = create<PeerRatingStore>((set, get) => ({
  ratings: seedRatings,

  submitRating: (rating) =>
    set((s) => {
      const filtered = s.ratings.filter(
        r => !(r.fromEmployeeId === rating.fromEmployeeId && r.toEmployeeId === rating.toEmployeeId && r.week === rating.week)
      )
      return { ratings: [...filtered, rating] }
    }),

  getEmployeeAvg: (empId) => {
    const { ratings } = get()
    const mine = ratings.filter(r => r.toEmployeeId === empId)
    if (!mine.length) return 0
    return mine.reduce((s, r) => s + r.score, 0) / mine.length
  },

  getEmployeeRatings: (empId) => get().ratings.filter(r => r.toEmployeeId === empId),

  hasRatedThisWeek: (fromEmpId, toEmpId) => {
    const week = new Date().toISOString().split('T')[0].slice(0, 7)
    return get().ratings.some(r => r.fromEmployeeId === fromEmpId && r.toEmployeeId === toEmpId && r.week === week)
  },
}))
