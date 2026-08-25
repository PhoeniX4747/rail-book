import { ArrowRight, CalendarDays, ChevronRight, Clock3, MapPin, Route, Sparkles, Ticket, TrendingUp, WandSparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import InfoModal from '../components/common/InfoModal'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { search, setSearch, bookings } = useBooking()
  const [racGuideOpen, setRacGuideOpen] = useState(false)
  const firstName = user?.name?.split(' ')[0] || 'Traveler'

  const useQuickRoute = () => {
    setSearch({ ...search, from: 'Hyderabad', to: 'Mumbai' })
    navigate('/results')
  }

  return (
    <div className="page dashboard-page">
      <section className="welcome-hero">
        <div>
          <span className="eyebrow"><span className="status-dot"></span> Your travel companion</span>
          <h1>Good morning, {firstName} <span aria-hidden="true">👋</span></h1>
          <p>Where would you like to travel? We’ll make the railway details feel easy.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span className="orbit-dot orbit-dot--one"></span><span className="orbit-dot orbit-dot--two"></span><Route size={34} /></div>
      </section>

      <section className="choice-grid" aria-label="Choose how to plan a journey">
        <button className="choice-card choice-card--search" onClick={() => navigate('/search')}>
          <span className="choice-icon"><Ticket size={25} /></span>
          <div><span className="eyebrow">Explore yourself</span><h2>Search trains</h2><p>Browse, compare timings, fares and availability at your own pace.</p></div>
          <ArrowRight className="choice-arrow" size={22} />
          <div className="choice-art choice-art--search" aria-hidden="true"><span></span><span></span><span></span></div>
        </button>
        <button className="choice-card choice-card--ai" onClick={() => navigate('/assistant')}>
          <span className="choice-icon choice-icon--ai"><WandSparkles size={25} /></span>
          <div><span className="eyebrow eyebrow--violet"><Sparkles size={13} /> RailBook intelligence</span><span className="assistant-recommended">Recommended</span><h2>Smart travel assistant</h2><p>Tell us what matters. We’ll recommend the trains that fit your journey.</p></div>
          <ArrowRight className="choice-arrow" size={22} />
          <div className="choice-art choice-art--ai" aria-hidden="true"><i></i><i></i><i></i></div>
        </button>
      </section>

      <section className="dashboard-columns">
        <div className="section-card quick-plan">
          <div className="section-heading"><div><span className="eyebrow">Start in one click</span><h2>Popular journeys</h2></div><button className="text-button" onClick={() => navigate('/search')}>See all <ChevronRight size={16} /></button></div>
          <button className="quick-route" onClick={useQuickRoute}>
            <div className="quick-route-stations"><span className="station-pin station-pin--from"><MapPin size={16} /></span><div><strong>Hyderabad</strong><small>HYB</small></div><span className="route-arrow"><i></i><ArrowRight size={16} /></span><span className="station-pin station-pin--to"><MapPin size={16} /></span><div><strong>Mumbai</strong><small>CSMT</small></div></div>
            <span className="quick-route-cta">Find trains <ArrowRight size={16} /></span>
          </button>
          <div className="quick-plan-row"><button onClick={() => { setSearch({ ...search, from: 'Hyderabad', to: 'Bengaluru' }); navigate('/results') }}>Hyderabad <ArrowRight size={14} /> Bengaluru</button><button onClick={() => { setSearch({ ...search, from: 'Hyderabad', to: 'Chennai' }); navigate('/results') }}>Hyderabad <ArrowRight size={14} /> Chennai</button></div>
        </div>
        <aside className="section-card travel-tip">
          <div className="tip-icon"><TrendingUp size={19} /></div><span className="eyebrow">Travel insight</span><h3>Not sure about RAC?</h3><p>RAC means you can travel and often get a full berth before your journey begins.</p><button className="text-button" onClick={() => setRacGuideOpen(true)}>Learn in plain English <ArrowRight size={16} /></button>
        </aside>
      </section>

      <section className="dashboard-bottom">
        <div className="section-heading"><div><span className="eyebrow">Your plans</span><h2>{bookings.length ? 'Recent trips' : 'Travel with confidence'}</h2></div>{bookings.length ? <button className="text-button" onClick={() => navigate('/trips')}>View trips <ChevronRight size={16} /></button> : null}</div>
        {bookings.length ? (
          <button className="recent-trip" onClick={() => navigate('/trips')}><span className="recent-trip-icon"><CalendarDays size={19} /></span><div><strong>{bookings[0].train.name}</strong><span>{bookings[0].train.fromCode} to {bookings[0].train.toCode} · {bookings[0].status}</span></div><ChevronRight size={19} /></button>
        ) : (
          <div className="empty-trip"><span><Clock3 size={20} /></span><div><strong>Your next memorable trip starts here.</strong><p>Compare options clearly, understand your chances, then book with confidence.</p></div><button className="button button--secondary button--compact" onClick={() => navigate('/assistant')}>Find my train <ArrowRight size={16} /></button></div>
        )}
      </section>
      {racGuideOpen && <InfoModal title="RAC, in plain English" onClose={() => setRacGuideOpen(false)}><div className="plain-language-guide"><strong>What it means</strong><p>RAC stands for Reservation Against Cancellation. You have a valid ticket and can board the train.</p><strong>What to expect</strong><p>At first, you may share a berth. If someone cancels, the railway can assign you a full berth before or during the trip.</p><strong>How RailBook helps</strong><p>We display a confirmation estimate so you can compare RAC with other trains confidently.</p></div></InfoModal>}
    </div>
  )
}
