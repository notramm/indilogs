import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/userContext'

const Logout = () => {
  const { setCurrentUser } = useUser()
  const navigate = useNavigate()

  // ✅ Fixed: side effects must be inside useEffect, never directly in render
  useEffect(() => {
    setCurrentUser(null)
    navigate('/login')
  }, [setCurrentUser, navigate])

  return null
}

export default Logout