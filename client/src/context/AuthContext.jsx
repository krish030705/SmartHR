import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchCurrentUser, logout as clearStoredAuth } from '../services/authService.js'

const AuthContext = createContext(null)

// Wraps the app once (in main.jsx). Everything that needs to know "who's
// logged in" reads from here via useAuth() instead of poking
// localStorage/sessionStorage directly.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Starts true so ProtectedRoute doesn't redirect to login for a split
  // second before we've had a chance to check a stored token.
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('smarthr_token') || sessionStorage.getItem('smarthr_token')

    if (!token) {
      setInitializing(false)
      return
    }

    // A token being present doesn't mean it's still valid — confirm with
    // the server before trusting it.
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        clearStoredAuth()
        setUser(null)
      })
      .finally(() => setInitializing(false))
  }, [])

  const login = useCallback((token, userData, remember) => {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem('smarthr_token', token)
    storage.setItem('smarthr_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setUser(null)
  }, [])

  // Patches fields on the current user both in state and in whichever
  // storage holds the session.
  const updateUser = useCallback((patch) => {
    setUser((u) => {
      if (!u) return u
      const next = { ...u, ...patch }
      const storage = localStorage.getItem('smarthr_user') ? localStorage : sessionStorage
      storage.setItem('smarthr_user', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}