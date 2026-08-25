/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { clearSession, getSessionUser, loginAccount, registerAccount } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSessionUser)

  const login = async (email, password) => {
    const result = await loginAccount(email, password)
    if (result.ok) setUser(result.user)
    return result
  }

  const register = async (email, password) => {
    const result = await registerAccount(email, password)
    if (result.ok) setUser(result.user)
    return result
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
