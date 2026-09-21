import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)

      const user = await login(email, password)

      if (user.role === 'Team') {
        navigate('/team')
      } else {
        navigate('/admin')
      }
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Invalid email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-2xl font-bold text-gray-900">
            PhotoShare
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Photo Sharing Platform
          </p>

        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Sign in
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to manage your events and photos.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 border rounded-lg outline-none"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 border rounded-lg outline-none"
              />

            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <div className="text-center mt-6">

            <p className="text-sm text-gray-500">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="font-medium text-gray-900 hover:underline"
              >
                Create one
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login