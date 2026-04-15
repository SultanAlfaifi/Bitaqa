import api from './api'

export const getSkills = () => api.get('/profile/me/skills')
export const addSkill = (data) => api.post('/profile/me/skills', data)
export const updateSkill = (id, data) => api.put(`/profile/me/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/profile/me/skills/${id}`)
