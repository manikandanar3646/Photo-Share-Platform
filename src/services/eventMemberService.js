import api from './api'

export async function getEventMembers(eventId) {
  const response = await api.get(
    `/events/${eventId}/members`
  )

  return response.data
}

export async function addEventMember(eventId, userId) {
  const response = await api.post(
    `/events/${eventId}/members`,
    {
      userId: Number(userId)
    }
  )

  return response.data
}

export async function removeEventMember(eventId, userId) {
  const response = await api.delete(
    `/events/${eventId}/members/${userId}`
  )

  return response.data
}