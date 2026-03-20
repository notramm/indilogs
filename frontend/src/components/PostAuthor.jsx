import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    if (!authorID) return
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${authorID}`)
        setAuthor(response.data)
      } catch (error) {
        console.error('Error fetching author:', error)
      }
    }
    getAuthor()
  }, [authorID])

  return (
    <Link to={`/posts/users/${authorID}`} className="post_author">
      <div className="post_author-avatar">
        {/* avatar is now a full Cloudinary URL — use directly */}
        <img src={author?.avatar || '/default-avatar.png'} alt={author?.name || 'Author'} />
      </div>
      <div className="post_author-details">
        <h5>By: {author?.name || 'Unknown Publisher'}</h5>
        <small>{new Date(createdAt).toLocaleString()}</small>
      </div>
    </Link>
  )
}

export default PostAuthor