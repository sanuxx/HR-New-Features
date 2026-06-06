import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { employees } from '../../data/employees'
import { IconCheck } from '../ui/Icons'

const peers = employees.filter(e => e.managerId === 'mgr-sarah' && e.id !== 'emp-alex').slice(0, 3)

const avatarColors = ['bg-purple-600', 'bg-teal-600', 'bg-orange-600']

export function PeerRatingPrompt() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <Card className="text-center py-10">
        <div className="w-12 h-12 bg-apple-green/15 rounded-full flex items-center justify-center mx-auto mb-3">
          <IconCheck size={22} strokeWidth={2} className="text-apple-green" />
        </div>
        <p className="text-base font-semibold text-label-primary tracking-tight">Ratings submitted</p>
        <p className="text-sm text-label-secondary mt-1">Your feedback helps the team grow. Next prompt: next Monday.</p>
      </Card>
    )
  }

  return (
    <Card>
      <p className="text-sm font-semibold text-label-primary tracking-tight mb-0.5">Weekly Peer Rating</p>
      <p className="label-secondary mb-5">Rate your teammates' effort-to-value this week</p>

      <div className="space-y-4">
        {peers.map((peer, i) => (
          <div key={peer.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${avatarColors[i]}`}>
                {peer.initials}
              </div>
              <span className="text-sm text-label-primary truncate">{peer.name}</span>
            </div>
            <div className="flex gap-1 shrink-0">
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  onClick={() => setRatings(r => ({ ...r, [peer.id]: s }))}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-100 ${
                    ratings[peer.id] === s
                      ? 'bg-apple-blue text-white shadow-apple-sm'
                      : ratings[peer.id] && ratings[peer.id] > s
                        ? 'bg-apple-blue/20 text-apple-blue'
                        : 'bg-bg-elevated text-label-secondary hover:bg-bg-hover'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-separator">
        <Button
          className="w-full"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(ratings).length < peers.length}
        >
          Submit Ratings
        </Button>
        <p className="text-xs text-label-tertiary text-center mt-2">Responses are anonymous and visible only to your manager</p>
      </div>
    </Card>
  )
}
