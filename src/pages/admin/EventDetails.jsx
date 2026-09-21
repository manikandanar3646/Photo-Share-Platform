import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

import { getEvent } from '../../services/eventService'
import {
  getEventMembers,
  removeEventMember
} from '../../services/eventMemberService'
import { getEventPhotos } from '../../services/photoService'

function EventDetails() {
  const { eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [members, setMembers] = useState([])
  const [photos, setPhotos] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData() {
    if (!eventId) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const [eventData, memberData, photoData] =
        await Promise.all([
          getEvent(eventId),
          getEventMembers(eventId),
          getEventPhotos(eventId)
        ])

      setEvent(eventData || null)
      setMembers(Array.isArray(memberData) ? memberData : [])
      setPhotos(Array.isArray(photoData) ? photoData : [])
    } catch (err) {
      console.error('Failed to load event:', err)
      setError('Failed to load event details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!eventId) {
        return
      }

      try {
        setLoading(true)
        setError('')

        const [eventData, memberData, photoData] =
          await Promise.all([
            getEvent(eventId),
            getEventMembers(eventId),
            getEventPhotos(eventId)
          ])

        if (!ignore) {
          setEvent(eventData || null)
          setMembers(
            Array.isArray(memberData) ? memberData : []
          )
          setPhotos(
            Array.isArray(photoData) ? photoData : []
          )
        }
      } catch (err) {
        console.error('Failed to load event:', err)

        if (!ignore) {
          setError('Failed to load event details.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [eventId])

  async function handleRemoveMember(userId) {
    const confirmed = window.confirm(
      'Remove this member from the event?'
    )

    if (!confirmed) {
      return
    }

    try {
      await removeEventMember(eventId, userId)

      await loadData()
    } catch (err) {
      console.error(err)
      setError('Failed to remove team member.')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6">
            <Link
              to="/admin/events"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Events
            </Link>
          </div>

          {loading && (
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-500">
                Loading event...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {!loading && !error && !event && (
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-500">
                Event not found.
              </p>
            </div>
          )}

          {!loading && event && (
            <>
              {/* Event information */}

              <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {event.name}
                    </h1>

                    <p className="text-gray-600 mt-2">
                      {event.description || 'No description'}
                    </p>
                  </div>

                  <Link
                    to={`/admin/events/${event.id}/upload-photos`}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                  >
                    Upload Photos
                  </Link>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Event Date
                    </p>

                    <p className="font-semibold mt-1">
                      {event.eventDate
                        ? new Date(
                            event.eventDate
                          ).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <p className="font-semibold mt-1">
                      {event.location || 'Not specified'}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Photos
                    </p>

                    <p className="font-semibold mt-1">
                      {photos.length}
                    </p>
                  </div>

                </div>
              </div>

              {/* Team */}

              <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      Event Team
                    </h2>

                    <p className="text-gray-500">
                      Members assigned to this event.
                    </p>
                  </div>
                </div>

                {members.length === 0 ? (
                  <p className="text-gray-500">
                    No team members assigned.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => {
                      const userId =
                        member.userId ??
                        member.UserId ??
                        member.user?.id ??
                        member.User?.Id

                      const name =
                        member.user?.name ??
                        member.user?.Name ??
                        member.name ??
                        member.Name ??
                        `User ${userId}`

                      return (
                        <div
                          key={member.id ?? userId}
                          className="flex items-center justify-between border rounded-lg p-4"
                        >
                          <div>
                            <p className="font-medium">
                              {name}
                            </p>

                            <p className="text-sm text-gray-500">
                              User ID: {userId}
                            </p>
                          </div>

                          {userId && (
                            <button
                              onClick={() =>
                                handleRemoveMember(userId)
                              }
                              className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>

              {/* Photos */}

              <div className="bg-white rounded-xl shadow p-6">

                <div className="mb-5">
                  <h2 className="text-xl font-bold">
                    Event Photos
                  </h2>

                  <p className="text-gray-500">
                    Photos uploaded for this event.
                  </p>
                </div>

                {photos.length === 0 ? (
                  <p className="text-gray-500">
                    No photos uploaded yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="border rounded-xl overflow-hidden"
                      >
                        {photo.storageUrl ? (
                          <img
                            src={photo.storageUrl}
                            alt={photo.fileName || 'Event photo'}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">
                              Photo
                            </span>
                          </div>
                        )}

                        <div className="p-3">
                          <p className="text-sm font-medium truncate">
                            {photo.fileName || 'Photo'}
                          </p>

                          {photo.fileSize && (
                            <p className="text-xs text-gray-500 mt-1">
                              {photo.fileSize} bytes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}

export default EventDetails