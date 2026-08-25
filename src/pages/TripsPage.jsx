import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Clock3, Ticket, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

export default function TripsPage() {
  const navigate = useNavigate()
  const { bookings, cancelBooking, setSelectedTrain } = useBooking()
  const [view, setView] = useState('upcoming')
  const upcoming = bookings.filter((booking) => booking.status !== 'Cancelled')
  const past = bookings.filter((booking) => booking.status === 'Cancelled')
  const list = view === 'upcoming' ? upcoming : past

  return (
    <div className="page trips-page">
      <section className="page-heading"><span className="eyebrow">Your RailBook</span><h1>My trips</h1><p>Every journey, saved in one calm, clear place.</p></section>
      <div className="trips-tabs"><button className={view === 'upcoming' ? 'trips-tab trips-tab--active' : 'trips-tab'} onClick={() => setView('upcoming')}>Upcoming <span>{upcoming.length}</span></button><button className={view === 'past' ? 'trips-tab trips-tab--active' : 'trips-tab'} onClick={() => setView('past')}>Past & cancelled <span>{past.length}</span></button></div>
      {list.length ? <div className="trips-list">{list.map((booking) => <article className="trip-card" key={booking.id}><div className="trip-date"><CalendarDays size={18} /><span>{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}<small>{new Date(booking.createdAt).getFullYear()}</small></span></div><div className="trip-main"><div className="trip-main-head"><span className={booking.status === 'Cancelled' ? 'trip-status trip-status--cancelled' : 'trip-status'}>{booking.status === 'Cancelled' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}{booking.status}</span><span>PNR {booking.pnr}</span></div><h2>{booking.train.name} <small>{booking.train.number}</small></h2><p><strong>{booking.train.fromCode}</strong><ArrowRight size={14} /><strong>{booking.train.toCode}</strong><i></i>{booking.train.departure} to {booking.train.arrival}<i></i>{booking.passengers.length} traveler{booking.passengers.length > 1 ? 's' : ''}</p></div><div className="trip-card-actions"><button className="button button--secondary button--compact" onClick={() => { setSelectedTrain(booking.train); navigate(`/trains/${booking.train.id}`) }}>View journey <ChevronRight size={16} /></button>{booking.status !== 'Cancelled' && <button className="cancel-button" onClick={() => cancelBooking(booking.id)}>Cancel mock booking</button>}</div></article>)}</div> : <EmptyTrips view={view} onExplore={() => navigate('/assistant')} />}
    </div>
  )
}

function EmptyTrips({ view, onExplore }) {
  return <div className="empty-trips"><span className="empty-trip-icon">{view === 'upcoming' ? <Ticket size={25} /> : <Clock3 size={25} />}</span><h2>{view === 'upcoming' ? 'No trips on the books yet.' : 'Nothing to see here yet.'}</h2><p>{view === 'upcoming' ? 'When you create a mock ticket, it will live here for easy access.' : 'Cancelled mock bookings will appear here.'}</p>{view === 'upcoming' && <button className="button button--primary" onClick={onExplore}>Plan a journey <ArrowRight size={17} /></button>}</div>
}
