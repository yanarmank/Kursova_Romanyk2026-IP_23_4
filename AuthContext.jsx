import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'publishing-house-auth'

export const demoAccounts = [
  {
    email: 'editor@publishing.local',
    password: 'admin',
    name: 'Олена Ковальчук',
    role: 'Головний редактор',
    avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Editor',
  },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = ({ email, password, remember }) => {
    const account = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    )
    if (!account) {
      return { ok: false, message: 'Неправильні облікові дані.' }
    }
    setUser(account)
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
    }
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth Error')
  return context
}