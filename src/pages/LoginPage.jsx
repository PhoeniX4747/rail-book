import { ArrowRight, BadgeCheck, CalendarCheck2, LockKeyhole, Sparkles, TicketCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 4) {
      setError('Use a password with at least 4 characters.')
      return
    }

    setBusy(true)
    const result = mode === 'login' ? await login(email, password) : await register(email, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
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
        <div className="login-trust"><span><LockKeyhole size={15} /> Your journey preferences stay private</span><span><CalendarCheck2 size={15} /> Seamless booking experience</span></div>
      </section>
      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-welcome"><span className="eyebrow">Welcome aboard</span><h2>{mode === 'login' ? 'Welcome back.' : 'Create your RailBook account.'}</h2><p>{mode === 'login' ? 'Sign in to save your trips and get more helpful recommendations.' : 'Register once to save your trips in this browser.'}</p></div>
          <div className="auth-tabs" role="tablist" aria-label="Authentication options"><button className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'} onClick={() => { setMode('login'); setError('') }} role="tab" aria-selected={mode === 'login'}>Log in</button><button className={mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'} onClick={() => { setMode('register'); setError('') }} role="tab" aria-selected={mode === 'register'}>Register</button></div>
          <form className="login-form" onSubmit={submit}>
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
            {mode === 'register' && <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" required /></label>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="button button--primary button--wide" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in to RailBook' : 'Create account'} <ArrowRight size={18} /></button>
          </form>
          <p className="form-footnote">Passwords are salted and one-way hashed in this browser. This is a local prototype—not a replacement for server-side authentication.</p>
        </div>
      </section>
    </div>
  )
}
