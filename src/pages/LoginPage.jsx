import { ArrowRight, BadgeCheck, CalendarCheck2, LockKeyhole, Sparkles, TicketCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    login(email || 'hello@railbook.app')
    navigate('/dashboard')
  }

  const demoLogin = () => {
    login('maya@railbook.app')
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <section className="login-story">
        <Logo inverse />
        <div className="login-story-copy">
          <span className="eyebrow eyebrow--light"><Sparkles size={14} /> A simpler way to travel</span>
          <h1>Good journeys start with <em>clarity.</em></h1>
          <p>Tell us where you’re headed. RailBook takes care of finding the train that makes sense for you.</p>
        </div>
        <div className="mini-trip-card">
          <div className="mini-trip-head"><span><TicketCheck size={17} /> Your next trip</span><BadgeCheck size={19} /></div>
          <div className="mini-route"><strong>HYB</strong><span><i></i><small>11h 50m</small><i></i></span><strong>BOM</strong></div>
          <div className="mini-trip-meta"><span>Fri, 2 Oct</span><span>Confirmed</span></div>
        </div>
        <div className="login-trust"><span><LockKeyhole size={15} /> Your journey preferences stay private</span><span><CalendarCheck2 size={15} /> Mock booking experience</span></div>
      </section>
      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-welcome"><span className="eyebrow">Welcome aboard</span><h2>Let’s plan your next journey.</h2><p>Sign in to save your trips and get more helpful recommendations.</p></div>
          <form className="login-form" onSubmit={submit}>
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" /></label>
            <button className="button button--primary button--wide" type="submit">Continue to RailBook <ArrowRight size={18} /></button>
          </form>
          <div className="login-divider"><span>or explore first</span></div>
          <button className="button button--secondary button--wide" onClick={demoLogin}>Try the demo <Sparkles size={17} /></button>
          <p className="form-footnote">This is a product prototype. No real account or payment is required.</p>
        </div>
      </section>
    </div>
  )
}
