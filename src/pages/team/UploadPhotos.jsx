import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function UploadPhotos() {
  const { eventId } = useParams()
  const [files, setFiles] = useState([])

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files)

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
      URL.revokeObjectURL(currentFiles[index].preview)

      return currentFiles.filter((_, fileIndex) => fileIndex !== index)
    })
  }

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        URL.revokeObjectURL(item.preview)
      })
    }
  }, [files])

  function handleUpload(event) {
    event.preventDefault()

    if (files.length === 0) {
      alert('Please select at least one photo.')
      return
    }

    console.log(
      'Team photos ready for upload:',
      files.map((item) => item.file)
    )

    alert('Photo upload will be connected to the backend later.')
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
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

      {/* Main */}
      <main className="w-full px-8 py-8">

        {/* Page Header */}
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

        <form onSubmit={handleUpload}>

          {/* Event */}
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

          {/* Upload Area */}
          <div className="bg-white border rounded-xl p-6 mt-6">

            <label
              htmlFor="team-photo-upload"
              className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 transition"
            >

              <div className="text-4xl mb-4">
                📷
              </div>

              <p className="font-medium text-gray-900">
                Choose photos to upload
              </p>

              <p className="text-sm text-gray-500 mt-1">
                You can select multiple images.
              </p>

              <span className="inline-block mt-5 px-5 py-2.5 rounded-lg border text-sm font-medium bg-white">
                Browse Photos
              </span>

              <input
                id="team-photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          </div>

          {/* Selected Photos */}
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
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 text-gray-700 hover:bg-white shadow-md flex items-center justify-center text-lg"
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

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">

            <Link
              to={`/team/events/${eventId}`}
              className="px-5 py-2.5 rounded-lg border text-sm font-medium bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Upload Photos
            </button>

          </div>

        </form>

      </main>

    </div>
  )
}

export default UploadPhotos