import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { uploadPhoto } from '../../services/photoService'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function UploadPhotos() {
  const { eventId } = useParams()
  const inputRef = useRef(null)

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.preview))
    }
    // Preview URLs are managed when files are selected or removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFileSelection(event) {
    const selected = Array.from(event.target.files ?? [])
    const validFiles = []
    const invalidMessages = []

    selected.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        invalidMessages.push(`${file.name}: use JPG, PNG, or WEBP.`)
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        invalidMessages.push(`${file.name}: file size must be 10 MB or less.`)
        return
      }

      validFiles.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      })
    })

    setFiles((previous) => {
      previous.forEach((item) => URL.revokeObjectURL(item.preview))
      return validFiles
    })

    setResults([])
    setCompleted(0)
    setSuccess('')
    setError(invalidMessages.join(' '))
    
    // Allow choosing the same file again after removing or retrying.
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeFile(fileId) {
    setFiles((previous) => {
      const removed = previous.find((item) => item.id === fileId)
      if (removed) URL.revokeObjectURL(removed.preview)

      return previous.filter((item) => item.id !== fileId)
    })

    setResults([])
    setSuccess('')
  }

  async function handleUpload() {
    if (!eventId) {
      setError('The event ID is missing. Return to the event page and try again.')
      return
    }

    if (files.length === 0) {
      setError('Please select at least one image before uploading.')
      return
    }

    setUploading(true)
    setCompleted(0)
    setResults([])
    setError('')
    setSuccess('')

    const uploadResults = []
    let succeeded = 0

    for (let index = 0; index < files.length; index += 1) {
      const item = files[index]

      try {
        await uploadPhoto(eventId, item.file)

        succeeded += 1
        uploadResults.push({
          id: item.id,
          name: item.file.name,
          status: 'success',
          message: 'Uploaded successfully',
        })
      } catch (err) {
        const status = err.response?.status
        let message =
          err.response?.data?.message ||
          err.response?.data?.title ||
          'Upload failed. Please try again.'

        if (status === 401) {
          message = 'Your session may have expired. Please sign in again.'
        } else if (status === 403) {
          message = 'You do not have permission to upload to this event.'
        } else if (status === 413) {
          message = 'The server rejected this file because it is too large.'
        } else if (!err.response) {
          message =
            'Could not reach the server. Check your connection and try again.'
        }

        uploadResults.push({
          id: item.id,
          name: item.file.name,
          status: 'error',
          message,
        })
      }

      setCompleted(index + 1)
      setResults([...uploadResults])
    }

    setUploading(false)

    if (succeeded === files.length) {
      setSuccess(
        `Successfully uploaded ${succeeded} photo${succeeded === 1 ? '' : 's'}.`
      )
      setFiles((previous) => {
        previous.forEach((item) => URL.revokeObjectURL(item.preview))
        return []
      })
    } else if (succeeded > 0) {
      setError(
        `${succeeded} of ${files.length} photos uploaded. Check the results below and retry the failed files.`
      )

      // Keep only failed files selected so the user can retry them.
      setFiles((previous) =>
        previous.filter((item) =>
          uploadResults.some(
            (result) => result.id === item.id && result.status === 'error'
          )
        )
      )
    } else {
      setError(
        'No photos were uploaded successfully. Check the results below and try again.'
      )
    }
  }

  const progress = files.length
    ? Math.round((completed / files.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/team" className="text-xl font-bold text-indigo-700">
            PhotoShare <span className="font-medium text-slate-500">Team</span>
          </Link>

          <Link
            to={`/team/events/${eventId}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            Back to event
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Team workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Upload event photos
          </h1>
          <p className="mt-2 text-slate-600">
            Select JPG, PNG, or WEBP images up to 10 MB each.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex min-h-52 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 px-5 py-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-700">
              +
            </span>
            <span className="font-semibold text-slate-900">
              Choose photos from your device
            </span>
            <span className="mt-2 text-sm text-slate-500">
              JPG, PNG, WEBP · Maximum 10 MB per file
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelection}
            disabled={uploading}
            className="hidden"
          />

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              {success}
              <div className="mt-2">
                <Link
                  to={`/team/events/${eventId}`}
                  className="font-semibold underline"
                >
                  View event photos
                </Link>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">
                  Selected photos ({files.length})
                </h2>
                <span className="text-sm text-slate-500">
                  {(
                    files.reduce((sum, item) => sum + item.file.size, 0) /
                    (1024 * 1024)
                  ).toFixed(2)}{' '}
                  MB total
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {files.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="aspect-square w-full object-cover"
                    />

                    <div className="p-3">
                      <p className="truncate text-sm font-semibold">
                        {item.file.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        disabled={uploading}
                        className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {uploading && (
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Uploading photos…
                    </span>
                    <span className="text-slate-500">
                      {completed} / {files.length}
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={files.length}
                    aria-valuenow={completed}
                    aria-label="Photo upload progress"
                  >
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFiles((previous) => {
                      previous.forEach((item) => URL.revokeObjectURL(item.preview))
                      return []
                    })
                    setError('')
                    setSuccess('')
                    setResults([])
                    setCompleted(0)
                  }}
                  disabled={uploading}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear selection
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : `Upload ${files.length} photo${files.length === 1 ? '' : 's'}`}
                </button>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="mb-4 text-lg font-bold">Upload results</h2>
              <ul className="space-y-3">
                {results.map((result) => (
                  <li
                    key={result.id}
                    className="flex flex-col gap-1 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="break-all text-sm font-medium">
                      {result.name}
                    </span>
                    <span
                      className={
                        result.status === 'success'
                          ? 'text-sm font-medium text-green-700'
                          : 'text-sm font-medium text-red-700'
                      }
                    >
                      {result.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <p className="mt-5 text-sm text-slate-500">
          Uploads are sent to the existing backend API. Keep this page open until
          the upload process finishes.
        </p>
      </main>
    </div>
  )
}

export default UploadPhotos
