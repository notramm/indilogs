import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const Authors = () => {
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/users`)
        setAuthors(response.data)
      } catch (err) {
        console.error('Error fetching authors:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAuthors()
  }, [])

  if (isLoading) return <Loader />

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link key={id} to={`/posts/users/${id}`} className="author">
              <div className="author_avatar">
                {/* avatar is now a full Cloudinary URL — use directly */}
                <img src={avatar || '/default-avatar.png'} alt={name} />
              </div>
              <div className="author_info">
                <h4>{name}</h4>
                <small>verified author</small>
                <p>total posts — {posts}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="center">No Authors Found</h2>
      )}
    </section>
  )
}

export default Authors