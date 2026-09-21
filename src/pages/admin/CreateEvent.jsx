import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { createEvent } from '../../services/eventService'

function CreateEvent() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    location: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Please enter an event name.')
      return
    }

    if (!formData.eventDate) {
      setError('Please select an event date.')
      return
    }

    if (!formData.location.trim()) {
      setError('Please enter a location.')
      return
    }

    try {
      setLoading(true)

      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        eventDate: new Date(formData.eventDate).toISOString(),
        location: formData.location.trim()
      }

      await createEvent(eventData)

      setSuccess('Event created successfully.')

      setTimeout(() => {
        navigate('/admin/events')
      }, 800)

    } catch (err) {
      console.error('Create event failed:', err)

      setError(
        err.response?.data?.message ||
        'Failed to create event. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="w-full px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create Event
          </h1>

          <p className="text-gray-500 mt-2">
            Create a new photography event.
          </p>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Event Name */}
            <div>
              <label className="block font-semibold mb-2">
                Event Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Arun & Priya Wedding"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black resize-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold mb-2">
                Event Date
              </label>

              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Chennai"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-4">
                {success}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-2">

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                disabled={loading}
                className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>
    </AdminLayout>
  )
}

export default CreateEvent