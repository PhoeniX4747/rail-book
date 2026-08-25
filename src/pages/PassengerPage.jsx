import { ArrowLeft, ArrowRight, Check, ChevronDown, CirclePlus, HeartHandshake, Info, Sparkles, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

const makePassenger = () => ({ id: crypto.randomUUID(), name: '', age: '', gender: 'Prefer not to say', nationality: 'Indian', berth: 'No preference' })

export default function PassengerPage() {
  const navigate = useNavigate()
  const { selectedTrain, createBooking } = useBooking()
  const [passengers, setPassengers] = useState([makePassenger()])
  const [insurance, setInsurance] = useState(true)

  if (!selectedTrain) {
    return <div className="page"><div className="no-results"><h2>Choose a train before adding passengers.</h2><button className="button button--primary" onClick={() => navigate('/results')}>Find trains</button></div></div>
  }

  const updatePassenger = (id, key, value) => setPassengers((current) => current.map((passenger) => passenger.id === id ? { ...passenger, [key]: value } : passenger))
  const addPassenger = () => passengers.length < 6 && setPassengers((current) => [...current, makePassenger()])
  const removePassenger = (id) => passengers.length > 1 && setPassengers((current) => current.filter((passenger) => passenger.id !== id))
  const completeBooking = (event) => {
    event.preventDefault()
    if (passengers.some((passenger) => !passenger.name.trim() || !passenger.age)) return
    createBooking(passengers)
    navigate('/booking/success')
  }

  return (
    <div className="page passenger-page">
      <button className="back-link" onClick={() => navigate(`/trains/${selectedTrain.id}`)}><ArrowLeft size={16} /> Back to journey details</button>
      <div className="booking-flow-head"><div><span className="eyebrow">Almost there</span><h1>Who’s travelling?</h1><p>Add passenger details. We’ll keep everything simple and clear.</p></div><div className="flow-steps"><span className="flow-step flow-step--done"><Check size={14} /> Train</span><i></i><span className="flow-step flow-step--active">2. Passengers</span><i></i><span className="flow-step">3. Ticket</span></div></div>
      <div className="passenger-layout">
        <form className="passenger-form" onSubmit={completeBooking}>
          <section className="passenger-section"><div className="section-heading"><div><span className="eyebrow">Passenger details</span><h2>Travelers</h2></div><span className="passenger-count">{passengers.length} of 6</span></div>{passengers.map((passenger, index) => <div className="passenger-card" key={passenger.id}><div className="passenger-card-head"><span><UserRound size={16} /> Passenger {index + 1}</span>{passengers.length > 1 && <button type="button" onClick={() => removePassenger(passenger.id)} aria-label={`Remove passenger ${index + 1}`}><X size={17} /></button>}</div><div className="passenger-fields"><label className="field field--wide"><span>Full name as per government ID</span><input value={passenger.name} onChange={(event) => updatePassenger(passenger.id, 'name', event.target.value)} placeholder="Enter full name" required /></label><label className="field"><span>Age</span><input type="number" min="1" max="120" value={passenger.age} onChange={(event) => updatePassenger(passenger.id, 'age', event.target.value)} placeholder="Age" required /></label><label className="field"><span>Gender</span><select value={passenger.gender} onChange={(event) => updatePassenger(passenger.id, 'gender', event.target.value)}><option>Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option></select></label><label className="field"><span>Berth preference</span><select value={passenger.berth} onChange={(event) => updatePassenger(passenger.id, 'berth', event.target.value)}><option>No preference</option><option>Lower berth</option><option>Middle berth</option><option>Upper berth</option><option>Side lower</option><option>Side upper</option></select></label></div>{Number(passenger.age) >= 60 && <div className="smart-suggestion"><Sparkles size={15} /><span><strong>Helpful suggestion:</strong> Lower berth is often more comfortable for senior travelers.</span><button type="button" onClick={() => updatePassenger(passenger.id, 'berth', 'Lower berth')}>Use lower berth</button></div>}</div>)}</section>
          <button type="button" className="add-passenger" onClick={addPassenger} disabled={passengers.length >= 6}><CirclePlus size={18} /> Add another passenger <small>Up to 6 travelers</small></button>
          <section className="passenger-section preferences-section"><div className="section-heading"><div><span className="eyebrow">A little more control</span><h2>Travel preferences</h2></div></div><label className="insurance-row"><input type="checkbox" checked={insurance} onChange={(event) => setInsurance(event.target.checked)} /><span className="checkbox-mark"><Check size={13} /></span><span><strong>Include travel insurance</strong><small>₹0.45 per traveler. A tiny add-on for extra peace of mind.</small></span><Info size={17} /></label><div className="railway-explainer"><HeartHandshake size={18} /><span><strong>Auto upgrade, explained</strong><small>If a better class opens up, railway staff may move you at no extra charge. You stay in control.</small></span></div></section>
          <button className="button button--primary button--wide passenger-submit" type="submit">Create mock ticket <ArrowRight size={18} /></button>
        </form>
        <aside className="booking-summary passenger-summary"><span className="eyebrow">Journey selected</span><h3>{selectedTrain.name}</h3><p>{selectedTrain.fromCode} <ArrowRight size={14} /> {selectedTrain.toCode} · {selectedTrain.duration}</p><div className="summary-total"><span>Estimated total</span><strong>₹{selectedTrain.fare * passengers.length}</strong><small>for {passengers.length} traveler{passengers.length > 1 ? 's' : ''}</small></div><div className="summary-rule"><Info size={16} /> This is a demo. No real payment details will ever be requested.</div><button className="text-button" type="button" onClick={() => navigate(`/trains/${selectedTrain.id}`)}>Change train <ChevronDown size={15} /></button></aside>
      </div>
    </div>
  )
}
