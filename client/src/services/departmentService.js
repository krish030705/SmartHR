import apiClient from './apiClient.js'

export async function listDepartments() {
  const { data } = await apiClient.get('/departments')
  return data.departments
}