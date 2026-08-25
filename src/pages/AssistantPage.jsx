import { ArrowLeft, ArrowRight, CalendarClock, Check, MapPin, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { getStationOptions } from '../services/stationService'
import { getBookingDateRange } from '../utils/dateRange'

const prompts = [
  { key: 'from', title: 'Where are you travelling from?', hint: 'Choose your departure station.', icon: MapPin },
  { key: 'to', title: 'Where would you like to go?', hint: 'Choose your destination station.', icon: MapPin },
  { key: 'arrival', title: 'When do you need to arrive?', hint: 'Pick an arrival date and your preferred latest time.', icon: CalendarClock },
  { key: 'preferences', title: 'What matters most for this trip?', hint: 'Pick as many priorities as you like. Conflicting choices update automatically.', icon: Sparkles },
]

const preferenceOptions = [
  { id: 'comfortable', label: 'Comfortable', conflicts: ['cheapest'] },
  { id: 'premium', label: 'Premium journey', conflicts: ['cheapest', 'best-value'] },
  { id: 'cheapest', label: 'Cheapest fare', conflicts: ['premium', 'comfortable'] },
  { id: 'best-value', label: 'Best value', conflicts: ['premium'] },
  { id: 'fastest', label: 'Fastest route', conflicts: [] },
  { id: 'family', label: 'Family friendly', conflicts: [] },
  { id: 'avoid-waiting', label: 'Avoid waiting list', conflicts: [] },
  { id: 'lower-berth', label: 'Lower berth', conflicts: [] },
  { id: 'flexible', label: 'Flexible timing', conflicts: [] },
  { id: 'tatkal', label: 'Tatkal ready', conflicts: [] },
]

export default function AssistantPage() {
  const navigate = useNavigate()
  const { search, setSearch, setAiPreferences } = useBooking()
  const stations = getStationOptions()
  const { minDate, maxDate } = getBookingDateRange()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ from: '', to: '', arrivalDate: search.date, arrivalTime: '08:00' })
  const [selectedPreferences, setSelectedPreferences] = useState([])
  const current = prompts[step]
  const Icon = current.icon
  const progress = ((step + 1) / prompts.length) * 100

  const continueFlow = () => {
    if (current.key === 'arrival' && (!answers.arrivalDate || !answers.arrivalTime)) return
    if ((current.key === 'from' || current.key === 'to') && !answers[current.key]) return
    if (step < prompts.length - 1) {
      setStep(step + 1)
      return
    }
    setSearch({ ...search, from: answers.from, to: answers.to, date: answers.arrivalDate })
    setAiPreferences({ arrival: `${answers.arrivalDate} by ${answers.arrivalTime}`, arrivalDate: answers.arrivalDate, arrivalTime: answers.arrivalTime, preferences: selectedPreferences })
    navigate('/results?mode=smart')
  }

  const togglePreference = (option) => {
    setSelectedPreferences((currentSelections) => {
      if (currentSelections.includes(option.id)) return currentSelections.filter((id) => id !== option.id)
      return [...currentSelections.filter((id) => !option.conflicts.includes(id)), option.id]
    })
  }

  return (
    <div className="page assistant-page">
      <section className="assistant-shell">
        <aside className="assistant-aside">
          <div className="assistant-orb"><WandSparkles size={30} /></div>
          <span className="eyebrow eyebrow--violet"><Sparkles size={13} /> RailBook intelligence</span>
          <h1>A little context.<br /><em>A better train.</em></h1>
          <p>No railway vocabulary needed. Just share how you want to travel and we’ll reduce the options to what fits.</p>
          <div className="assistant-promise"><ShieldCheck size={18} /><span><strong>Clear recommendations</strong><small>We only rank trains that actually match your route.</small></span></div>
          <div className="assistant-steps">{prompts.map((prompt, index) => <div key={prompt.key} className={index === step ? 'assistant-step assistant-step--active' : index < step ? 'assistant-step assistant-step--done' : 'assistant-step'}><span>{index < step ? <Check size={13} /> : index + 1}</span>{prompt.title.replace('?', '')}</div>)}</div>
        </aside>
        <section className="assistant-question" aria-live="polite">
          <div className="question-progress"><span>Step {step + 1} of {prompts.length}</span><div><i style={{ width: `${progress}%` }}></i></div></div>
          <div className="question-icon"><Icon size={27} /></div>
          <span className="eyebrow">Let’s make it personal</span>
          <h2>{current.title}</h2>
          <p>{current.hint}</p>
          {current.key === 'arrival' ? (
            <div className="arrival-date-time"><label><span>Arrival date</span><input type="date" value={answers.arrivalDate} min={minDate} max={maxDate} onChange={(event) => setAnswers({ ...answers, arrivalDate: event.target.value })} /></label><label><span>Arrive by</span><select value={answers.arrivalTime} onChange={(event) => setAnswers({ ...answers, arrivalTime: event.target.value })}>{['06:00', '08:00', '10:00', '12:00', '15:00', '18:00', '21:00', '23:00'].map((time) => <option key={time} value={time}>{time}</option>)}</select></label></div>
          ) : current.key === 'from' || current.key === 'to' ? (
            <label className="assistant-input"><span className="sr-only">{current.title}</span><select autoFocus value={answers[current.key]} onChange={(event) => setAnswers({ ...answers, [current.key]: event.target.value })}><option value="" disabled>Select a station</option>{stations.map((station) => <option key={station.value} value={station.value} disabled={station.value === (current.key === 'from' ? answers.to : answers.from)}>{station.label}</option>)}</select></label>
          ) : <div className="preference-orbit" aria-label="Travel preferences"><span className="preference-title">Select your travel style</span><div className="preference-options">{preferenceOptions.map((option) => <button key={option.id} type="button" className={selectedPreferences.includes(option.id) ? 'preference-chip preference-chip--selected' : 'preference-chip'} onClick={() => togglePreference(option)} aria-pressed={selectedPreferences.includes(option.id)}>{selectedPreferences.includes(option.id) && <Check size={14} />}{option.label}</button>)}</div></div>}
          <div className="assistant-controls"><button className="button button--ghost" onClick={() => step === 0 ? navigate('/dashboard') : setStep(step - 1)}><ArrowLeft size={17} /> Back</button><button className="button button--primary" onClick={continueFlow}>{step === prompts.length - 1 ? 'Find my best trains' : 'Continue'} <ArrowRight size={17} /></button></div>
        </section>
      </section>
    </div>
  )
}
