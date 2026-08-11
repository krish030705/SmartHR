import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('smarthr_token') || sessionStorage.getItem('smarthr_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? 'Unable to reach the server. Please try again.' : error.message)
    return Promise.reject(new Error(message))
  },
)

export default apiClient