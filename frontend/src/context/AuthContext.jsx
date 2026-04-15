import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken')
  )
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refreshToken')
  )
  const [user, setUser] = useState(null)

  // Listen for token refresh from api.js interceptor
  useEffect(() => {
    const handler = (e) => {
      setAccessToken(e.detail.accessToken)
      setRefreshToken(e.detail.refreshToken)
    }
    window.addEventListener('tokens-refreshed', handler)
    return () => window.removeEventListener('tokens-refreshed', handler)
  }, [])

  const storeTokens = (access, refresh) => {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    setAccessToken(access)
    setRefreshToken(refresh)
  }

  const clearTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const login = async (email, password) => {
    const { data } = await authService.login(email, password)
    storeTokens(data.accessToken, data.refreshToken)
    return data
  }

  const register = async (email, password) => {
    const { data } = await authService.register(email, password)
    storeTokens(data.accessToken, data.refreshToken)
    return data
  }

  const logout = async () => {
    try {
      const rt = localStorage.getItem('refreshToken')
      if (rt) await authService.logout(rt)
    } catch (_) {}
    clearTokens()
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
