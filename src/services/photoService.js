import api from './api'

export async function uploadPhoto(eventId, file) {
  const formData = new FormData()

  formData.append('file', file)

  const response = await api.post(
    `/photos/upload/${eventId}`,
    formData
  )

  return response.data
}

export async function getEventPhotos(eventId) {
  const response = await api.get(
    `/photos/event/${eventId}`
  )

  return response.data
}