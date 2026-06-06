import { create } from 'zustand'
import type { MentorshipSession } from '../types'

interface MentorshipStore {
  sessions: MentorshipSession[]
  pendingCredits: Record<string, number>
  submitSession: (session: MentorshipSession) => void
  confirmSession: (sessionId: string) => void
}

export const useMentorshipStore = create<MentorshipStore>((set, get) => ({
  sessions: [],
  pendingCredits: {},

  submitSession: (session) =>
    set((s) => ({ sessions: [session, ...s.sessions] })),

  confirmSession: (sessionId) => {
    const { sessions } = get()
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return
    set((s) => ({
      sessions: s.sessions.map(ss => ss.id === sessionId ? { ...ss, confirmed: true } : ss),
      pendingCredits: {
        ...s.pendingCredits,
        [session.employeeId]: (s.pendingCredits[session.employeeId] ?? 0) + session.creditsEarned,
      },
    }))
  },
}))
