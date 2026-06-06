import { useRoleStore } from '../../store/useRoleStore'
import { PeerRatingResults } from '../../components/manager/PeerRatingResults'
import { IconStar } from '../../components/ui/Icons'

export function PeerRatings() {
  const { activeManagerId } = useRoleStore()

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-yellow/10 rounded-2xl flex items-center justify-center">
            <IconStar size={22} className="text-apple-yellow" />
          </div>
          <div>
            <h1 className="page-title">Peer Ratings</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Aggregated weekly peer feedback for your team. Ratings are anonymous.</p>
          </div>
        </div>
      </div>

      <PeerRatingResults managerId={activeManagerId} />
    </div>
  )
}
