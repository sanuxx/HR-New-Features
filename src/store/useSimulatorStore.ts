import { create } from 'zustand'
import type { SimulatorInputs, SimulatorOutputs, SavedScenario } from '../types'
import { calculateScenario } from '../utils/simulatorEngine'

const baselineInputs: SimulatorInputs = { headcountDelta: 0, wageDelta: 0, retentionDelta: 0, productivityDelta: 0 }

interface SimulatorStore {
  inputs: SimulatorInputs
  outputs: SimulatorOutputs
  savedScenarios: SavedScenario[]
  setInput: (key: keyof SimulatorInputs, value: number) => void
  saveScenario: (name: string) => void
  loadScenario: (id: string) => void
  deleteScenario: (id: string) => void
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  inputs: baselineInputs,
  outputs: calculateScenario(baselineInputs),
  savedScenarios: [],
  setInput: (key, value) => {
    const newInputs = { ...get().inputs, [key]: value }
    set({ inputs: newInputs, outputs: calculateScenario(newInputs) })
  },
  saveScenario: (name) => {
    const { inputs, outputs } = get()
    const scenario: SavedScenario = {
      id: `sc-${Date.now()}`,
      name,
      inputs: { ...inputs },
      outputs: { ...outputs },
      savedAt: new Date().toISOString(),
    }
    set((s) => ({ savedScenarios: [...s.savedScenarios, scenario] }))
  },
  loadScenario: (id) => {
    const sc = get().savedScenarios.find((s) => s.id === id)
    if (sc) set({ inputs: sc.inputs, outputs: sc.outputs })
  },
  deleteScenario: (id) =>
    set((s) => ({ savedScenarios: s.savedScenarios.filter((sc) => sc.id !== id) })),
}))
