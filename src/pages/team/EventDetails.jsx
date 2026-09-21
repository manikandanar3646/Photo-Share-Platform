import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getEvents } from '../../services/eventService'
import { getEventPhotos } from '../../services/photoService'

function EventDetails() {
  const { eventId } = useParams()

  const [eventDetails, setEventDetails] =
    useState(null)

  const [eventPhotos, setEventPhotos] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [loadingPhotos, setLoadingPhotos] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let cancelled = false

    async function loadEvent() {
      try {
        const events = await getEvents()

        const eventList = Array.isArray(events)
          ? events
          : []

        const currentEvent =
          eventList.find(
            (event) =>
              String(event.id) ===
              String(eventId)
          )

        if (!cancelled) {
          if (!currentEvent) {
            setError('Event not found.')
          } else {
            setEventDetails(currentEvent)
          }

          setLoading(false)
        }
      } catch (err) {
        console.error(
          'Failed to load event:',
          err
        )

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            'Failed to load event.'
          )

          setLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      cancelled = true
    }
  }, [eventId])

  useEffect(() => {
    if (!eventId) {
      return
    }

    let cancelled = false

    async function loadPhotos() {
      try {
        setLoadingPhotos(true)

        const response =
          await getEventPhotos(eventId)

        if (!cancelled) {
          const data = Array.isArray(response)
            ? response
            : []

          const mappedPhotos = data.map((photo) => ({
            ...photo,
            name:
              photo.name ||
              photo.fileName ||
              `Photo ${photo.id}`,
            url:
              photo.url ||
              photo.fileUrl ||
              photo.storageUrl ||
              '',
            uploadedBy:
              photo.uploadedByName ||
              photo.uploadedBy?.name ||
              photo.uploadedBy ||
              'Unknown'
          }))

          setEventPhotos(mappedPhotos)
        }
      } catch (err) {
        console.error(
          'Failed to load photos:',
          err
        )

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            'Failed to load photos.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingPhotos(false)
        }
      }
    }

    loadPhotos()

    return () => {
      cancelled = true
    }
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-white border-b">

          <div className="w-full px-8 py-5">

            <h1 className="text-xl font-bold text-gray-900">
              PhotoShare
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Team Member Portal
            </p>

          </div>

        </header>

        <main className="w-full px-8 py-8">

          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            Loading event...
          </div>

        </main>

      </div>
    )
  }

  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-white border-b">

          <div className="w-full px-8 py-5">

            <h1 className="text-xl font-bold text-gray-900">
              PhotoShare
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Team Member Portal
            </p>

          </div>

        </header>

        <main className="w-full px-8 py-8">

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            {error || 'Event not found.'}
          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">

        <div className="w-full px-8 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                PhotoShare
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Team Member Portal
              </p>

            </div>

            <Link
              to="/team"
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>

          </div>

        </div>

      </header>

      {/* Main */}
      <main className="w-full px-8 py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <Link
              to="/team"
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Back to My Events
            </Link>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {eventDetails.name}
            </h2>

            <p className="mt-1 text-gray-500">
              Event details and photo uploads.
            </p>

          </div>

          <Link
            to={`/team/events/${eventId}/upload`}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Upload Photos
          </Link>

        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Event Information */}
        <div className="bg-white border rounded-xl p-6">

          <h3 className="text-lg font-semibold text-gray-900">
            Event Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <div>

              <p className="text-sm text-gray-500">
                Event Name
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {eventDetails.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Event Date
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {eventDetails.eventDate
                  ? new Date(
                      eventDetails.eventDate
                    ).toLocaleString()
                  : 'Not specified'}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {eventDetails.location ||
                  'Not specified'}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Your Role
              </p>

              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                Team
              </span>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Photos Uploaded
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {eventPhotos.length}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Status
              </p>

              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gray-900 text-white text-sm font-medium">
                Active
              </span>

            </div>

          </div>

        </div>

        {/* Upload Section */}
        <div className="bg-white border rounded-xl p-6 mt-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                Upload Event Photos
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Upload multiple photos from this event.
              </p>

            </div>

            <Link
              to={`/team/events/${eventId}/upload`}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
            >
              Upload Photos
            </Link>

          </div>

        </div>

        {/* Recent Photos */}
        <div className="bg-white border rounded-xl p-6 mt-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h3 className="text-lg font-semibold text-gray-900">
                Recent Photos
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Photos uploaded for this event.
              </p>

            </div>

            <span className="text-sm text-gray-600">
              {loadingPhotos
                ? 'Loading...'
                : `${eventPhotos.length} shown`}
            </span>

          </div>

          {loadingPhotos ? (

            <div className="py-10 text-center text-gray-500">
              Loading photos...
            </div>

          ) : eventPhotos.length === 0 ? (

            <div className="py-10 text-center">

              <p className="font-medium text-gray-900">
                No photos uploaded yet
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Upload photos for this event to see them here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {eventPhotos.map((photo) => (

                <div
                  key={photo.id}
                  className="border rounded-xl overflow-hidden"
                >

                  {photo.url ? (

                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-48 object-cover"
                    />

                  ) : (

                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      Image unavailable
                    </div>

                  )}

                  <div className="p-4">

                    <p className="font-medium text-gray-900 truncate">
                      {photo.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded by {photo.uploadedBy}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  )
}

export default EventDetails