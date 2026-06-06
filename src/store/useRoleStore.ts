import { create } from 'zustand'
import type { AppRole } from '../types'

interface RoleStore {
  role: AppRole
  activeEmployeeId: string
  activeManagerId: string
  setRole: (role: AppRole) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: 'employee',
  activeEmployeeId: 'emp-alex',
  activeManagerId: 'mgr-sarah',
  setRole: (role) => set({ role }),
}))
