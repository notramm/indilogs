import { Link } from 'react-router-dom'

const CATEGORIES = [
  'Agriculture',
  'Business',
  'Education',
  'Entertainment',
  'Art',
  'Investment',
  'Uncategorized',
  'Weather',
]

const Footer = () => {
  return (
    <footer>
      <ul className="footer_categories">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <Link to={`/posts/categories/${cat}`}>{cat}</Link>
          </li>
        ))}
      </ul>
      <div className="footer_copyright">
        <small>All Rights Reserved &copy; Copyright, Ram</small>
      </div>
    </footer>
  )
}

export default Footer