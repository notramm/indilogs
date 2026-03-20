import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { useUser } from '../context/userContext'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const UserProfile = () => {
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useUser()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { name, email, avatar } = response.data
        setName(name)
        setEmail(email)
        // avatar is now a full Cloudinary URL — use directly
        setAvatarPreview(avatar || '')
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    fetchUser()
  }, [token, navigate, currentUser?.id])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const updateAvatar = async () => {
    if (!avatar) return
    const formData = new FormData()
    formData.set('avatar', avatar)

    try {
      const response = await axios.post(`${BASE_URL}/users/change-avatar`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Update preview with the new Cloudinary URL returned from the server
      setAvatarPreview(response.data.avatar)
      setSuccess('Avatar updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update avatar.')
    }
  }

  const updateDetails = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmNewPassword) {
      return setError('New passwords do not match.')
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/users/edit-user`,
        { name, email, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCurrentUser(response.data)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.')
    }
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser?.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img src={avatarPreview || '/default-avatar.png'} alt={name || 'Profile'} />
            </div>
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
                accept=".png,.jpg,.jpeg"
              />
              <label htmlFor="avatar"><FaEdit /></label>
            </form>
            <button type="button" className="profile_avatar-btn" onClick={updateAvatar}>
              <FaCheck />
            </button>
          </div>

          <h1>{name}</h1>

          {error && <p className="form_error-message">{error}</p>}
          {success && <p className="form_success-message">{success}</p>}

          <form className="form profile_form" onSubmit={updateDetails}>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            <button type="submit" className="btn primary">Update Details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile