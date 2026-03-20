import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/userContext'
import { QUILL_MODULES, QUILL_FORMATS, POST_CATEGORIES } from '../constants/postConstants'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { currentUser } = useUser()
  const token = currentUser?.token

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  const createPost = async (e) => {
    e.preventDefault()
    setError('')

    const postData = new FormData()
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)

    try {
      await axios.post(`${BASE_URL}/posts`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create post.')
    }
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form create-post_form" onSubmit={createPost}>
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
            Publish Post
          </button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost