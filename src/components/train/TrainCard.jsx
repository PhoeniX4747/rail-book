import { ArrowRight, Clock3, ShieldCheck, Sparkles, UsersRound, WalletCards } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'

const badgeIcons = {
  'Best overall': Sparkles,
  'Best value': WalletCards,
  'Lowest fare': WalletCards,
  Fastest: Clock3,
  'Family friendly': UsersRound,
  'Popular choice': Sparkles,
}

export default function TrainCard({ train, recommendation, showReason = false }) {
  const navigate = useNavigate()
  const { setSelectedTrain } = useBooking()
  const BadgeIcon = badgeIcons[train.badge] || Sparkles
  const availabilityLabel = train.availabilityType === 'waitlist' ? 'Waiting list' : train.availabilityType === 'rac' ? 'RAC' : 'Seats available'

  const chooseTrain = () => {
    setSelectedTrain(train)
    navigate(`/trains/${train.id}`)
  }

  return (
    <article className={`train-card ${recommendation?.rank === 1 ? 'train-card--recommended' : ''}`}>
      <div className="train-card-topline">
        <span className="train-number">{train.number}</span>
        <span className={`status-pill status-pill--${train.availabilityType}`}>{train.days}</span>
        {recommendation?.rank === 1 && <span className="best-match"><Sparkles size={14} /> Best match for you</span>}
      </div>
      <div className="train-title-row">
        <div>
          <div className="train-name-line"><h3>{train.name}</h3><span className="badge"><BadgeIcon size={14} /> {train.badge}</span></div>
          <p>{train.fromCode} to {train.toCode} · {train.classes.join(' · ')}</p>
        </div>
        <div className="fare"><span>from</span><strong>₹{train.fare}</strong><small>/ traveler</small></div>
      </div>
      <div className="journey-line" aria-label={`${train.departure} to ${train.arrival}`}>
        <div><strong>{train.departure}</strong><span>{train.from}</span></div>
        <div className="journey-track"><span></span><small>{train.duration}</small><i></i></div>
        <div className="journey-arrival"><strong>{train.arrival}</strong><span>{train.to}</span></div>
      </div>
      <div className="train-card-footer">
        <div className="availability-block">
          <span className={`availability-dot availability-dot--${train.availabilityType}`}></span>
          <div><strong>{train.availability}</strong><span>{availabilityLabel}</span></div>
        </div>
        <div className="chance-block">
          <ShieldCheck size={18} />
          <div><strong>{train.confirmationChance}%</strong><span>confirmation chance</span></div>
        </div>
        <button className="button button--secondary button--compact" onClick={chooseTrain}>View details <ArrowRight size={16} /></button>
      </div>
      {showReason && recommendation && <div className="recommendation-reason"><Sparkles size={16} /><span><strong>Why we picked it:</strong> {recommendation.reason}</span></div>}
    </article>
  )
}
