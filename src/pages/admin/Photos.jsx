import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { getEvents, getEvent } from '../../services/eventService'
import { getEventPhotos } from '../../services/photoService'
import PhotoCard from '../../components/PhotoCard'

function Photos() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [photos, setPhotos] = useState([])

  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setLoadingEvents(true)
        setError('')

        const data = await getEvents()

        if (!ignore) {
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)

        if (!ignore) {
          setError('Failed to load events.')
        }
      } finally {
        if (!ignore) {
          setLoadingEvents(false)
        }
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadPhotos() {
      if (!selectedEventId) {
        setSelectedEvent(null)
        setPhotos([])
        return
      }

      try {
        setLoadingPhotos(true)
        setError('')

        const [event, photoData] = await Promise.all([
          getEvent(selectedEventId),
          getEventPhotos(selectedEventId)
        ])

        if (!ignore) {
          setSelectedEvent(event || null)
          setPhotos(Array.isArray(photoData) ? photoData : [])
        }
      } catch (err) {
        console.error(err)

        if (!ignore) {
          setError('Failed to load photos.')
          setPhotos([])
        }
      } finally {
        if (!ignore) {
          setLoadingPhotos(false)
        }
      }
    }

    loadPhotos()

    return () => {
      ignore = true
    }
  }, [selectedEventId])

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Photos
            </h1>

            <p className="text-gray-600 mt-1">
              View photos uploaded for each event.
            </p>
          </div>

          {/* Event selector */}

          <div className="bg-white rounded-xl shadow p-6 mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event
            </label>

            {loadingEvents ? (
              <p className="text-gray-500">
                Loading events...
              </p>
            ) : (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full md:w-96 border rounded-lg px-4 py-3"
              >
                <option value="">
                  Select an event
                </option>

                {events.map((event) => (
                  <option
                    key={event.id}
                    value={event.id}
                  >
                    {event.name}
                  </option>
                ))}
              </select>
            )}

          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Selected event */}

          {selectedEvent && (
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedEvent.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {selectedEvent.description || 'No description'}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                {photos.length} photo{photos.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Photos */}

          {selectedEventId && loadingPhotos && (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <p className="text-gray-500">
                Loading photos...
              </p>
            </div>
          )}

          {selectedEventId &&
            !loadingPhotos &&
            photos.length === 0 && (
              <div className="bg-white rounded-xl shadow p-10 text-center">
                <p className="text-gray-500">
                  No photos uploaded for this event yet.
                </p>
              </div>
            )}

          {!loadingPhotos && photos.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default Photos