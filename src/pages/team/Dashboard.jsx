import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyEvents } from '../../services/teamService'
import { logout } from '../../services/authService'

function Dashboard() {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const data = await getMyEvents()

        if (!ignore) {
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to load team events:', err)

        if (!ignore) {
          setError(
            err.response?.data?.message ||
            'Failed to load your assigned events.'
          )
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

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleEventDetails(eventId) {
    console.log('Opening event details:', eventId)

    navigate(`/team/events/${eventId}`)
  }

  function handleUploadPhotos(eventId) {
    console.log('Opening upload photos:', eventId)

    navigate(`/team/events/${eventId}/upload`)
  }

  function formatDate(date) {
    if (!date) {
      return 'Date not available'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date not available'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const totalPhotos = events.reduce(
    (total, event) => total + Number(event.photoCount || 0),
    0
  )

  const activeEvents = events.filter((event) => {
    if (!event.eventDate) {
      return false
    }

    const eventDate = new Date(event.eventDate)

    return eventDate >= new Date()
  })

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-white border-b border-gray-200">

        <div className="w-full px-8 py-5">

          <div className="flex items-center justify-between">

            {/* Logo */}

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                PhotoShare
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Team Member Portal
              </p>
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="relative z-50 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition"
            >
              Logout
            </button>

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="flex items-center gap-3 mt-6">

            <button
              type="button"
              onClick={() => navigate('/team')}
              className="relative z-50 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 cursor-pointer transition"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                const section = document.getElementById('my-events')

                if (section) {
                  section.scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              }}
              className="relative z-50 px-5 py-2.5 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer transition"
            >
              My Events
            </button>

            <button
              type="button"
              onClick={() => {
                const section = document.getElementById('my-events')

                if (section) {
                  section.scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              }}
              className="relative z-50 px-5 py-2.5 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 cursor-pointer transition"
            >
              Upload Photos
            </button>

          </nav>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="w-full px-8 py-8">

        {/* Page Heading */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Team Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            View your assigned events and upload event photos.
          </p>

        </div>


        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4">

            <p className="font-medium text-red-700">
              {error}
            </p>

            <p className="text-sm text-red-600 mt-1">
              Check your login session and backend connection.
            </p>

          </div>
        )}


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* Assigned Events */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Assigned Events
            </p>

            <h3 className="mt-3 text-4xl font-bold text-gray-900">
              {loading ? '...' : events.length}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Events assigned to you
            </p>

          </div>


          {/* Photos */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Photos Uploaded
            </p>

            <h3 className="mt-3 text-4xl font-bold text-gray-900">
              {loading ? '...' : totalPhotos}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Total photos uploaded
            </p>

          </div>


          {/* Active Events */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Active Events
            </p>

            <h3 className="mt-3 text-4xl font-bold text-gray-900">
              {loading ? '...' : activeEvents.length}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Upcoming events
            </p>

          </div>

        </div>


        {/* =====================================================
            MY EVENTS
        ===================================================== */}

        <section
          id="my-events"
          className="bg-white border border-gray-200 rounded-xl shadow-sm"
        >

          {/* Section Header */}

          <div className="px-6 py-5 border-b border-gray-200">

            <h3 className="text-xl font-semibold text-gray-900">
              My Events
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Events assigned to you.
            </p>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="px-6 py-16 text-center">

              <div className="inline-block">

                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

                <p className="text-gray-500 mt-4">
                  Loading your events...
                </p>

              </div>

            </div>
          )}


          {/* =================================================
              NO EVENTS
          ================================================= */}

          {!loading && !error && events.length === 0 && (
            <div className="px-6 py-16 text-center">

              <h4 className="text-lg font-semibold text-gray-900">
                No events assigned
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                You have not been assigned to any events yet.
              </p>

            </div>
          )}


          {/* =================================================
              EVENTS LIST
          ================================================= */}

          {!loading && events.length > 0 && (

            <div className="divide-y divide-gray-200">

              {events.map((event) => (

                <div
                  key={event.id}
                  className="px-6 py-7"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* =================================================
                        EVENT INFORMATION
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                      <h4 className="text-xl font-semibold text-gray-900">
                        {event.name || 'Unnamed Event'}
                      </h4>


                      {/* Date + Location */}

                      <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-500">

                        <span>
                          {formatDate(event.eventDate)}
                        </span>

                        {event.location && (
                          <>
                            <span>
                              •
                            </span>

                            <span>
                              {event.location}
                            </span>
                          </>
                        )}

                      </div>


                      {/* Description */}

                      {event.description && (
                        <p className="text-sm text-gray-500 mt-3 max-w-2xl">
                          {event.description}
                        </p>
                      )}


                      {/* Photo Count */}

                      <p className="text-sm font-medium text-gray-600 mt-3">
                        {Number(event.photoCount || 0)} photos uploaded
                      </p>

                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div
                      className="relative z-10 flex flex-wrap items-center gap-3 shrink-0"
                    >

                      {/* EVENT DETAILS BUTTON */}

                      <button
                        type="button"
                        onClick={() => handleEventDetails(event.id)}
                        className="relative z-50 inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition"
                      >
                        Event Details
                      </button>


                      {/* UPLOAD PHOTOS BUTTON */}

                      <button
                        type="button"
                        onClick={() => handleUploadPhotos(event.id)}
                        className="relative z-50 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:bg-black cursor-pointer transition"
                      >
                        Upload Photos
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default Dashboard