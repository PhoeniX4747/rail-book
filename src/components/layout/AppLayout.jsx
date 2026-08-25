import { Menu, X, LogOut, CircleHelp, Bell, CheckCircle2, Sparkles } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../common/Logo'
import InfoModal from '../common/InfoModal'

const navigation = [
  { to: '/dashboard', label: 'Home' },
  { to: '/search', label: 'Plan a trip' },
  { to: '/assistant', label: 'Smart assistant', accent: true },
  { to: '/trips', label: 'My trips' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'RB'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Logo />
          <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''} ${item.accent ? 'nav-link--accent' : ''}`}
                to={item.to}
              >
                {item.label}
                {item.accent && <span className="nav-spark">✦</span>}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-actions">
            <div className="topbar-popover-wrap"><button className="icon-button" onClick={() => { setHelpOpen(true); setNotificationsOpen(false) }} aria-label="Open help centre"><CircleHelp size={19} /></button></div>
            <div className="topbar-popover-wrap"><button className="icon-button notification" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-expanded={notificationsOpen} aria-label="View notifications"><Bell size={19} /></button>{notificationsOpen && <div className="notification-panel"><div><strong>Travel updates</strong><button onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={15} /></button></div><p><CheckCircle2 size={15} /> Your RailBook trips are saved locally and ready to revisit.</p><p><Sparkles size={15} /> Smart Assistant can compare all 10 options for your selected route.</p></div>}</div>
            <div className="user-menu">
              <div className="avatar">{initials}</div>
              <div className="user-copy"><strong>{user?.name?.split(' ')[0] || 'Traveler'}</strong><span>Personal account</span></div>
              <button className="logout-button" onClick={logout} aria-label="Log out"><LogOut size={17} /></button>
            </div>
          </div>
        </div>
      </header>
      <main className="app-main"><Outlet /></main>
      <footer className="site-footer">
        <div><Logo /><span className="footer-tagline">Book trains without learning railway jargon.</span></div>
        <span>Made for easier journeys · Demo experience</span>
      </footer>
      {helpOpen && <InfoModal title="RailBook help centre" onClose={() => setHelpOpen(false)}><div className="help-grid"><div><strong>RAC</strong><p>You can travel. You may share a berth until a full one is assigned.</p></div><div><strong>Waiting list</strong><p>You need a seat to open up. RailBook shows an estimated chance.</p></div><div><strong>Tatkal</strong><p>A quota for last-minute travel. Keep a primary train and backups ready.</p></div><div><strong>Auto upgrade</strong><p>You may be moved to a better available class at no extra charge.</p></div></div><p className="modal-note">RailBook uses mock train data and booking estimates in this prototype.</p></InfoModal>}
    </div>
  )
}
