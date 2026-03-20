import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/userContext'
import Loader from '../components/Loader'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { currentUser } = useUser()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/posts/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPosts(response.data)
      } catch (err) {
        console.error('Error fetching dashboard posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [token, navigate, currentUser?.id])

  if (isLoading) return <Loader />

  return (
    <section className="dashboard">
      {posts.length ? (
        <div className="container dashboard_container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard_post">
              <div className="dashboard_post-info">
                <div className="dashboard_post-thumbnail">
                  {/* thumbnail is now a full Cloudinary URL — use directly */}
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard_post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">View</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                <Link to={`/posts/${post._id}/delete`} className="btn sm danger">Delete</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">Nothing Posted Yet? Post Now...</h2>
      )}
    </section>
  )
}

export default Dashboard