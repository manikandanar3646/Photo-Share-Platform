import api from './api'

export async function getEvents() {
  const response = await api.get('/Event')

  const data = response.data

  if (Array.isArray(data)) {
    return data
  }

  return data?.events || []
}

export async function createEvent(eventData) {
  const response = await api.post('/Event', eventData)

  return response.data
}

export async function getEvent(eventId) {
  const events = await getEvents()

  return events.find(
    (event) => Number(event.id) === Number(eventId)
  )
}