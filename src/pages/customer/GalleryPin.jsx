import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { verifyGalleryPin } from '../../services/galleryService'

function GalleryPin() {
  const { galleryToken } = useParams()
  const navigate = useNavigate()

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!pin) {
      setError('Please enter the gallery PIN.')
      return
    }

    try {
      setLoading(true)

      const response = await verifyGalleryPin(
        galleryToken,
        pin
      )

      /*
       * Backend currently returns:
       * [
       *   {
       *     id,
       *     eventId,
       *     uploadedBy,
       *     fileName,
       *     storageKey,
       *     fileUrl,
       *     fileSize,
       *     createdAt
       *   }
       * ]
       */

      sessionStorage.setItem(
        `gallery_${galleryToken}`,
        JSON.stringify(response)
      )

      // IMPORTANT:
      // Gallery page is /gallery/:galleryToken/photos
      navigate(`/gallery/${galleryToken}/photos`)

    } catch (error) {
      console.error('Gallery verification error:', error)

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Invalid PIN. Please try again.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-gray-900">
            PhotoShare
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Private Event Gallery
          </p>

        </div>

        {/* PIN Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-8">

          <div className="text-center mb-6">

            <div className="text-4xl mb-4">
              🔐
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Enter Gallery PIN
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Enter the PIN provided by the event organizer.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="gallery-pin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gallery PIN
              </label>

              <input
                id="gallery-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter PIN"
                autoComplete="off"
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
              />

            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'View Gallery'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default GalleryPin