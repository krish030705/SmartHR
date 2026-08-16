import apiClient from './apiClient.js'

export async function checkIn() {
  const { data } = await apiClient.post('/attendance/check-in')
  return data.attendance
}

export async function checkOut() {
  const { data } = await apiClient.post('/attendance/check-out')
  return data.attendance
}

export async function fetchMyAttendance(params = {}) {
  const { data } = await apiClient.get('/attendance/me', { params })
  return data.records
}

export async function fetchAllAttendance(params = {}) {
  const { data } = await apiClient.get('/attendance', { params })
  return data.records
}

export async function fetchTeamAttendance(params = {}) {
  const { data } = await apiClient.get('/attendance/team', { params })
  return data.records
}