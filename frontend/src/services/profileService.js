import axios from 'axios'
import api from './api'

export const getMyProfile = () => api.get('/profile/me')
export const updateProfile = (data) => api.put('/profile/me', data)
export const updateUsername = (username) =>
  api.patch('/profile/me/username', { username })
export const updateVisibility = (visibility) =>
  api.patch('/profile/me/visibility', { visibility })

// Public — no auth needed
export const getPublicProfile = (username) =>
  axios.get(`/api/v1/p/${username}`)
