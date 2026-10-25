import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMyEvents } from '../../services/teamService'

function formatDate(value) {
  if (!value) return 'Date not available'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Date not available'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
}

function EventDetails() {
  const { id } = useParams()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadEvent() {
      try {
        setLoading(true)
        setError('')

        const response = await getMyEvents()
        const events = Array.isArray(response)
          ? response
          : response?.events ?? []

        const selectedEvent = events.find(
          (item) => String(item.id ?? item.eventId) === String(id)
        )

        if (active) {
          if (selectedEvent) {
            setEvent(selectedEvent)
          } else {
            setError('The requested event could not be found.')
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              'Unable to load event details. Please try again.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEvent()

    return () => {
      active = false
    }
  }, [id])

  const eventName =
    event?.name ?? event?.eventName ?? event?.title ?? 'Untitled event'

  const eventDate =
    event?.date ?? event?.eventDate ?? event?.startDate

  const eventLocation =
    event?.location ?? event?.venue ?? event?.place ?? 'Not specified'

  const photos = Array.isArray(event?.photos)
    ? event.photos
    : Array.isArray(event?.images)
      ? event.images
      : []

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/team"
            className="text-xl font-bold tracking-tight text-indigo-700"
          >
            PhotoShare{' '}
            <span className="font-medium text-slate-500">Team</span>
          </Link>

          <Link
            to="/team"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              Loading event details…
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
            >
              {error}

              <div className="mt-4">
                <Link
                  to="/team"
                  className="font-semibold underline"
                >
                  Return to dashboard
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && event && (
            <>
              {/* Event heading */}
              <section className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Event overview
                </p>

                <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {eventName}
                </h1>

                <p className="mt-3 text-base leading-6 text-slate-600">
                  View event information and manage its photos.
                </p>
              </section>

              {/* Event information */}
              <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Event date
                    </p>

                    <p className="mt-2 break-words text-base font-semibold text-slate-900">
                      {formatDate(eventDate)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Location
                    </p>

                    <p className="mt-2 break-words text-base font-semibold text-slate-900">
                      {eventLocation}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Photos available
                    </p>

                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {photos.length}
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <Link
                    to={`/team/events/${id}/upload`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Upload photos
                  </Link>
                </div>
              </section>

              {/* Photo gallery */}
              <section>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      Event photos
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Photos associated with this event.
                    </p>
                  </div>

                  <span className="text-sm font-medium text-slate-500">
                    {photos.length} photos
                  </span>
                </div>

                {photos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      No photos to display
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Upload photos to start building this event's gallery.
                    </p>

                    <Link
                      to={`/team/events/${id}/upload`}
                      className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Upload the first photo
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {photos.map((photo, index) => {
                      const photoUrl =
                        typeof photo === 'string'
                          ? photo
                          : photo?.url ??
                            photo?.photoUrl ??
                            photo?.imageUrl

                      if (!photoUrl) return null

                      return (
                        <article
                          key={photo?.id ?? photo?.photoId ?? photoUrl ?? index}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${index + 1} from ${eventName}`}
                            loading="lazy"
                            className="aspect-square w-full object-cover"
                          />

                          <div className="p-4">
                            <p className="truncate text-sm font-medium text-slate-700">
                              {photo?.fileName ??
                                photo?.name ??
                                `Photo ${index + 1}`}
                            </p>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
export default EventDetails
