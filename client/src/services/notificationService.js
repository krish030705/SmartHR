import apiClient from './apiClient.js'

export async function fetchNotifications() {
  const { data } = await apiClient.get('/notifications')
  return data
}

export async function markNotificationRead(id) {
  const { data } = await apiClient.put(`/notifications/${id}/read`)
  return data.notification
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.put('/notifications/read-all')
  return data
}