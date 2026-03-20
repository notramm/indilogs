const { Router } = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
} = require('../controllers/userControllers')
const authMiddleware = require('../middleware/authMiddleware')

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)

// BUG FIXED: "GET /:id" must come AFTER all fixed-path GET routes
// otherwise "GET /change-avatar" etc would be caught by /:id first.
// Also removed the duplicate "GET /" route that could never be reached.
router.get('/:id', getUser)

module.exports = router