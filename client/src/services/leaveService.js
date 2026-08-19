import apiClient from './apiClient.js'

export async function applyLeave(payload) {
  const { data } = await apiClient.post('/leave', payload)
  return data.leave
}

export async function fetchMyLeave() {
  const { data } = await apiClient.get('/leave/me')
  return data.leaves
}

export async function fetchAllLeave(params = {}) {
  const { data } = await apiClient.get('/leave', { params })
  return data.leaves
}

export async function fetchTeamLeave(params = {}) {
  const { data } = await apiClient.get('/leave/team', { params })
  return data.leaves
}

export async function approveLeave(id) {
  const { data } = await apiClient.put(`/leave/${id}/approve`)
  return data.leave
}

export async function rejectLeave(id) {
  const { data } = await apiClient.put(`/leave/${id}/reject`)
  return data.leave
}