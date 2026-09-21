import api from './api'

export async function login(email, password) {
  const response = await api.post('/Auth/login', {
    email,
    password
  })

  localStorage.setItem('token', response.data.token)
  localStorage.setItem('user', JSON.stringify(response.data))

  return response.data
}

export async function register(
  name,
  email,
  password,
  role,
  adminCode = null
) {
  const response = await api.post('/Auth/register', {
    name,
    email,
    password,
    role,
    adminCode
  })

  return response.data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getCurrentUser() {
  const user = localStorage.getItem('user')

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'))
}