import apiClient from './apiClient.js'

export async function fetchAdminStats() {
  const { data } = await apiClient.get('/dashboard/admin-stats')
  return data
}