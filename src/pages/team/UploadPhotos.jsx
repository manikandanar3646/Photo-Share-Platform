import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { uploadPhoto } from '../../services/photoService'

function UploadPhotos() {
  const { eventId } = useParams()

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filesRef = useRef([])

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

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files)

    if (selectedFiles.length === 0) {
      return
    }

    setError('')
    setSuccess('')

    const filesWithPreview = selectedFiles.map((file) => ({
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
      const itemToRemove = currentFiles[index]

      if (itemToRemove?.preview) {
        URL.revokeObjectURL(itemToRemove.preview)
      }

      return currentFiles.filter(
        (_, fileIndex) => fileIndex !== index
      )
    })

    setError('')
    setSuccess('')
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (files.length === 0) {
      setError('Please select at least one photo.')
      return
    }

    if (!eventId) {
      setError('Event ID is missing.')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    let uploadedCount = 0

    try {
      for (const item of files) {
        await uploadPhoto(eventId, item.file)

        uploadedCount += 1

        setUploadProgress(
          Math.round((uploadedCount / files.length) * 100)
        )
      }

      setSuccess(
        `${uploadedCount} photo${
          uploadedCount === 1 ? '' : 's'
        } uploaded successfully.`
      )

      files.forEach((item) => {
        URL.revokeObjectURL(item.preview)
      })

      setFiles([])
    } catch (err) {
      console.error('Photo upload failed:', err)
      console.error('Status:', err?.response?.status)
      console.error('Response:', err?.response?.data)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        'Failed to upload photo.'

      setError(
        uploadedCount > 0
          ? `${uploadedCount} photo${
              uploadedCount === 1 ? '' : 's'
            } uploaded successfully, but another photo failed. ${message}`
          : message
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white border-b">
        <div className="w-full px-8 py-5">

          <div className="flex items-center justify-between">

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
              className="px-5 py-2.5 rounded-lg border text-sm font-medium hover:bg-gray-50 transition"
            >
              Back to Event
            </Link>

          </div>

        </div>
      </header>

      <main className="w-full px-8 py-8">

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
            Upload photos for Wedding Photography.
          </p>

        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
            <p className="text-sm font-medium text-green-700">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleUpload}>

          <div className="bg-white border rounded-xl p-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event
            </label>

            <input
              type="text"
              value="Wedding Photography"
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500"
            />

          </div>

          <div className="bg-white border rounded-xl p-6 mt-6">

            <label
              htmlFor="team-photo-upload"
              className={`block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition ${
                uploading
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:bg-gray-50'
              }`}
            >

              <div className="text-4xl mb-4">
                📷
              </div>

              <p className="font-medium text-gray-900">
                Choose photos to upload
              </p>

              <p className="text-sm text-gray-500 mt-1">
                You can select multiple JPG, PNG or WEBP images.
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
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 text-gray-700 hover:bg-white shadow-md flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`
                  }}
                />
              </div>

            </div>
          )}

          <div className="flex items-center justify-between mt-6">

            <Link
              to={`/team/events/${eventId}`}
              className={`px-5 py-2.5 rounded-lg border text-sm font-medium bg-white hover:bg-gray-50 transition ${
                uploading
                  ? 'pointer-events-none opacity-50'
                  : ''
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