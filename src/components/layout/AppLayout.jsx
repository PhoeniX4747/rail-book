import { Menu, X, LogOut, CircleHelp, Bell } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../common/Logo'

const navigation = [
  { to: '/dashboard', label: 'Home' },
  { to: '/search', label: 'Plan a trip' },
  { to: '/assistant', label: 'Smart assistant', accent: true },
  { to: '/trips', label: 'My trips' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
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
            <button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={19} /></button>
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
    </div>
  )
}
