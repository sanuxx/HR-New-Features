import type { SimulatorInputs, SimulatorOutputs } from '../types'

const BASELINE = {
  headcount: 18,
  avgAnnualWage: 87000,
  monthlyRevenue: 409000,
  fixedMonthlyCosts: 45000,
  implementationCost: 50000,
  fullyLoadedMultiplier: 1.4,
}

export function calculateScenario(inputs: SimulatorInputs): SimulatorOutputs {
  const { headcountDelta, wageDelta, retentionDelta, productivityDelta } = inputs

  const adjustedHeadcount = BASELINE.headcount * (1 + headcountDelta / 100)
  const adjustedMonthlyWage = (BASELINE.avgAnnualWage / 12) * (1 + wageDelta / 100)
  const totalPayrollCost = Math.round(
    adjustedHeadcount * adjustedMonthlyWage * BASELINE.fullyLoadedMultiplier
  )

  const retentionMultiplier = 1 + (retentionDelta / 100) * 0.3
  const productivityMultiplier = 1 + productivityDelta / 100
  const projectedRevenue = Math.round(
    BASELINE.monthlyRevenue * retentionMultiplier * productivityMultiplier
  )

  const ebitda = projectedRevenue - totalPayrollCost - BASELINE.fixedMonthlyCosts
  const ebitdaMargin = projectedRevenue > 0 ? ebitda / projectedRevenue : 0

  const baselineEbitda =
    BASELINE.monthlyRevenue -
    BASELINE.headcount * (BASELINE.avgAnnualWage / 12) * BASELINE.fullyLoadedMultiplier -
    BASELINE.fixedMonthlyCosts
  const ebitdaDelta = ebitda - baselineEbitda
  const paybackPeriodMonths =
    ebitdaDelta > 0 ? Math.ceil(BASELINE.implementationCost / ebitdaDelta) : 999

  const revenuePerFTE = adjustedHeadcount > 0 ? Math.round(projectedRevenue / adjustedHeadcount) : 0

  return { totalPayrollCost, projectedRevenue, ebitda, ebitdaMargin, paybackPeriodMonths, revenuePerFTE }
}

export const BASELINE_OUTPUTS = calculateScenario({ headcountDelta: 0, wageDelta: 0, retentionDelta: 0, productivityDelta: 0 })
