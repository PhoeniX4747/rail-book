/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('railbook-user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email) => {
    const name = email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Rail traveler'
    const nextUser = { name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()), email: email || 'demo@railbook.app' }
    localStorage.setItem('railbook-user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('railbook-user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
