import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/userContext'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const Login = () => {
  const [userData, setUserData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const { setCurrentUser } = useUser()

  const changeInputHandler = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const errors = { email: '', password: '' }
    let isValid = true

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!userData.email) {
      errors.email = 'Email is required.'
      isValid = false
    } else if (!emailRegex.test(userData.email)) {
      errors.email = 'Invalid email format.'
      isValid = false
    }

    if (!userData.password) {
      errors.password = 'Password is required.'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const loginUser = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, userData)
      setCurrentUser(response.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    }
  }

  return (
    <section className="login">
      <div className="container">
        <h2>Sign In!</h2>
        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className="form_error-message">{error}</p>}

          <input
            type="text"
            placeholder="E-mail"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          {formErrors.email && <p className="form_error-message">{formErrors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          {formErrors.password && <p className="form_error-message">{formErrors.password}</p>}

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  )
}

export default Login