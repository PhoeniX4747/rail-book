import { ArrowRight, ArrowLeftRight, CalendarDays, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { getStationOptions } from '../services/stationService'

export default function SearchPage() {
  const navigate = useNavigate()
  const { search, setSearch } = useBooking()
  const stations = getStationOptions()
  const [draft, setDraft] = useState(search)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const swapStations = () => setDraft((current) => ({ ...current, from: current.to, to: current.from }))
  const submit = (event) => {
    event.preventDefault()
    setSearch(draft)
    navigate('/results')
  }

  return (
    <div className="page search-page">
      <section className="page-heading page-heading--center"><span className="eyebrow">Plan your journey</span><h1>Find the train that fits.</h1><p>Simple search, clear choices, no railway jargon required.</p></section>
      <form className="search-panel" onSubmit={submit}>
        <div className="search-fields">
          <label className="search-field"><span>From</span><div><MapPin size={19} /><select value={draft.from} onChange={(event) => update('from', event.target.value)} aria-label="Departure station">{stations.map((station) => <option key={station.value} value={station.value}>{station.label}</option>)}</select></div></label>
          <button className="swap-button" type="button" onClick={swapStations} aria-label="Swap departure and destination"><ArrowLeftRight size={17} /></button>
          <label className="search-field"><span>To</span><div><MapPin size={19} /><select value={draft.to} onChange={(event) => update('to', event.target.value)} aria-label="Destination station">{stations.map((station) => <option key={station.value} value={station.value}>{station.label}</option>)}</select></div></label>
          <label className="search-field search-field--date"><span>Travel date</span><div><CalendarDays size={19} /><input type="date" value={draft.date} onChange={(event) => update('date', event.target.value)} required /></div></label>
          <button className="button button--primary search-submit" type="submit"><Search size={18} /> Search trains</button>
        </div>
        <button className="advanced-toggle" type="button" onClick={() => setAdvancedOpen(!advancedOpen)}><SlidersHorizontal size={16} /> Advanced filters <ChevronDown size={16} className={advancedOpen ? 'chevron-up' : ''} /></button>
        {advancedOpen && <div className="advanced-fields">
          <label><span>Preferred class</span><select value={draft.travelClass} onChange={(event) => update('travelClass', event.target.value)}><option>Any class</option><option>Sleeper</option><option>AC 3 Tier</option><option>AC 2 Tier</option><option>First AC</option></select></label>
          <label className="check-option"><input type="checkbox" checked={draft.tatkal} onChange={(event) => update('tatkal', event.target.checked)} /><span><strong>Tatkal</strong><small>Show last-minute options</small></span></label>
          <label className="check-option"><input type="checkbox" checked={draft.flexible} onChange={(event) => update('flexible', event.target.checked)} /><span><strong>Flexible dates</strong><small>See nearby departure dates</small></span></label>
        </div>}
      </form>
      <div className="search-sidekick"><span className="sidekick-icon"><Sparkles size={18} /></span><div><strong>Want us to do the comparing?</strong><p>Tell the Smart Travel Assistant what matters—comfort, budget, arrival time—and get a short, explained shortlist.</p></div><button className="button button--secondary button--compact" onClick={() => navigate('/assistant')}>Try assistant <ArrowRight size={16} /></button></div>
    </div>
  )
}
