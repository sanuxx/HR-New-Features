import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { IconArrowRight, IconCheck, IconInfo } from '../ui/Icons'
import type { SimulatorInputs, SimulatorOutputs } from '../../types'
import { fmtPct } from '../../utils/formatters'

interface Props {
  inputs: SimulatorInputs
  outputs: SimulatorOutputs
}

export function ERPWebhookPanel({ inputs, outputs }: Props) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [lastSent, setLastSent] = useState<string | null>(null)

  const payload = {
    source: 'earrow-hr-simulator',
    timestamp: new Date().toISOString(),
    scenario: {
      inputs,
      outputs: {
        totalPayrollCost: outputs.totalPayrollCost,
        projectedRevenue: outputs.projectedRevenue,
        ebitda: outputs.ebitda,
        ebitdaMargin: fmtPct(outputs.ebitdaMargin),
        revenuePerFTE: outputs.revenuePerFTE,
        paybackPeriodMonths: outputs.paybackPeriodMonths,
      },
    },
  }

  const handlePush = async () => {
    if (!url.trim()) return
    setStatus('sending')
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      })
      setStatus('success')
      setLastSent(new Date().toLocaleTimeString())
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <IconArrowRight size={15} className="text-apple-blue" />
        <p className="text-sm font-semibold text-label-primary">Push to ERP Webhook</p>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          className="apple-input flex-1"
          placeholder="https://your-erp.example.com/api/workforce-scenario"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button
          onClick={handlePush}
          disabled={!url.trim() || status === 'sending'}
          size="sm"
        >
          {status === 'sending' ? 'Sending…' : status === 'success' ? <><IconCheck size={12} /> Sent</> : 'Push'}
        </Button>
      </div>

      {lastSent && status === 'success' && (
        <p className="text-xs text-apple-green mb-2">Successfully pushed at {lastSent}</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-apple-red mb-2">Push failed — check the URL and CORS settings.</p>
      )}

      <details className="group">
        <summary className="flex items-center gap-1.5 text-xs text-label-tertiary cursor-pointer hover:text-label-secondary transition-colors select-none">
          <IconInfo size={11} />
          Preview payload
        </summary>
        <pre className="mt-2 bg-bg-elevated rounded-apple p-3 text-[11px] text-label-secondary overflow-x-auto leading-relaxed">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </details>

      <p className="text-[11px] text-label-quaternary mt-3">
        Scenario data is sent as a POST request with <code className="bg-bg-elevated px-1 rounded">application/json</code>.
        Compatible with Workday, SAP SuccessFactors, and custom REST endpoints.
      </p>
    </Card>
  )
}
