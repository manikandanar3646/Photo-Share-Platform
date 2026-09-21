import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r">
      
      <div className="p-6">
        <h1 className="text-xl font-bold">
          PhotoShare
        </h1>
      </div>

      <nav className="px-4 space-y-2">

        <Link
          to="/admin"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/events"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Events
        </Link>

        <Link
          to="/admin/team"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Team Members
        </Link>

        <Link
          to="/admin/photos"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Photos
        </Link>

        <Link
          to="/admin/galleries"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Galleries
        </Link>

      </nav>

    </aside>
  )
}

export default Sidebar