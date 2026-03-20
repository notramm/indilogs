import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PostItem from '../components/PostItem'
import Loader from '../components/Loader'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api'

const CategoryPosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { category } = useParams()

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/posts/categories/${category}`)
        setPosts(response.data)
      } catch (err) {
        console.error('Error fetching category posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  if (isLoading) return <Loader />

  return (
    <section className="category_posts">
      {posts.length > 0 ? (
        <div className="container category-posts_container">
          {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItem
              key={id}
              postID={id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={description}
              authorID={creator}
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No Post Found</h2>
      )}
    </section>
  )
}

export default CategoryPosts