import { createContext, useContext, useEffect, useState } from 'react'

export const UserContext = createContext()

// Custom hook for easy context consumption
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Lazy initializer — reads localStorage only once on mount
    try {
      return JSON.parse(localStorage.getItem('user')) ?? null
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider