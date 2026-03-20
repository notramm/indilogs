import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const changeInputHandler = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    // Clear error as user starts correcting their input
    if (error) setError('')
  }

  const validateInputs = () => {
    const { name, email, password, password2 } = userData
    if (!name.trim())     return 'Full name is required.'
    if (!email.trim())    return 'Email is required.'
    if (!password)        return 'Password is required.'
    if (!password2)       return 'Please confirm your password.'
    if (password !== password2) return 'Passwords do not match.'
    if (password.length < 6)    return 'Password must be at least 6 characters.'
    return null
  }

  const registerUser = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${BASE_URL}/users/register`, userData)
      if (response.data) navigate('/login')
    } catch (err) {
      // Show the exact message from the server (e.g. "Email already exists")
      // Falls back to a generic message only if the server sends nothing useful
      const serverMsg = err.response?.data?.message || err.response?.data?.Message
      setError(serverMsg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up!</h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error-message">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="email"
            placeholder="E-mail"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  )
}

export default Register