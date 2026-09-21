import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

function TeamNav() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white border-b">

      <div className="px-8 py-4">

        {/* Brand + Logout */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              PhotoShare
            </h1>

            <p className="text-sm text-gray-500">
              Team Member Portal
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
          >
            Logout
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 mt-5">

          <Link
            to="/team"
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isActive('/team')
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/team"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            My Events
          </Link>

          <Link
            to="/team"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Upload Photos
          </Link>

        </nav>

      </div>

    </header>
  )
}

export default TeamNav