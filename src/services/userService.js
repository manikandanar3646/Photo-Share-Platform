import api from './api'

export async function getUsers() {
  const response = await api.get('/users')

  return response.data
}

export async function getUser(userId) {
  const response = await api.get(`/users/${userId}`)

  return response.data
}