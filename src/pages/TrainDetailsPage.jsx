import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Info, ShieldCheck, Sparkles, TrainFront, UsersRound } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { getTrainById } from '../services/trainService'

export default function TrainDetailsPage() {
  const { trainId } = useParams()
  const navigate = useNavigate()
  const { setSelectedTrain } = useBooking()
  const train = getTrainById(trainId)

  useEffect(() => {
    if (train) setSelectedTrain(train)
  }, [train, setSelectedTrain])

  if (!train) return <div className="page"><div className="no-results"><h2>That train is no longer in this list.</h2><button className="button button--primary" onClick={() => navigate('/results')}>Back to results</button></div></div>

  const isAvailable = train.availabilityType === 'available'
  return (
    <div className="page train-details-page">
      <button className="back-link" onClick={() => navigate('/results')}><ArrowLeft size={16} /> Back to train options</button>
      <section className="train-detail-hero">
        <div className="detail-title"><span className="eyebrow"><TrainFront size={14} /> {train.number} · {train.days}</span><h1>{train.name}</h1><p>{train.from} to {train.to}</p></div>
        <div className="detail-price"><span>Fare per traveler</span><strong>₹{train.fare}</strong><small>All taxes included in this demo</small></div>
      </section>
      <section className="detail-route-card"><div className="route-stop"><strong>{train.departure}</strong><span>{train.from}</span><small>{train.fromCode}</small></div><div className="route-visual"><span></span><div><Clock3 size={15} /> {train.duration}</div><i></i></div><div className="route-stop route-stop--end"><strong>{train.arrival}</strong><span>{train.to}</span><small>{train.toCode}</small></div></section>
      <div className="detail-layout">
        <div className="detail-content">
          <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">Seat confidence</span><h2>Availability that makes sense</h2></div></div><div className={`availability-explainer availability-explainer--${train.availabilityType}`}><span>{isAvailable ? <CheckCircle2 size={24} /> : <ShieldCheck size={24} />}</span><div><strong>{train.availability}</strong><p>{isAvailable ? `You can book this today. This train has a ${train.confirmationChance}% confirmation estimate.` : `This is ${train.availabilityType === 'rac' ? 'RAC, so you can travel' : 'a waiting list'}. We estimate a ${train.confirmationChance}% chance of confirmation before departure.`}</p></div><b>{train.confirmationChance}%<small>likely to confirm</small></b></div></section>
          <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">Travel insights</span><h2>Why this is a good option</h2></div></div><div className="insights-grid"><div><span className="insight-icon"><Sparkles size={18} /></span><strong>Comfort score</strong><p>{'●'.repeat(train.comfort)}{'○'.repeat(5 - train.comfort)} <small>Based on class mix and duration</small></p></div><div><span className="insight-icon"><UsersRound size={18} /></span><strong>Good to know</strong><p>{train.insight}</p></div><div><span className="insight-icon"><CalendarDays size={18} /></span><strong>Runs {train.days.toLowerCase()}</strong><p>Choose your preferred travel date at the next step.</p></div></div></section>
          <section className="detail-section"><div className="section-heading"><div><span className="eyebrow">Journey details</span><h2>Stops along the way</h2></div></div><div className="stop-list">{train.route.map((stop, index) => <div key={stop}><span>{index + 1}</span><strong>{stop}</strong>{index < train.route.length - 1 && <i></i>}</div>)}</div></section>
        </div>
        <aside className="booking-summary"><span className="eyebrow">Your selection</span><h3>{train.name}</h3><div className="summary-item"><Clock3 size={17} /><span>{train.departure} → {train.arrival}<small>{train.duration} journey</small></span></div><div className="summary-item"><CircleDollarSign size={17} /><span>₹{train.fare} per traveler<small>Choose passenger details next</small></span></div><div className="summary-rule"><Info size={16} /> No payment step in this demo. Your mock ticket is created immediately.</div><button className="button button--primary button--wide" onClick={() => navigate('/passengers')}>Continue to passengers <ArrowRight size={17} /></button></aside>
      </div>
    </div>
  )
}
