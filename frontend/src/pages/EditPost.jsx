import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/userContext'
import { QUILL_MODULES, QUILL_FORMATS, POST_CATEGORIES } from '../constants/postConstants'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useUser()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/${id}`)
        const post = response.data
        setTitle(post.title)
        setCategory(post.category)
        setDescription(post.description)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('Could not load post data.')
      }
    }

    fetchPost()
  }, [id, token, navigate])

  const updatePost = async (e) => {
    e.preventDefault()
    setError('')

    const postData = new FormData()
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    if (thumbnail) postData.set('thumbnail', thumbnail)

    try {
      await axios.patch(`${BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update post.')
    }
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form edit-post_form" onSubmit={updatePost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept=".png,.jpg,.jpeg"
          />
          <button type="submit" className="btn primary">
            Update Post
          </button>
        </form>
      </div>
    </section>
  )
}

export default EditPost