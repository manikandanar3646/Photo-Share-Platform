
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { uploadPhoto } from '../../services/photoService'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function UploadPhotos() {
  const { eventId } = useParams()

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filesRef = useRef([])
  const uploadingRef = useRef(false)

  useEffect(() => {
    filesRef.current = files
  }, [files])

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview)
      })
    }
  }, [])

  function clearPreviews(items) {
    items.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview)
      }
    })
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || [])

    // Allow the same file to be selected again later.
    event.target.value = ''

    if (!selectedFiles.length || uploadingRef.current) {
      return
    }

    setError('')
    setSuccess('')

    const validFiles = []
    const rejectedFiles = []

    selectedFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        rejectedFiles.push(`${file.name}: use JPG, PNG or WEBP`)
      } else if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        rejectedFiles.push(`${file.name}: file must be greater than 0 and at most 10 MB`)
      } else {
        validFiles.push(file)
      }
    })

    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setFiles((currentFiles) => [
      ...currentFiles,
      ...filesWithPreview,
    ])

    if (rejectedFiles.length) {
      setError(`Some files were skipped: ${rejectedFiles.join('; ')}.`)
    }
  }

  function removeFile(index) {
    if (uploadingRef.current) return

    setFiles((currentFiles) => {
      const item = currentFiles[index]

      if (item?.preview) {
        URL.revokeObjectURL(item.preview)
      }

      return currentFiles.filter((_, i) => i !== index)
    })

    setError('')
    setSuccess('')
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (uploadingRef.current) return

    setError('')
    setSuccess('')
    setUploadProgress(0)

    if (!eventId) {
      setError('Event ID is missing. Return to your assigned event and try again.')
      return
    }

    if (!files.length) {
      setError('Please select at least one photo.')
      return
    }

    uploadingRef.current = true
    setUploading(true)

    // Keep a stable snapshot for this upload operation.
    const filesToUpload = [...files]
    let uploadedCount = 0

    try {
      for (const item of filesToUpload) {
        await uploadPhoto(eventId, item.file)

        uploadedCount += 1

        setUploadProgress(
          Math.round((uploadedCount / filesToUpload.length) * 100)
        )
      }

      clearPreviews(filesToUpload)
      setFiles([])
      setSuccess(
        `${uploadedCount} photo${uploadedCount === 1 ? '' : 's'} uploaded successfully.`
      )
    } catch (err) {
      console.error('Team photo upload failed:', err)
      console.error('HTTP status:', err?.response?.status)
      console.error('API response:', err?.response?.data)

      const status = err?.response?.status
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.title

      let reason = apiMessage || 'Photo upload failed. Please try again.'

      if (!err?.response) {
        reason =
          'Could not reach the upload API. Check your connection and try again.'
      } else if (status === 401) {
        reason = 'Your session may have expired. Sign in again and retry.'
      } else if (status === 403) {
        reason = 'You may not have permission to upload photos to this event.'
      } else if (status === 413) {
        reason = 'The server rejected the file because it is too large.'
      }

      if (uploadedCount > 0) {
        // Remove only successfully uploaded items; retain failed and
        // not-yet-uploaded items so they can be retried.
        const remainingFiles = filesToUpload.slice(uploadedCount)
        const uploadedFiles = filesToUpload.slice(0, uploadedCount)

        clearPreviews(uploadedFiles)
        setFiles(remainingFiles)

        setError(
          `${uploadedCount} photo${uploadedCount === 1 ? '' : 's'} uploaded successfully. The remaining ${remainingFiles.length} photo${remainingFiles.length === 1 ? '' : 's'} were not confirmed as uploaded. ${reason}`
        )
      } else {
        setError(reason)
      }
    } finally {
      uploadingRef.current = false
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="w-full px-4 sm:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              PhotoShare
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Team Member Portal
            </p>
          </div>

          <Link
            to={`/team/events/${eventId}`}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium hover:bg-gray-50 transition"
          >
            Back to Event
          </Link>
        </div>
      </header>

      <main className="w-full px-4 sm:px-8 py-8">
        <div className="mb-8">
          <Link
            to={`/team/events/${eventId}`}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            ← Back to Event
          </Link>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Upload Photos
          </h2>

          <p className="mt-1 text-gray-500">
            Upload photos for your assigned event.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4"
          >
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 px-6 py-4"
          >
            <p className="text-sm font-medium text-green-700">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div className="bg-white border rounded-xl p-6">
            <label
              htmlFor="team-event-id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event ID
            </label>

            <input
              id="team-event-id"
              type="text"
              value={eventId || ''}
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div className="bg-white border rounded-xl p-6 mt-6">
            <label
              htmlFor="team-photo-upload"
              className={`block border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center transition ${
                uploading
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-4">📷</div>

              <p className="font-medium text-gray-900">
                Choose photos to upload
              </p>

              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or WEBP · Maximum 10 MB per photo
              </p>

              <span className="inline-block mt-5 px-5 py-2.5 rounded-lg border text-sm font-medium bg-white">
                Browse Photos
              </span>

              <input
                id="team-photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="bg-white border rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Selected Photos
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Review the photos before uploading.
                  </p>
                </div>

                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {files.length} file{files.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="border rounded-xl overflow-hidden bg-white"
                  >
                    <div className="relative">
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-full h-52 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                        aria-label={`Remove ${item.file.name}`}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 text-gray-700 hover:bg-white shadow-md flex items-center justify-center text-lg disabled:opacity-50"
                      >
                        ×
                      </button>
                    </div>

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

          {uploading && (
            <div className="bg-white border rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  Uploading photos...
                </p>

                <p className="text-sm font-medium text-gray-900">
                  {uploadProgress}%
                </p>
              </div>

              <div
                className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 gap-4">
            <Link
              to={`/team/events/${eventId}`}
              onClick={(event) => {
                if (uploading) event.preventDefault()
              }}
              className={`px-5 py-2.5 rounded-lg border text-sm font-medium bg-white hover:bg-gray-50 transition ${
                uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="px-6 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? `Uploading ${uploadProgress}%`
                : 'Upload Photos'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default UploadPhotos
