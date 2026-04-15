import axios from 'axios'
import api from './api'

const authApi = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export const register = (email, password) =>
  authApi.post('/auth/register', { email, password })

export const login = (email, password) =>
  authApi.post('/auth/login', { email, password })

export const logout = (refreshToken) =>
  api.post('/auth/logout', { refreshToken })

export const logoutAll = () => api.post('/auth/logout-all')
