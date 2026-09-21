import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getEvents } from '../../services/eventService'

function Dashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const data = await getEvents()

        if (!ignore) {
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load events:', err)

        if (!ignore) {
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="text-gray-600 mt-1">
                Welcome to PhotoShare.
              </p>
            </div>

            <Link
              to="/admin/events/create"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Event
            </Link>
          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500 text-sm">
                Total Events
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : events.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500 text-sm">
                Active Events
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : events.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500 text-sm">
                Platform
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                PhotoShare
              </p>
            </div>

          </div>

          {/* Events */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Events
                </h2>

                <p className="text-gray-500">
                  Manage your photography events.
                </p>
              </div>

              <Link
                to="/admin/events"
                className="text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>

            {loading && (
              <p className="text-gray-500">
                Loading events...
              </p>
            )}

            {!loading && error && (
              <p className="text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && events.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  No events found.
                </p>

                <Link
                  to="/admin/events/create"
                  className="inline-block px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Your First Event
                </Link>
              </div>
            )}

            {!loading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.slice(0, 6).map((event) => (
                  <Link
                    key={event.id}
                    to={`/admin/events/${event.id}`}
                    className="border rounded-xl p-5 hover:shadow-md transition bg-white"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">
                      {event.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      {event.description || 'No description'}
                    </p>

                    {event.eventDate && (
                      <p className="text-gray-500 text-sm mt-3">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    )}

                    {event.location && (
                      <p className="text-gray-500 text-sm mt-1">
                        {event.location}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}

          </div>

          {/* Quick Actions */}

          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <p className="text-gray-500 mt-1">
                Quickly manage your photos and galleries.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/admin/photos/upload"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Photos
              </Link>

              <Link
                to="/admin/galleries"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Manage Galleries
              </Link>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard