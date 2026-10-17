
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GalleryAccess() {
  const [galleryCode, setGalleryCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    const code = galleryCode.trim()

    if (!code) {
      setError('Please enter your gallery code.')
      return
    }

    // Allow only URL-safe gallery codes.
    if (!/^[a-zA-Z0-9-]+$/.test(code)) {
      setError('Enter a valid gallery code.')
      return
    }

    navigate(`/gallery/${encodeURIComponent(code)}`)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            PhotoShare
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Your event memories, all in one place
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">📸</div>

            <h2 className="text-xl font-semibold text-gray-900">
              Find Your Event Gallery
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Enter the gallery code provided by your event organizer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="gallery-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gallery Code
              </label>

              <input
                id="gallery-code"
                type="text"
                value={galleryCode}
                onChange={(event) => {
                  setGalleryCode(event.target.value)
                  setError('')
                }}
                placeholder="Enter your gallery code"
                autoComplete="off"
                required
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Continue to Gallery →
            </button>
          </form>

          <div className="text-center mt-5">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default GalleryAccess
