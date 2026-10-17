import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function GalleryAccess() {
  const [galleryInput, setGalleryInput] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const input = galleryInput.trim()

    if (!input) {
      setError('Please enter your gallery code or shareable link.')
      return
    }

    let galleryToken = input

    try {
      // Accept a complete shareable URL.
      if (/^https?:\/\//i.test(input)) {
        const parsedUrl = new URL(input)

        // Accept only URLs ending in /gallery/{token}.
        const match = parsedUrl.pathname.match(
          /\/gallery\/([^/]+)\/?$/
        )

        if (!match) {
          setError('That link does not look like a gallery link.')
          return
        }

        galleryToken = decodeURIComponent(match[1])
      } else {
        // Also accept a token or a path such as /gallery/{token}.
        const match = input.match(
          /^(?:\/?gallery\/)?([^/?#]+)\/?$/
        )

        if (!match) {
          setError('Please enter a valid gallery code or link.')
          return
        }

        galleryToken = decodeURIComponent(match[1])
      }
    } catch {
      setError('Please check your gallery code or shareable link.')
      return
    }

    if (
      !galleryToken ||
      galleryToken === '.' ||
      galleryToken === '..' ||
      /[/?#\s]/.test(galleryToken)
    ) {
      setError('Please enter a valid gallery code or link.')
      return
    }

    navigate(`/gallery/${encodeURIComponent(galleryToken)}`)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            PhotoShare
          </Link>

          <p className="text-sm text-gray-500 mt-2">
            Your event memories, all in one place
          </p>
        </header>

        <section className="bg-white border rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4" aria-hidden="true">
              📸
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Find Your Event Gallery
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Enter the gallery code or paste the private link
              provided by your event organizer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="gallery-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gallery Code or Shareable Link
              </label>

              <input
                id="gallery-input"
                type="text"
                value={galleryInput}
                onChange={(event) => {
                  setGalleryInput(event.target.value)
                  setError('')
                }}
                placeholder="Enter code or paste gallery link"
                autoComplete="url"
                required
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-300"
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

          <p className="text-xs text-gray-500 text-center mt-5">
            Your gallery PIN is still required to access private photos.
          </p>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default GalleryAccess
