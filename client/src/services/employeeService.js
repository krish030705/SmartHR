import apiClient from './apiClient.js'

export async function listEmployees(params = {}) {
  const { data } = await apiClient.get('/employees', { params })
  return data
}

export async function getEmployee(id) {
  const { data } = await apiClient.get(`/employees/${id}`)
  return data.employee
}

export async function createEmployee(payload) {
  const { data } = await apiClient.post('/employees', payload)
  return data
}

export async function updateEmployee(id, payload) {
  const { data } = await apiClient.put(`/employees/${id}`, payload)
  return data.employee
}

export async function deleteEmployee(id) {
  const { data } = await apiClient.delete(`/employees/${id}`)
  return data
}

export async function fetchManagers() {
  const { data } = await apiClient.get('/employees/managers')
  return data.managers
}