import apiClient from './apiClient.js'

export async function listDepartments() {
  const { data } = await apiClient.get('/departments')
  return data.departments
}

export async function createDepartment(name) {
  const { data } = await apiClient.post('/departments', { name })
  return data.department
}

export async function updateDepartment(id, name) {
  const { data } = await apiClient.put(`/departments/${id}`, { name })
  return data.department
}

export async function deleteDepartment(id) {
  const { data } = await apiClient.delete(`/departments/${id}`)
  return data
}