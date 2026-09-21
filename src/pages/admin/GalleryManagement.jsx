import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../../services/eventService'
import { getEventPhotos } from '../../services/photoService'
import {
  createGallery,
  addPhotosToGallery,
  publishGallery
} from '../../services/galleryService'

function normalizePhoto(photo) {
  return {
    ...photo,

    name:
      photo.fileName ||
      photo.name ||
      `Photo ${photo.id}`,

    url:
      photo.fileUrl ||
      photo.url ||
      ''
  }
}

export default function GalleryManagement() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState('')

  const [eventPhotos, setEventPhotos] = useState([])
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const [galleryName, setGalleryName] = useState('')
  const [pin, setPin] = useState('')

  const [galleryId, setGalleryId] = useState(null)
  const [galleryToken, setGalleryToken] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const [loading, setLoading] = useState(true)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /*
   * Load events
   */
  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setError('')

        const data = await getEvents()

        if (ignore) {
          return
        }

        const eventList = Array.isArray(data)
          ? data
          : []

        setEvents(eventList)

        if (eventList.length > 0) {
          setEventId(String(eventList[0].id))
        }
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError('Failed to load events.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  /*
   * Load event photos
   */
  useEffect(() => {
    if (!eventId) {
      return
    }

    let ignore = false

    async function loadPhotos() {
      try {
        setLoadingPhotos(true)
        setError('')
        setSuccess('')

        const data = await getEventPhotos(eventId)

        if (ignore) {
          return
        }

        const photos = Array.isArray(data)
          ? data.map(normalizePhoto)
          : []

        setEventPhotos(photos)

        /*
         * If Photos page passed selected photos through sessionStorage,
         * use those IDs. Otherwise select all photos.
         */
        let storedIds = []

        try {
          const stored = sessionStorage.getItem(
            'selectedGalleryPhotoIds'
          )

          if (stored) {
            storedIds = JSON.parse(stored)
          }
        } catch {
          storedIds = []
        }

        if (Array.isArray(storedIds) && storedIds.length > 0) {
          const validIds = photos
            .filter((photo) =>
              storedIds.includes(photo.id)
            )
            .map((photo) => photo.id)

          setSelectedPhotos(validIds)
        } else {
          setSelectedPhotos(
            photos.map((photo) => photo.id)
          )
        }

        sessionStorage.removeItem(
          'selectedGalleryPhotoIds'
        )
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError('Failed to load event photos.')
          setEventPhotos([])
          setSelectedPhotos([])
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
  }, [eventId])

  function togglePhoto(photoId) {
    setSelectedPhotos((current) => {
      if (current.includes(photoId)) {
        return current.filter(
          (id) => id !== photoId
        )
      }

      return [...current, photoId]
    })
  }

  function selectAllPhotos() {
    setSelectedPhotos(
      eventPhotos.map((photo) => photo.id)
    )
  }

  function clearPhotos() {
    setSelectedPhotos([])
  }

  async function handlePublish() {
    setError('')
    setSuccess('')

    if (!eventId) {
      setError('Please select an event.')
      return
    }

    if (selectedPhotos.length === 0) {
      setError('Please select at least one photo.')
      return
    }

    if (!pin || pin.length < 4) {
      setError('Gallery PIN must contain at least 4 characters.')
      return
    }

    if (isPublished) {
      setError(
        'This gallery is already published. The current API does not provide a gallery update endpoint.'
      )
      return
    }

    try {
      setPublishing(true)

      /*
       * Step 1:
       * Create gallery
       */
      const gallery = await createGallery(
        eventId,
        pin
      )

      const createdGalleryId =
        gallery?.id ??
        gallery?.galleryId ??
        gallery?.Id

      const createdToken =
        gallery?.token ??
        gallery?.galleryToken ??
        gallery?.Token

      if (!createdGalleryId) {
        throw new Error(
          'Gallery ID was not returned by the server.'
        )
      }

      /*
       * Step 2:
       * Add selected photos
       */
      await addPhotosToGallery(
        createdGalleryId,
        selectedPhotos
      )

      /*
       * Step 3:
       * Publish gallery
       */
      await publishGallery(createdGalleryId)

      setGalleryId(createdGalleryId)
      setGalleryToken(createdToken || '')
      setIsPublished(true)

      setSuccess(
        'Gallery published successfully.'
      )
    } catch (err) {
      console.error(err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Failed to publish gallery.'

      setError(String(message))
    } finally {
      setPublishing(false)
    }
  }

  async function handleCopyLink() {
    if (!galleryToken) {
      return
    }

    const link =
      `${window.location.origin}/gallery/${galleryToken}`

    try {
      await navigator.clipboard.writeText(link)
      setSuccess('Gallery link copied.')
    } catch (err) {
      console.error(err)
      setError('Failed to copy gallery link.')
    }
  }

  const selectedEvent = events.find(
    (event) =>
      String(event.id) === String(eventId)
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border rounded-xl p-8 text-center">
          <p className="text-gray-500">
            Loading galleries...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <Link
            to="/admin/galleries"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to Galleries
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Gallery Management
          </h1>

          <p className="text-gray-500 mt-1">
            Select photos and publish a customer gallery
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Gallery Information */}
      <div className="bg-white border rounded-xl p-6">

        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Gallery Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label
              htmlFor="event"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event
            </label>

            <select
              id="event"
              value={eventId}
              onChange={(event) => {
                setEventId(event.target.value)
                setGalleryId(null)
                setGalleryToken('')
                setIsPublished(false)
                setSuccess('')
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
          </div>

          <div>
            <label
              htmlFor="galleryName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gallery Name
            </label>

            <input
              id="galleryName"
              type="text"
              value={galleryName}
              onChange={(event) => {
                setGalleryName(event.target.value)
              }}
              placeholder="Enter gallery name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <p className="text-xs text-gray-400 mt-1">
              Display-only field with the current gallery API.
            </p>
          </div>

          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gallery PIN
            </label>

            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(event) => {
                setPin(event.target.value)
              }}
              placeholder="Enter gallery PIN"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

        </div>

      </div>

      {/* Selected Event */}
      {selectedEvent && (
        <div className="bg-white border rounded-xl p-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="font-semibold text-gray-900">
                {selectedEvent.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {eventPhotos.length} photos available
              </p>
            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={selectAllPhotos}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Select All
              </button>

              <button
                type="button"
                onClick={clearPhotos}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Photos */}
      <div className="bg-white border rounded-xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Select Photos
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {selectedPhotos.length} selected
            </p>
          </div>

        </div>

        {loadingPhotos ? (
          <div className="py-12 text-center text-gray-500">
            Loading photos...
          </div>
        ) : eventPhotos.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No photos available for this event.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {eventPhotos.map((photo) => {
              const selected =
                selectedPhotos.includes(photo.id)

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => togglePhoto(photo.id)}
                  className={`text-left rounded-xl overflow-hidden border-2 transition ${
                    selected
                      ? 'border-gray-900'
                      : 'border-transparent'
                  }`}
                >

                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                      Preview unavailable
                    </div>
                  )}

                  <div className="p-3 bg-white">

                    <p className="font-medium text-gray-900 truncate">
                      {photo.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {selected ? 'Selected' : 'Click to select'}
                    </p>

                  </div>

                </button>
              )
            })}

          </div>
        )}

      </div>

      {/* Publish */}
      <div className="bg-white border rounded-xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Publish Gallery
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Customers will access the gallery using the shareable link and PIN.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || isPublished}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing
              ? 'Publishing...'
              : isPublished
                ? 'Published'
                : 'Publish Gallery'}
          </button>

        </div>

        {/* Published Gallery */}
        {isPublished && galleryToken && (
          <div className="mt-6 border-t pt-6">

            <p className="text-sm font-medium text-gray-700 mb-2">
              Customer Gallery Link
            </p>

            <div className="flex flex-col md:flex-row gap-3">

              <input
                type="text"
                readOnly
                value={`${window.location.origin}/gallery/${galleryToken}`}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
              />

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Copy Link
              </button>

            </div>

            {galleryId && (
              <p className="text-xs text-gray-400 mt-2">
                Gallery ID: {galleryId}
              </p>
            )}

          </div>
        )}

      </div>

    </div>
  )
}