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
  return Number(event?.photoCount ?? event?.photosCount ?? event?.totalPhotos ?? 0)
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
        if (active) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.title ||
              'Unable to load your assigned events. Please try again.'
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

  const firstEventId = events.length ? getEventId(events[0]) : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/team" className="text-xl font-bold tracking-tight text-indigo-700">
            PhotoShare <span className="font-medium text-slate-500">Team</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              Team workspace
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Team dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your assigned events and upload event photos.
            </p>
          </div>

          {firstEventId != null && (
            <Link
              to={`/team/events/${firstEventId}/upload`}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Upload photos
            </Link>
          )}
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Assigned events</p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? '—' : events.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Photos uploaded</p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? '—' : totalPhotos}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Upcoming events</p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? '—' : upcomingEvents}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">My events</h2>
              <p className="mt-1 text-sm text-slate-500">
                Open an event to view details or upload photos.
              </p>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading your events…
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <h3 className="text-lg font-semibold">No events assigned yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Events assigned to your team will appear here.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event, index) => {
                const id = getEventId(event)
                const name = getEventName(event)
                const location =
                  event?.location ?? event?.venue ?? event?.place ?? 'Location not specified'
                const date =
                  event?.date ?? event?.eventDate ?? event?.startDate

                return (
                  <article
                    key={id ?? index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="h-2 bg-indigo-600" />

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold">{name}</h3>
                        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {getPhotoCount(event)} photos
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">Date:</span>{' '}
                        {formatDate(date)}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">Location:</span>{' '}
                        {location}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Link
                          to={`/team/events/${id}`}
                          className="rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-semibold hover:bg-slate-50"
                        >
                          View details
                        </Link>

                        <Link
                          to={`/team/events/${id}/upload`}
                          className="rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
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
      </main>
    </div>
  )
}

export default Dashboard
