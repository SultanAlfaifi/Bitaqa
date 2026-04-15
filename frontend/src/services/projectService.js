import api from './api'

export const getProjects = () => api.get('/profile/me/projects')
export const addProject = (data) => api.post('/profile/me/projects', data)
export const updateProject = (id, data) => api.put(`/profile/me/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/profile/me/projects/${id}`)
export const reorderProjects = (orders) =>
  api.patch('/profile/me/projects/reorder', { orders })
