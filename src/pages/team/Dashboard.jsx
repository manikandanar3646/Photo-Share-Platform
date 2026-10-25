import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyEvents } from '../../services/teamService'
import { logout } from '../../services/authService'

function formatDate(value) {
  if (!value) return 'Date not available'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Date not available'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

function getEventId(event) {
  return event?.id ?? event?.eventId
}

function getEventName(event) {
  return event?.name ?? event?.eventName ?? event?.title ?? 'Untitled event'
}

function getPhotoCount(event) {
  return Number(
    event?.photoCount ?? event?.photosCount ?? event?.totalPhotos ?? 0
  )
}

function Dashboard() {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const data = await getMyEvents()

        if (active) {
          setEvents(Array.isArray(data) ? data : data?.events ?? [])
        }
      } catch (err) {
        console.error('Failed to load team events:', err)

        if (active) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.title ||
              'Unable to load your events. Please try again.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEvents()

    return () => {
      active = false
    }
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const totalPhotos = events.reduce(
    (total, event) => total + getPhotoCount(event),
    0
  )

  const upcomingEvents = events.filter((event) => {
    const value = event?.date ?? event?.eventDate ?? event?.startDate

    if (!value) return false

    const date = new Date(value)

    return !Number.isNaN(date.getTime()) && date >= new Date()
  }).length

  const statistics = [
    {
      label: 'Assigned events',
      value: loading ? '—' : events.length,
    },
    {
      label: 'Photos uploaded',
      value: loading ? '—' : totalPhotos,
    },
    {
      label: 'Upcoming events',
      value: loading ? '—' : upcomingEvents,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link
            to="/team"
            className="text-xl font-bold tracking-tight text-indigo-700"
          >
            PhotoShare{' '}
            <span className="font-medium text-slate-500">Team</span>
          </Link>

          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">
              Team workspace
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="w-full max-w-none">
          {/* Welcome section */}
          <section className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Team dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600">
                Manage your assigned events and upload event photos.
              </p>
            </div>

            {events.length > 0 && getEventId(events[0]) != null && (
              <Link
                to={`/team/events/${getEventId(events[0])}/upload`}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Upload photos
              </Link>
            )}
          </section>

          {/* Statistics */}
          <section
            aria-label="Event statistics"
            className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {statistics.map((statistic) => (
              <article
                key={statistic.label}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <p className="text-sm font-medium text-slate-500">
                  {statistic.label}
                </p>

                <p className="mt-4 text-3xl font-bold leading-tight text-slate-900">
                  {statistic.value}
                </p>
              </article>
            ))}
          </section>

          {/* Events */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                My events
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Open an event to view details or upload photos.
              </p>
            </div>

            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Loading your events…
              </div>
            )}

            {!loading && error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && events.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  No events assigned yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Events assigned to your team will appear here.
                </p>
              </div>
            )}

            {!loading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {events.map((event, index) => {
                  const id = getEventId(event)
                  const name = getEventName(event)

                  const location =
                    event?.location ??
                    event?.venue ??
                    event?.place ??
                    'Location not specified'

                  const date =
                    event?.date ?? event?.eventDate ?? event?.startDate

                  return (
                    <article
                      key={id ?? index}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="h-2 w-full shrink-0 bg-indigo-600" />

                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <div className="flex min-w-0 items-start justify-between gap-4">
                          <h3 className="min-w-0 break-words text-xl font-bold leading-7 text-slate-900">
                            {name}
                          </h3>

                          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                            {getPhotoCount(event)} photos
                          </span>
                        </div>

                        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                          <p className="break-words">
                            <span className="font-semibold text-slate-800">
                              Date:
                            </span>{' '}
                            {formatDate(date)}
                          </p>

                          <p className="break-words">
                            <span className="font-semibold text-slate-800">
                              Location:
                            </span>{' '}
                            {location}
                          </p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Link
                            to={`/team/events/${id}`}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View details
                          </Link>

                          <Link
                            to={`/team/events/${id}/upload`}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            Upload photos
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
export default Dashboard
