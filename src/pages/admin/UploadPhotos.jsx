import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import Button from '../../components/Button'
import { getEvents } from '../../services/eventService'
import { uploadPhoto } from '../../services/photoService'

function UploadPhotos() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState('')
  const [files, setFiles] = useState([])

  const [loadingEvents, setLoadingEvents] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load events from backend
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true)
        setError('')

        const response = await getEvents()

        setEvents(Array.isArray(response) ? response : [])
      } catch (err) {
        console.error('Failed to load events:', err)

        setError(
          err.response?.data?.message ||
          'Failed to load events.'
        )
      } finally {
        setLoadingEvents(false)
      }
    }

    loadEvents()
  }, [])

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files)

    const validFiles = selectedFiles.filter((file) => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
      ]

      if (!validTypes.includes(file.type)) {
        return false
      }

      if (file.size > 10 * 1024 * 1024) {
        return false
      }

      return true
    })

    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setFiles((currentFiles) => [
      ...currentFiles,
      ...filesWithPreview
    ])

    event.target.value = ''
  }

  function removeFile(index) {
    setFiles((currentFiles) => {
      const fileToRemove = currentFiles[index]

      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }

      return currentFiles.filter(
        (_, fileIndex) => fileIndex !== index
      )
    })
  }

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview)
        }
      })
    }
  }, [files])

  async function handleUpload(event) {
    event.preventDefault()

    setMessage('')
    setError('')

    if (!eventId) {
      setError('Please select an event.')
      return
    }

    if (files.length === 0) {
      setError('Please select at least one photo.')
      return
    }

    try {
      setUploading(true)

      let uploadedCount = 0

      for (const item of files) {
        await uploadPhoto(eventId, item.file)
        uploadedCount++
      }

      setMessage(
        `${uploadedCount} photo${uploadedCount > 1 ? 's' : ''} uploaded successfully.`
      )

      files.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview)
        }
      })

      setFiles([])
    } catch (err) {
      console.error('Photo upload failed:', err)

      setError(
        err.response?.data?.message ||
        'Photo upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">

        <Link
          to="/admin/photos"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Photos
        </Link>

        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Upload Photos
        </h2>

        <p className="mt-1 text-gray-500">
          Upload photos for a photography event.
        </p>

      </div>

      <form
        onSubmit={handleUpload}
        className="max-w-5xl"
      >

        {/* Event Selection */}
        <div className="bg-white border rounded-xl p-6">

          <label
            htmlFor="event"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Event
          </label>

          <select
            id="event"
            value={eventId}
            onChange={(event) => setEventId(event.target.value)}
            disabled={loadingEvents || uploading}
            required
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

        {/* Messages */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* File Selection */}
        <div className="mt-6 bg-white border rounded-xl p-6">

          <label
            htmlFor="photo-upload"
            className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50"
          >

            <div className="text-4xl mb-3">
              📷
            </div>

            <p className="font-medium text-gray-900">
              Choose photos to upload
            </p>

            <p className="text-sm text-gray-500 mt-1">
              JPEG, PNG or WEBP · Maximum 10 MB per photo
            </p>

            <span className="inline-block mt-4 px-4 py-2 rounded-lg border text-sm font-medium">
              Browse Photos
            </span>

            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />

          </label>

        </div>

        {/* Selected Photos */}
        {files.length > 0 && (

          <div className="mt-6 bg-white border rounded-xl p-6">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Selected Photos
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Review the photos before uploading.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {files.length} files
              </span>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {files.map((item, index) => (

                <div
                  key={`${item.file.name}-${index}`}
                  className="border rounded-xl overflow-hidden bg-white"
                >

                  {/* Preview */}
                  <div className="relative">

                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-48 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow flex items-center justify-center"
                    >
                      ×
                    </button>

                  </div>

                  {/* File Information */}
                  <div className="p-4">

                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* Upload Button */}
        <div className="mt-6 flex justify-end">

          <Button
            type="submit"
            disabled={uploading || loadingEvents}
          >
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </Button>

        </div>

      </form>

    </AdminLayout>
  )
}

export default UploadPhotos