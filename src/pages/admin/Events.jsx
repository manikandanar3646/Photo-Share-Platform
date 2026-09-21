import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { getEvents } from '../../services/eventService'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchEvents() {
      try {
        const data = await getEvents()

        if (!cancelled) {
          setEvents(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load events:', err)

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            'Failed to load events.'
          )
          setLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminLayout>
      <div className="w-full px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Events
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your photography events.
            </p>
          </div>

          <Link
            to="/admin/events/create"
            className="bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            + Create Event
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border rounded-xl p-8 text-center">
            <p className="text-gray-500">
              Loading events...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No events yet
            </h2>

            <p className="text-gray-500 mb-5">
              Create your first photography event.
            </p>

            <Link
              to="/admin/events/create"
              className="inline-block bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              Create Event
            </Link>
          </div>
        )}

        {/* Events */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-3">
                  {event.name}
                </h2>

                <p className="text-gray-500 mb-4">
                  {event.description || 'No description'}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">
                      Date:
                    </span>{' '}
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleString()
                      : 'Not specified'}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Location:
                    </span>{' '}
                    {event.location || 'Not specified'}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Event ID:
                    </span>{' '}
                    {event.id}
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/admin/events/${event.id}`}
                    className="inline-block border border-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default Events