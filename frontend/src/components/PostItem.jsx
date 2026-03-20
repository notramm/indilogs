import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'

// Strips all HTML tags and decodes HTML entities (like &nbsp;) to plain text.
// Quill stores descriptions as HTML — we need clean text for the card preview.
const stripHtml = (html) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

const PostItem = ({ postID, category, thumbnail, title, description, authorID, createdAt }) => {
  const plainDescription = stripHtml(description)
  const shortDescription =
    plainDescription.length > 120 ? plainDescription.substring(0, 120) + '...' : plainDescription
  const postTitle = title.length > 60 ? title.substring(0, 60) + '...' : title

  return (
    <article className="post">
      <Link to={`/posts/${postID}`} className="post_link">
        <div className="post_thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="post_content">
          <span className="post_category">{category}</span>
          <h3>{postTitle}</h3>
          <p>{shortDescription}</p>
        </div>
      </Link>

      <div className="post_footer">
        <PostAuthor authorID={authorID} createdAt={createdAt} />
        <Link
          to={`/posts/categories/${category}`}
          className="btn category"
          onClick={(e) => e.stopPropagation()}
        >
          {category}
        </Link>
      </div>
    </article>
  )
}

export default PostItem