import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMyEvents } from '../../services/teamService'
import { getEventPhotos } from '../../services/photoService'

function formatDate(value) {
  if (!value) return 'Not specified'

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Not specified'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
}

function getEventId(event) {
  return event?.id ?? event?.eventId
}

function getEventName(event) {
  return event?.name ?? event?.eventName ?? event?.title ?? 'Untitled event'
}

function getPhotoUrl(photo) {
  return photo?.url ?? photo?.fileUrl ?? photo?.storageUrl ?? photo?.imageUrl ?? ''
}

function getPhotoName(photo, index) {
  return photo?.name ?? photo?.fileName ?? photo?.originalFileName ?? `Photo ${index + 1}`
}

function EventDetails() {
  const { eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [photosLoading, setPhotosLoading] = useState(true)
  const [error, setError] = useState('')
  const [photosError, setPhotosError] = useState('')

  useEffect(() => {
    let active = true

    async function loadEvent() {
      setLoading(true)
      setError('')
      setPhotosLoading(true)
      setPhotosError('')
      setEvent(null)
      setPhotos([])

      try {
        const data = await getMyEvents()
        const events = Array.isArray(data) ? data : data?.events ?? []
        const found = events.find(
          (item) => String(getEventId(item)) === String(eventId)
        )

        if (!active) return

        if (!found) {
          setError('This event could not be found in your assigned events.')
          setLoading(false)
          setPhotosLoading(false)
          return
        }

        setEvent(found)
        setLoading(false)

        try {
          const photoData = await getEventPhotos(eventId)
          if (!active) return

          const list = Array.isArray(photoData)
            ? photoData
            : photoData?.photos ?? photoData?.items ?? []

          setPhotos(list)
        } catch (err) {
          if (!active) return
          setPhotosError(
            err.response?.data?.message ||
              'The event loaded, but its photos could not be retrieved.'
          )
        } finally {
          if (active) setPhotosLoading(false)
        }
      } catch (err) {
        if (!active) return
        setError(
          err.response?.data?.message ||
            err.response?.data?.title ||
            'Unable to load event details. Please try again.'
        )
        setLoading(false)
        setPhotosLoading(false)
      }
    }

    loadEvent()

    return () => {
      active = false
    }
  }, [eventId])

  const eventName = event ? getEventName(event) : 'Event details'
  const eventDate = event?.date ?? event?.eventDate ?? event?.startDate
  const location =
    event?.location ?? event?.venue ?? event?.place ?? 'Not specified'
  const description =
    event?.description ?? event?.details ?? 'No description provided.'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/team" className="text-xl font-bold text-indigo-700">
            PhotoShare <span className="font-medium text-slate-500">Team</span>
          </Link>

          <Link
            to="/team"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Loading event details…
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
          >
            {error}
            <div className="mt-4">
              <Link to="/team" className="font-semibold underline">
                Return to dashboard
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && event && (
          <>
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    Event overview
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {eventName}
                  </h1>
                  <p className="mt-3 max-w-2xl text-slate-600">
                    {description}
                  </p>
                </div>

                <Link
                  to={`/team/events/${eventId}/upload`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Upload photos
                </Link>
              </div>

              <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Event date</p>
                  <p className="mt-1 font-semibold">{formatDate(eventDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-1 font-semibold">{location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Photos available</p>
                  <p className="mt-1 font-semibold">
                    {photosLoading ? 'Loading…' : photos.length}
                  </p>
                </div>
              </div>
            </div>

            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold">Event photos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Photos uploaded for this event.
                </p>
              </div>

              {photosLoading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                  Loading photos…
                </div>
              )}

              {!photosLoading && photosError && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                >
                  {photosError}
                </div>
              )}

              {!photosLoading && !photosError && photos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <h3 className="text-lg font-semibold">No photos yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Upload the first photos for this event.
                  </p>
                  <Link
                    to={`/team/events/${eventId}/upload`}
                    className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Upload photos
                  </Link>
                </div>
              )}

              {!photosLoading && photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo, index) => {
                    const url = getPhotoUrl(photo)

                    return (
                      <article
                        key={photo?.id ?? photo?.photoId ?? `${url}-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                      >
                        {url ? (
                          <a href={url} target="_blank" rel="noreferrer">
                            <img
                              src={url}
                              alt={getPhotoName(photo, index)}
                              loading="lazy"
                              className="aspect-square w-full object-cover transition hover:scale-[1.02]"
                            />
                          </a>
                        ) : (
                          <div className="flex aspect-square items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500">
                            Image URL unavailable
                          </div>
                        )}

                        <div className="p-3">
                          <p className="truncate text-sm font-semibold">
                            {getPhotoName(photo, index)}
                          </p>
                          {photo?.uploadedAt && (
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(photo.uploadedAt)}
                            </p>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default EventDetails
