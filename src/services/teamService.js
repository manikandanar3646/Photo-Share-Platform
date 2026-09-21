import api from './api'

export async function getMyEvents() {
  const response = await api.get('/team/events')
  return response.data
}