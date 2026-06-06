import { useState } from 'react'
import { useSimulatorStore } from '../../store/useSimulatorStore'
import { SimulatorOutputChart } from '../charts/SimulatorOutputChart'
import { ERPWebhookPanel } from './ERPWebhookPanel'
import { BASELINE_OUTPUTS } from '../../utils/simulatorEngine'
import { fmt$, fmtPct, exportToCSV } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { IconSave, IconDownload, IconTrash, IconArrowUp, IconArrowDown } from '../ui/Icons'

function Delta({ value, baseline, format = fmt$ }: { value: number; baseline: number; format?: (n: number) => string }) {
  const d = value - baseline
  if (Math.abs(d) < 1) return <span className="text-xs text-label-tertiary">Baseline</span>
  const positive = d > 0
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? 'text-apple-green' : 'text-apple-red'}`}>
      {positive ? <IconArrowUp size={10} /> : <IconArrowDown size={10} />}
      {format(Math.abs(d))}
    </span>
  )
}

function KPICard({ label, value, baseline, format = fmt$ }: { label: string; value: number; baseline: number; format?: (n: number) => string }) {
  return (
    <div className="bg-bg-secondary border border-separator rounded-apple p-4">
      <p className="label-secondary mb-2">{label}</p>
      <p className="text-xl font-bold text-label-primary tracking-tight tabular-nums">{format(value)}</p>
      <div className="mt-1"><Delta value={value} baseline={baseline} format={format} /></div>
    </div>
  )
}

function SliderRow({ label, desc, value, min, max, onChange }: {
  label: string; desc: string; value: number; min: number; max: number; onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-sm font-medium text-label-primary">{label}</p>
          <p className="text-xs text-label-tertiary">{desc}</p>
        </div>
        <span className={`text-sm font-semibold tabular-nums ${value > 0 ? 'text-apple-green' : value < 0 ? 'text-apple-red' : 'text-label-tertiary'}`}>
          {value > 0 ? '+' : ''}{value}%
        </span>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(+e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-[10px] text-label-quaternary">
        <span>{min}%</span><span>0</span><span>+{max}%</span>
      </div>
    </div>
  )
}

export function BottomLineSimulator() {
  const { inputs, outputs, setInput, savedScenarios, saveScenario, loadScenario, deleteScenario } = useSimulatorStore()
  const [scenarioName, setScenarioName] = useState('')

  const handleSave = () => {
    if (!scenarioName.trim()) return
    saveScenario(scenarioName.trim())
    setScenarioName('')
  }

  const handleExport = () => exportToCSV([
    { Metric: 'Total Payroll Cost',    Baseline: BASELINE_OUTPUTS.totalPayrollCost, Scenario: outputs.totalPayrollCost },
    { Metric: 'Projected Revenue',     Baseline: BASELINE_OUTPUTS.projectedRevenue, Scenario: outputs.projectedRevenue },
    { Metric: 'EBITDA',                Baseline: BASELINE_OUTPUTS.ebitda,           Scenario: outputs.ebitda },
    { Metric: 'EBITDA Margin %',       Baseline: (BASELINE_OUTPUTS.ebitdaMargin*100).toFixed(1), Scenario: (outputs.ebitdaMargin*100).toFixed(1) },
    { Metric: 'Revenue per FTE',       Baseline: BASELINE_OUTPUTS.revenuePerFTE,    Scenario: outputs.revenuePerFTE },
    { Metric: 'Payback Period (mo)',   Baseline: BASELINE_OUTPUTS.paybackPeriodMonths, Scenario: outputs.paybackPeriodMonths },
  ], 'earrow-scenario.csv')

  const handleReset = () => {
    setInput('headcountDelta', 0)
    setInput('wageDelta', 0)
    setInput('retentionDelta', 0)
    setInput('productivityDelta', 0)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Left panel — controls */}
      <div className="xl:col-span-2 space-y-4">
        <div className="apple-card p-5 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-label-primary">Scenario Variables</p>
            <button onClick={handleReset} className="text-xs text-apple-blue hover:text-apple-blue-hover transition-colors">Reset</button>
          </div>
          <SliderRow label="Headcount" desc="Adjust total employee count" value={inputs.headcountDelta} min={-50} max={50} onChange={v => setInput('headcountDelta', v)} />
          <SliderRow label="Average Wages" desc="Adjust salary levels across the org" value={inputs.wageDelta} min={-20} max={20} onChange={v => setInput('wageDelta', v)} />
          <SliderRow label="Retention Rate" desc="Affects replacement cost & revenue continuity" value={inputs.retentionDelta} min={-15} max={15} onChange={v => setInput('retentionDelta', v)} />
          <SliderRow label="Productivity" desc="Uplift from new tools or training" value={inputs.productivityDelta} min={-10} max={10} onChange={v => setInput('productivityDelta', v)} />
        </div>

        <div className="apple-card p-5">
          <p className="text-sm font-semibold text-label-primary mb-3">Save Scenario</p>
          <div className="flex gap-2">
            <input
              className="apple-input flex-1"
              placeholder="Name this scenario..."
              value={scenarioName}
              onChange={e => setScenarioName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <Button size="sm" onClick={handleSave} disabled={!scenarioName.trim()}>
              <IconSave size={12} />
            </Button>
          </div>

          {savedScenarios.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {savedScenarios.map(sc => (
                <div key={sc.id} className="flex items-center justify-between bg-bg-elevated rounded-apple px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-label-primary">{sc.name}</p>
                    <p className="text-[11px] text-label-tertiary">EBITDA: {fmt$(sc.outputs.ebitda)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => loadScenario(sc.id)} className="text-[11px] text-apple-blue hover:text-apple-blue-hover transition-colors px-2 py-1">Load</button>
                    <button onClick={() => deleteScenario(sc.id)} className="text-label-tertiary hover:text-apple-red transition-colors p-1">
                      <IconTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — outputs */}
      <div className="xl:col-span-3 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <KPICard label="Total Payroll Cost"   value={outputs.totalPayrollCost}   baseline={BASELINE_OUTPUTS.totalPayrollCost} />
          <KPICard label="Projected Revenue"    value={outputs.projectedRevenue}   baseline={BASELINE_OUTPUTS.projectedRevenue} />
          <KPICard label="EBITDA"               value={outputs.ebitda}             baseline={BASELINE_OUTPUTS.ebitda} />
          <KPICard label="EBITDA Margin"        value={outputs.ebitdaMargin}       baseline={BASELINE_OUTPUTS.ebitdaMargin} format={v => fmtPct(v)} />
          <KPICard label="Revenue per FTE"      value={outputs.revenuePerFTE}      baseline={BASELINE_OUTPUTS.revenuePerFTE} />
          <div className="bg-bg-secondary border border-separator rounded-apple p-4">
            <p className="label-secondary mb-2">Payback Period</p>
            <p className="text-xl font-bold text-label-primary tracking-tight">
              {outputs.paybackPeriodMonths >= 999 ? 'N/A' : `${outputs.paybackPeriodMonths} mo`}
            </p>
            <p className="text-xs text-label-tertiary mt-1">to recoup $50k investment</p>
          </div>
        </div>

        <div className="apple-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-label-primary">Baseline vs Scenario</p>
            <Button size="sm" variant="ghost" onClick={handleExport}>
              <IconDownload size={12} /> Export CSV
            </Button>
          </div>
          <SimulatorOutputChart current={outputs} />
        </div>

        <ERPWebhookPanel inputs={inputs} outputs={outputs} />
      </div>
    </div>
  )
}
