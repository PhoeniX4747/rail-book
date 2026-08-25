import { ArrowRight, CalendarDays, CheckCircle2, Copy, Download, MapPin, Share2, ShieldCheck, TicketCheck, TrainFront, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

export default function BookingSuccessPage() {
  const navigate = useNavigate()
  const { lastBooking } = useBooking()
  const [copied, setCopied] = useState(false)

  if (!lastBooking) return <div className="page"><div className="no-results"><h2>Your booking details will appear here.</h2><button className="button button--primary" onClick={() => navigate('/trips')}>View my trips</button></div></div>
  const { train, passengers } = lastBooking
  const travelDate = new Date(lastBooking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const downloadTicket = () => {
    const content = `RailBook ticket\nPNR: ${lastBooking.pnr}\nTrain: ${train.name} (${train.number})\nRoute: ${train.from} to ${train.to}\nPassengers: ${passengers.map((p) => p.name).join(', ')}\nStatus: ${lastBooking.status}`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `railbook-${lastBooking.pnr}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }
  const shareTicket = async () => {
    const text = `RailBook ticket · ${train.name} · PNR ${lastBooking.pnr}`
    if (navigator.share) await navigator.share({ title: 'My RailBook ticket', text })
    else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  return (
    <div className="page success-page">
      <section className="success-intro"><span className="success-check"><CheckCircle2 size={32} /></span><span className="eyebrow eyebrow--success">Booking created</span><h1>You’re all set for the journey.</h1><p>Your RailBook ticket is ready. We’ve saved it in My trips too.</p></section>
      <section className="ticket-card">
        <div className="ticket-top"><div><span className="ticket-brand"><TicketCheck size={19} /> RailBook ticket</span><h2>{train.name}</h2><p>{train.number} · {lastBooking.status}</p></div><span className="ticket-status"><ShieldCheck size={15} /> {lastBooking.status}</span></div>
        <div className="ticket-route"><div><strong>{train.departure}</strong><span>{train.from}<small>{train.fromCode}</small></span></div><div className="ticket-route-line"><span></span><TrainFront size={21} /><span></span><small>{train.duration}</small></div><div className="ticket-route-end"><strong>{train.arrival}</strong><span>{train.to}<small>{train.toCode}</small></span></div></div>
        <div className="ticket-details"><div><CalendarDays size={17} /><span>Travel date<strong>{travelDate}</strong></span></div><div><UsersRound size={17} /><span>Travelers<strong>{passengers.length} passenger{passengers.length > 1 ? 's' : ''}</strong></span></div><div><MapPin size={17} /><span>Booking ID<strong>{lastBooking.id}</strong></span></div></div>
        <div className="pnr-strip"><div><span>Your PNR</span><strong>{lastBooking.pnr}</strong></div><button onClick={() => { navigator.clipboard.writeText(lastBooking.pnr); setCopied(true); setTimeout(() => setCopied(false), 1500) }}><Copy size={16} /> {copied ? 'Copied!' : 'Copy'}</button></div>
        <div className="ticket-passengers"><strong>Passenger details</strong>{passengers.map((passenger) => <span key={passenger.id}>{passenger.name} · {passenger.age} yrs · {passenger.berth}</span>)}</div>
      </section>
      <div className="ticket-actions"><button className="button button--secondary" onClick={downloadTicket}><Download size={17} /> Download ticket</button><button className="button button--secondary" onClick={shareTicket}><Share2 size={17} /> {copied ? 'Copied to clipboard!' : 'Share ticket'}</button><button className="button button--primary" onClick={() => navigate('/trips')}>View my trips <ArrowRight size={17} /></button></div>
      <p className="success-footnote">This mock ticket is for the RailBook prototype only. No real railway booking has been made.</p>
    </div>
  )
}
