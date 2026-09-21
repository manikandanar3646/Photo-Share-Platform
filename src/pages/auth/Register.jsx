import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'

function Register() {
  const navigate = useNavigate()

  const [step, setStep] = useState('role')

  const [role, setRole] = useState('')
  const [adminCode, setAdminCode] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================
  // SELECT TEAM MEMBER
  // =========================
  function handleTeamSelection() {
    setError('')
    setRole('Team')
    setAdminCode('')
    setStep('register')
  }

  // =========================
  // SELECT ADMIN
  // =========================
  function handleAdminSelection() {
    setError('')
    setRole('Admin')
    setStep('adminCode')
  }

  // =========================
  // VERIFY ADMIN CODE
  // =========================
  function handleAdminCode() {
    setError('')

    if (!adminCode.trim()) {
      setError('Please enter the Admin Registration Code.')
      return
    }

    // We don't verify against the frontend.
    // The code is sent securely to the backend during registration.
    setStep('register')
  }

  // =========================
  // REGISTER ACCOUNT
  // =========================
  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }

    if (!password) {
      setError('Please enter a password.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      await register(
        name,
        email,
        password,
        role,
        role === 'Admin' ? adminCode : null
      )

      navigate('/login')
    } catch (err) {
      console.error('Registration failed:', err)

      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // BACK TO ROLE SELECTION
  // =========================
  function goBack() {
    setError('')

    if (step === 'adminCode') {
      setAdminCode('')
      setRole('')
      setStep('role')
      return
    }

    if (step === 'register') {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setAdminCode('')

      if (role === 'Admin') {
        setStep('adminCode')
      } else {
        setRole('')
        setStep('role')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-6">

          <h1 className="text-4xl font-bold">
            PhotoShare
          </h1>

          <p className="text-gray-500 mt-1">
            Photo Sharing Platform
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* =========================
              STEP 1 - ROLE
          ========================= */}
          {step === 'role' && (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Create account
              </h2>

              <p className="text-gray-500 mb-6">
                Select your account type.
              </p>

              <div className="space-y-4">

                {/* Admin */}
                <button
                  type="button"
                  onClick={handleAdminSelection}
                  className="w-full border border-gray-300 rounded-xl p-5 text-left hover:border-black hover:bg-gray-50 transition"
                >
                  <div className="text-lg font-semibold">
                    Admin / Lead
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    Manage events, team members and galleries.
                  </div>
                </button>

                {/* Team */}
                <button
                  type="button"
                  onClick={handleTeamSelection}
                  className="w-full border border-gray-300 rounded-xl p-5 text-left hover:border-black hover:bg-gray-50 transition"
                >
                  <div className="text-lg font-semibold">
                    Team Member
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    Upload photos to assigned events.
                  </div>
                </button>

              </div>
            </>
          )}

          {/* =========================
              STEP 2 - ADMIN CODE
          ========================= */}
          {step === 'adminCode' && (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Admin verification
              </h2>

              <p className="text-gray-500 mb-6">
                Enter the Admin Registration Code to continue.
              </p>

              <div className="space-y-4">

                <input
                  type="password"
                  placeholder="Admin Registration Code"
                  value={adminCode}
                  onChange={(event) =>
                    setAdminCode(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAdminCode}
                  className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800"
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={goBack}
                  className="w-full border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50"
                >
                  Back
                </button>

              </div>
            </>
          )}

          {/* =========================
              STEP 3 - REGISTER
          ========================= */}
          {step === 'register' && (
            <>
              <h2 className="text-3xl font-bold mb-2">
                Create account
              </h2>

              <p className="text-gray-500 mb-2">
                {role === 'Admin'
                  ? 'Create your Admin / Lead account.'
                  : 'Create your Team Member account.'}
              </p>

              <div className="mb-6">

                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {role === 'Admin'
                    ? 'Admin / Lead'
                    : 'Team Member'}
                </span>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
                />

                {error && (
                  <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading
                    ? 'Creating account...'
                    : 'Create Account'}
                </button>

                <button
                  type="button"
                  onClick={goBack}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-50"
                >
                  Back
                </button>

              </form>
            </>
          )}

          {/* Login link */}
          <p className="text-center mt-6 text-gray-500">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-black font-semibold"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Register