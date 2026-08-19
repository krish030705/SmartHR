import apiClient from './apiClient.js'

export async function generatePayroll(month) {
  const { data } = await apiClient.post('/payroll/generate', { month })
  return data
}

export async function fetchPayroll(params = {}) {
  const { data } = await apiClient.get('/payroll', { params })
  return data.records
}

export async function fetchMyPayroll() {
  const { data } = await apiClient.get('/payroll/me')
  return data.records
}

export async function updatePayroll(id, payload) {
  const { data } = await apiClient.put(`/payroll/${id}`, payload)
  return data.payroll
}