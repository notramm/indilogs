import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'
import PostAuthor from '../components/PostAuthor'
import { useUser } from '../context/userContext'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useUser()

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/posts/${id}`)
        setPost(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load post.')
      } finally {
        setIsLoading(false)
      }
    }
    getPost()
  }, [id])

  if (isLoading) return <Loader />

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === String(post?.creator) && (
              <div className="post-detail_buttons">
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          <h1>{post.title}</h1>

          <div className="post-detail_thumbnail">
            <img src={post.thumbnail} alt={post.title} />
          </div>

          {/*
            FIX: Previously used a bare <p> tag with dangerouslySetInnerHTML.
            A <p> cannot contain block-level elements (h1, h2, ul, blockquote etc.)
            which Quill outputs — this caused invalid HTML and broken rendering.
            Now uses a <div> with class post-detail_body which has full Quill
            typography styles applied in the CSS.
          */}
          <div
            className="post-detail_body"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </div>
      )}
    </section>
  )
}

export default PostDetail