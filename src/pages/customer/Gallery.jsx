import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Gallery() {
  const { galleryToken } = useParams()
  const navigate = useNavigate()

  // Get verified gallery photos from localStorage
  const [photos] = useState(() => {
    try {
      const storedPhotos = localStorage.getItem('galleryPhotos')

      if (!storedPhotos) {
        return []
      }

      const parsedPhotos = JSON.parse(storedPhotos)

      return Array.isArray(parsedPhotos) ? parsedPhotos : []
    } catch {
      return []
    }
  })

  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [search, setSearch] = useState('')

  const filteredPhotos = photos.filter((photo) => {
    const fileName =
      photo.fileName ||
      photo.name ||
      ''

    return fileName
      .toLowerCase()
      .includes(search.toLowerCase())
  })

  function getPhotoUrl(photo) {
    return (
      photo.fileUrl ||
      photo.url ||
      ''
    )
  }

  function getPhotoName(photo) {
    return (
      photo.fileName ||
      photo.name ||
      'Photo'
    )
  }

  function handleClosePreview() {
    setSelectedPhoto(null)
  }

  function handleExitGallery() {
    localStorage.removeItem('galleryPhotos')
    localStorage.removeItem('galleryToken')

    navigate(`/gallery/${galleryToken}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="w-full px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                PhotoShare
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Private Event Gallery
              </p>
            </div>

            <button
              type="button"
              onClick={handleExitGallery}
              className="self-start sm:self-auto px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Exit Gallery
            </button>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="w-full px-8 py-8">

        {/* Gallery Header */}
        <div className="mb-8">

          <p className="text-sm text-gray-500 mb-2">
            Private Gallery
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            Event Gallery
          </h2>

          <p className="mt-2 text-gray-500">
            Your event photos are ready to view.
          </p>

        </div>

        {/* Gallery Controls */}
        <div className="bg-white border rounded-xl p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Published Photos
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {filteredPhotos.length}
              </p>
            </div>

            <div className="w-full md:w-80">

              <label
                htmlFor="photo-search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Photos
              </label>

              <input
                id="photo-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by filename..."
                className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
              />

            </div>

          </div>

        </div>

        {/* No photos */}
        {filteredPhotos.length === 0 && (

          <div className="bg-white border rounded-xl p-12 text-center">

            <div className="text-4xl mb-4">
              📷
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No photos available
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              No published photos were found in this gallery.
            </p>

          </div>

        )}

        {/* Photo Grid */}
        {filteredPhotos.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {filteredPhotos.map((photo) => {

              const photoName = getPhotoName(photo)
              const photoUrl = getPhotoUrl(photo)

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white border rounded-xl overflow-hidden text-left hover:shadow-md transition"
                >

                  {/* Image */}
                  <div className="relative">

                    {photoUrl ? (

                      <img
                        src={photoUrl}
                        alt={photoName}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                      />

                    ) : (

                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">

                        <div className="text-center">

                          <div className="text-4xl mb-2">
                            📷
                          </div>

                          <p className="text-sm text-gray-500">
                            Image unavailable
                          </p>

                        </div>

                      </div>

                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">

                      <span className="px-3 py-1.5 rounded-lg bg-white/90 text-sm font-medium text-gray-900">
                        View
                      </span>

                    </div>

                  </div>

                  {/* Information */}
                  <div className="p-4">

                    <p className="font-medium text-gray-900 truncate">
                      {photoName}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Photo ID: {photo.id}
                    </p>

                  </div>

                </button>
              )
            })}

          </div>

        )}

      </main>

      {/* Fullscreen Preview */}
      {selectedPhoto && (

        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleClosePreview}
        >

          <button
            type="button"
            onClick={handleClosePreview}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 text-gray-900 text-xl hover:bg-white"
          >
            ×
          </button>

          <div
            className="max-w-6xl max-h-[90vh] text-center"
            onClick={(event) => event.stopPropagation()}
          >

            {getPhotoUrl(selectedPhoto) ? (

              <img
                src={getPhotoUrl(selectedPhoto)}
                alt={getPhotoName(selectedPhoto)}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />

            ) : (

              <div className="bg-white rounded-xl p-12">
                <p className="text-gray-700">
                  Image is not currently available.
                </p>
              </div>

            )}

            <div className="mt-4">

              <p className="text-white font-medium">
                {getPhotoName(selectedPhoto)}
              </p>

              <p className="text-gray-300 text-sm mt-1">
                Photo ID: {selectedPhoto.id}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Gallery