import { useEffect, useState } from 'react'

import AdminLayout from '../../layouts/AdminLayout'
import Button from '../../components/Button'
import Modal from '../../components/Modal'

import { getEvents } from '../../services/eventService'
import { createGallery } from '../../services/galleryService'

function Galleries() {
  const [showModal, setShowModal] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState(null)

  const [events, setEvents] = useState([])
  const [galleries, setGalleries] = useState([])

  const [selectedEventId, setSelectedEventId] = useState('')
  const [galleryName, setGalleryName] = useState('')
  const [pin, setPin] = useState('')

  const [loadingEvents, setLoadingEvents] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Load real events from backend
  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      try {
        setLoadingEvents(true)
        setError('')

        const data = await getEvents()

        if (ignore) {
          return
        }

        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)

        if (!ignore) {
          setError('Failed to load events.')
        }
      } finally {
        if (!ignore) {
          setLoadingEvents(false)
        }
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  function handleCreateGallery() {
    setSelectedEventId('')
    setGalleryName('')
    setPin('')
    setError('')
    setShowModal(true)
  }

  function handleCloseModal() {
    if (creating) {
      return
    }

    setShowModal(false)
    setSelectedEventId('')
    setGalleryName('')
    setPin('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!selectedEventId) {
      setError('Please select an event.')
      return
    }

    if (!pin.trim()) {
      setError('Please enter a customer PIN.')
      return
    }

    if (!/^\d{4,6}$/.test(pin)) {
      setError('PIN must contain 4 to 6 digits.')
      return
    }

    try {
      setCreating(true)
      setError('')

      const response = await createGallery(
        selectedEventId,
        pin
      )

      const selectedEvent = events.find(
        (item) =>
          Number(item.id) === Number(selectedEventId)
      )

      /*
       * Gallery name is currently a frontend display field.
       * The current backend create-gallery API accepts eventId + pin.
       */
      const newGallery = {
        id:
          response?.id ??
          response?.galleryId ??
          Date.now(),

        name:
          galleryName.trim() ||
          selectedEvent?.name ||
          'Event Gallery',

        event:
          selectedEvent?.name ||
          'Unknown Event',

        eventId: Number(selectedEventId),

        photos:
          response?.photosCount ??
          response?.photoCount ??
          0,

        status:
          response?.isPublished ||
          response?.IsPublished
            ? 'Published'
            : 'Draft',

        pin: 'Enabled',

        createdAt: new Date().toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
        ),

        token:
          response?.token ??
          response?.Token ??
          null,

        link:
          response?.token ??
          response?.Token
            ? `/gallery/${
                response?.token ??
                response?.Token
              }`
            : null
      }

      setGalleries((current) => [
        newGallery,
        ...current
      ])

      setShowModal(false)
      setSelectedEventId('')
      setGalleryName('')
      setPin('')

    } catch (err) {
      console.error(err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        'Failed to create gallery.'

      setError(message)
    } finally {
      setCreating(false)
    }
  }

  const publishedCount = galleries.filter(
    (gallery) =>
      gallery.status === 'Published'
  ).length

  const draftCount = galleries.filter(
    (gallery) =>
      gallery.status === 'Draft'
  ).length

  return (
    <AdminLayout>

      {/* Page Header */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Galleries
          </h2>

          <p className="mt-1 text-gray-500">
            Create and manage customer photo galleries.
          </p>
        </div>

        <Button onClick={handleCreateGallery}>
          Create Gallery
        </Button>

      </div>

      {/* Error */}

      {error && !showModal && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Galleries
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {galleries.length}
          </h3>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Published
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {publishedCount}
          </h3>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Drafts
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {draftCount}
          </h3>
        </div>

      </div>

      {/* Gallery List */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="px-6 py-5 border-b">

          <h3 className="text-lg font-semibold text-gray-900">
            All Galleries
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Manage galleries shared with customers.
          </p>

        </div>

        {galleries.length === 0 ? (

          <div className="p-10 text-center">

            <p className="text-gray-500">
              No galleries created yet.
            </p>

            <button
              onClick={handleCreateGallery}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Create Your First Gallery
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Gallery
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Event
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Photos
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    PIN
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {galleries.map((gallery) => (

                  <tr
                    key={gallery.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium text-gray-900">
                        {gallery.name}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {gallery.event}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {gallery.photos}
                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {gallery.pin}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          gallery.status === 'Published'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {gallery.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {gallery.createdAt}
                    </td>

                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedGallery(gallery)
                        }
                        className="text-sm font-medium text-gray-700 hover:text-black"
                      >
                        Manage
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Create Gallery Modal */}

      {showModal && (

        <Modal
          title="Create Gallery"
          onClose={handleCloseModal}
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Event */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event
              </label>

              <select
                value={selectedEventId}
                onChange={(event) =>
                  setSelectedEventId(
                    event.target.value
                  )
                }
                required
                disabled={
                  loadingEvents || creating
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-white"
              >

                <option value="">
                  {loadingEvents
                    ? 'Loading events...'
                    : 'Select an event'}
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

            {/* Gallery Name */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Name
              </label>

              <input
                type="text"
                value={galleryName}
                onChange={(event) =>
                  setGalleryName(
                    event.target.value
                  )
                }
                placeholder="Enter gallery name"
                disabled={creating}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
              />

              <p className="mt-1 text-xs text-gray-500">
                Used as the gallery display name.
              </p>

            </div>

            {/* PIN */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength="6"
                value={pin}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      ''
                    )

                  setPin(value)
                }}
                placeholder="Enter gallery PIN"
                required
                disabled={creating}
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
              />

              <p className="mt-1 text-xs text-gray-500">
                Customers will need this PIN to access the gallery.
              </p>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={creating}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <Button type="submit" disabled={creating}>
                {creating
                  ? 'Creating...'
                  : 'Create Gallery'}
              </Button>

            </div>

          </form>

        </Modal>

      )}

      {/* Gallery Details Modal */}

      {selectedGallery && (

        <Modal
          title={selectedGallery.name}
          onClose={() =>
            setSelectedGallery(null)
          }
        >

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">
                Event
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {selectedGallery.event}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Photos
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {selectedGallery.photos} photos
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {selectedGallery.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Customer PIN
              </p>

              <p className="mt-1 font-medium text-gray-900">
                Enabled
              </p>
            </div>

            {selectedGallery.token && (

              <div>

                <p className="text-sm text-gray-500">
                  Shareable Gallery Link
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <input
                    type="text"
                    value={
                      `${window.location.origin}/gallery/${selectedGallery.token}`
                    }
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/gallery/${selectedGallery.token}`
                      )

                      alert(
                        'Gallery link copied.'
                      )
                    }}
                    className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                  >
                    Copy
                  </button>

                </div>

              </div>

            )}

            <div className="flex justify-end pt-2">

              <button
                type="button"
                onClick={() =>
                  setSelectedGallery(null)
                }
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800"
              >
                Close
              </button>

            </div>

          </div>

        </Modal>

      )}

    </AdminLayout>
  )
}

export default Galleries