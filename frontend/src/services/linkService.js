import api from './api'

export const getLinks = () => api.get('/profile/me/links')
export const addLink = (data) => api.post('/profile/me/links', data)
export const updateLink = (id, data) => api.put(`/profile/me/links/${id}`, data)
export const deleteLink = (id) => api.delete(`/profile/me/links/${id}`)
