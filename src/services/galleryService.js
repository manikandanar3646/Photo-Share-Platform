import api from './api'

export async function createGallery(eventId, pin) {
  const response = await api.post('/galleries', {
    eventId: Number(eventId),
    pin
  })

  return response.data
}

export async function addPhotosToGallery(
  galleryId,
  photoIds
) {
  const response = await api.post(
    `/galleries/${galleryId}/photos`,
    {
      photoIds: photoIds.map(Number)
    }
  )

  return response.data
}

export async function publishGallery(galleryId) {
  const response = await api.post(
    `/galleries/${galleryId}/publish`
  )

  return response.data
}

export async function verifyGalleryPin(token, pin) {
  const response = await api.post(
    `/galleries/public/${token}/verify`,
    {
      pin
    }
  )

  return response.data
}