import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/userContext'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const DeletePost = ({ postId: propPostId }) => {
  const { id: paramId } = useParams()
  const postId = propPostId || paramId

  const navigate = useNavigate()
  const { currentUser } = useUser()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axios.delete(`${BASE_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/')
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }

  return (
    <button onClick={handleDelete} className="btn sm danger">
      Delete
    </button>
  )
}

export default DeletePost