import { useState } from 'react'
import { useRoleStore } from '../../store/useRoleStore'
import { employees } from '../../data/employees'
import { mentorshipCredits } from '../../data/mentorship'
import { useMentorshipStore } from '../../store/useMentorshipStore'
import { useToastStore } from '../../store/useToastStore'
import { BonusVestingBar } from '../../components/employee/BonusVestingBar'
import { PeerRatingPrompt } from '../../components/employee/PeerRatingPrompt'
import { ReverseMentorshipModal } from '../../components/employee/ReverseMentorshipModal'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { IconBook, IconActivity, IconCreditCard, IconStar, IconUsers, IconAward, IconPlus, IconCheck, IconClock } from '../../components/ui/Icons'
import type { MentorshipSession } from '../../types'

const perks = [
  { label: 'Learning Budget', value: '$500 credit', cost: 50, Icon: IconBook },
  { label: 'Early Friday',    value: 'Leave at 2 PM', cost: 20, Icon: IconActivity },
  { label: 'Gift Card',       value: '$100 voucher',  cost: 10, Icon: IconCreditCard },
]

export function Gamification() {
  const { activeEmployeeId } = useRoleStore()
  const emp = employees.find(e => e.id === activeEmployeeId)!
  const { sessions, pendingCredits, submitSession, confirmSession } = useMentorshipStore()
  const { show: toast } = useToastStore()
  const [showModal, setShowModal] = useState(false)
  const [redeemed, setRedeemed] = useState<string[]>([])

  const myCredits = emp.mentorshipCredits + (pendingCredits[activeEmployeeId] ?? 0)
  const mySessions = sessions.filter(s => s.employeeId === activeEmployeeId)

  const handleSubmit = (session: MentorshipSession) => {
    submitSession(session)
    toast(`✓ Session submitted to ${session.seniorName} for confirmation`, 'success')
  }

  return (
    <div className="space-y-6">
      <div className="page-hero">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-apple-purple/10 rounded-2xl flex items-center justify-center">
            <IconAward size={22} className="text-apple-purple" />
          </div>
          <div>
            <h1 className="page-title">Rewards & Growth</h1>
            <p className="text-label-secondary text-[14px] mt-0.5">Mentorship credits, peer ratings, and bonus vesting.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BonusVestingBar employee={emp} />

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="label-secondary flex items-center gap-1.5"><IconUsers size={13} /> Mentorship Credits</p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-apple-blue/15 text-apple-blue border border-apple-blue/25 rounded-full text-sm font-bold">
                {myCredits}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-xs text-apple-blue hover:underline"
              >
                <IconPlus size={11} /> Log session
              </button>
            </div>
          </div>

          {mySessions.length > 0 && (
            <div className="space-y-2 mb-3">
              {mySessions.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-bg-elevated rounded-apple px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-label-primary leading-tight">{s.topic}</p>
                    <p className="text-xs text-label-tertiary mt-0.5">Taught {s.seniorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.confirmed ? (
                      <span className="flex items-center gap-1 text-xs text-apple-green font-medium"><IconCheck size={11} /> +{s.creditsEarned}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-apple-yellow"><IconClock size={11} /> Pending</span>
                        <button
                          onClick={() => {
                            confirmSession(s.id)
                            toast(`✓ Session confirmed — +${s.creditsEarned} credits awarded!`, 'success')
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border border-apple-green/30 text-apple-green hover:bg-apple-green/10 transition-colors"
                        >
                          Simulate confirm
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {mentorshipCredits.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-bg-elevated rounded-apple px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-label-primary leading-tight">{c.topic}</p>
                  <p className="text-xs text-label-tertiary mt-0.5">Taught {c.seniorName}</p>
                </div>
                <span className="text-apple-blue font-semibold text-sm">+{c.credits}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold text-label-primary tracking-tight mb-4">Redeem Credits</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {perks.map(({ label, value, cost, Icon }) => {
            const canRedeem = myCredits >= cost && !redeemed.includes(label)
            const isRedeemed = redeemed.includes(label)
            return (
              <div key={label} className={`bg-bg-elevated rounded-apple-lg p-4 flex flex-col items-center text-center border ${canRedeem ? 'border-apple-blue/20' : 'border-separator'} ${isRedeemed ? 'opacity-60' : ''}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${canRedeem ? 'bg-apple-blue/15 text-apple-blue' : 'bg-bg-hover text-label-tertiary'}`}>
                  <Icon size={18} />
                </div>
                <p className="text-sm font-semibold text-label-primary tracking-tight">{label}</p>
                <p className="text-xs text-label-tertiary mb-1">{value}</p>
                <p className="text-xs text-label-tertiary mb-3">{cost} credits required</p>
                <Button
                  size="sm"
                  variant={canRedeem ? 'primary' : 'secondary'}
                  disabled={!canRedeem}
                  className="w-full"
                  onClick={() => {
                    setRedeemed(r => [...r, label])
                    toast(`✨ Redeemed: ${label} — check your email!`, 'success')
                  }}
                >
                  {isRedeemed ? '✓ Redeemed' : canRedeem ? 'Redeem' : 'Insufficient credits'}
                </Button>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="label-secondary flex items-center gap-1.5"><IconStar size={13} /> Your Peer Rating</p>
          <div className="text-right">
            <span className="text-2xl font-bold text-label-primary tracking-tight">{emp.peerRatingAvg.toFixed(1)}</span>
            <span className="text-xs text-label-tertiary ml-1">/ 5.0</span>
          </div>
        </div>
        <div className="flex gap-1 mb-1.5">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(emp.peerRatingAvg) ? 'bg-apple-blue' : 'bg-bg-elevated'}`} />
          ))}
        </div>
        <p className="text-xs text-label-tertiary">Average over last 4 weeks — visible only to your manager</p>
      </Card>

      <PeerRatingPrompt />

      <ReverseMentorshipModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        employeeId={activeEmployeeId}
      />
    </div>
  )
}
