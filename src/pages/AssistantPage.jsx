import { ArrowLeft, ArrowRight, CalendarClock, Check, MapPin, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

const prompts = [
  { key: 'from', title: 'Where are you travelling from?', hint: 'Enter a city or station', icon: MapPin, placeholder: 'e.g. Hyderabad' },
  { key: 'to', title: 'Where would you like to go?', hint: 'We’ll look for the simplest routes', icon: MapPin, placeholder: 'e.g. Mumbai' },
  { key: 'arrival', title: 'When do you need to arrive?', hint: 'A rough time is enough—we’ll work with it.', icon: CalendarClock, placeholder: 'e.g. Friday morning' },
  { key: 'preferences', title: 'What matters most for this trip?', hint: 'A little context helps us rank the right options.', icon: Sparkles, placeholder: 'e.g. Comfortable journey with parents, avoid waiting list' },
]

export default function AssistantPage() {
  const navigate = useNavigate()
  const { search, setSearch, setAiPreferences } = useBooking()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ from: search.from, to: search.to, arrival: 'Friday morning', preferences: '' })
  const current = prompts[step]
  const Icon = current.icon
  const progress = ((step + 1) / prompts.length) * 100

  const continueFlow = () => {
    if (!answers[current.key].trim()) return
    if (step < prompts.length - 1) {
      setStep(step + 1)
      return
    }
    setSearch({ ...search, from: answers.from, to: answers.to })
    setAiPreferences({ arrival: answers.arrival, preferences: answers.preferences })
    navigate('/results?mode=smart')
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
            <div className="arrival-options">{['Before 8 AM', 'Tomorrow evening', 'Friday night', 'I’m flexible'].map((option) => <button key={option} type="button" onClick={() => setAnswers({ ...answers, arrival: option })} className={answers.arrival === option ? 'arrival-option arrival-option--selected' : 'arrival-option'}>{answers.arrival === option && <Check size={15} />}{option}</button>)}</div>
          ) : (
            <label className="assistant-input"><span className="sr-only">{current.title}</span><input autoFocus value={answers[current.key]} onChange={(event) => setAnswers({ ...answers, [current.key]: event.target.value })} onKeyDown={(event) => event.key === 'Enter' && continueFlow()} placeholder={current.placeholder} /></label>
          )}
          <div className="assistant-controls"><button className="button button--ghost" onClick={() => step === 0 ? navigate('/dashboard') : setStep(step - 1)}><ArrowLeft size={17} /> Back</button><button className="button button--primary" onClick={continueFlow}>{step === prompts.length - 1 ? 'Find my best trains' : 'Continue'} <ArrowRight size={17} /></button></div>
        </section>
      </section>
    </div>
  )
}
