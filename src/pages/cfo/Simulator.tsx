import { BottomLineSimulator } from '../../components/cfo/BottomLineSimulator'
import { IconSliders } from '../../components/ui/Icons'

export function Simulator() {
  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-blue/10 rounded-2xl flex items-center justify-center">
            <IconSliders size={22} className="text-apple-blue" />
          </div>
          <div>
            <h1 className="page-title">P&L Simulator</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Model workforce scenarios and observe real-time bottom-line impact.</p>
          </div>
        </div>
      </div>
      <BottomLineSimulator />
    </div>
  )
}
