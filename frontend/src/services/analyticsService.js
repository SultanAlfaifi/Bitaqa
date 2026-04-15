import api from './api'

export const getSummary = () => api.get('/profile/me/analytics')
export const getDailyViews = (days = 30) =>
  api.get(`/profile/me/analytics/daily?days=${days}`)
