function PhotoCard({ photo, selected, onSelect }) {
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden ${
        selected ? 'ring-2 ring-black' : ''
      }`}
    >
      <div className="relative">

        <img
          src={photo.url}
          alt={photo.name}
          className="w-full h-48 object-cover"
        />

        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(photo.id)}
          className="absolute top-3 left-3 w-5 h-5"
        />

      </div>

      <div className="p-4">

        <p className="font-medium text-gray-900 truncate">
          {photo.name}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Uploaded by {photo.uploadedBy}
        </p>

      </div>
    </div>
  )
}

export default PhotoCard