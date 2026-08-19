import apiClient from './apiClient.js'

export async function fetchHolidays() {
  const { data } = await apiClient.get('/holidays')
  return data.holidays
}

export async function createHoliday(payload) {
  const { data } = await apiClient.post('/holidays', payload)
  return data.holiday
}

export async function updateHoliday(id, payload) {
  const { data } = await apiClient.put(`/holidays/${id}`, payload)
  return data.holiday
}

export async function deleteHoliday(id) {
  const { data } = await apiClient.delete(`/holidays/${id}`)
  return data
}