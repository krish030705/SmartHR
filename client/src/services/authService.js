import apiClient from './apiClient.js'

// Real implementation — return shape matches the Phase 1 mock, so
// LoginForm.jsx needed zero changes.
export async function login({ email, password, role }) {
  const { data } = await apiClient.post('/auth/login', { email, password, role })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data.user
}

export function logout() {
  localStorage.removeItem('smarthr_token')
  localStorage.removeItem('smarthr_user')
  sessionStorage.removeItem('smarthr_token')
  sessionStorage.removeItem('smarthr_user')
}