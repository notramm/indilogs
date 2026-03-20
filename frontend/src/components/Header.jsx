import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa6'
import { AiOutlineClose } from 'react-icons/ai'
import { useUser } from '../context/userContext'

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800)
  const { currentUser } = useUser()

  const closeNavHandler = () => {
    setIsNavShowing(window.innerWidth >= 800)
  }

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          IndiLogs.
        </Link>

        {isNavShowing && (
          <ul className="nav_menu">
            {currentUser?.id ? (
              <>
                <li>
                  <Link to="/profile" onClick={closeNavHandler}>
                    {currentUser.name}
                  </Link>
                </li>
                <li><Link to="/create" onClick={closeNavHandler}>Create Post</Link></li>
                <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
                <li><Link to="/logout" onClick={closeNavHandler}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
                <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
              </>
            )}
          </ul>
        )}

        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavShowing((prev) => !prev)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  )
}

export default Header