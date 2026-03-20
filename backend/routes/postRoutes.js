const { Router } = require('express')
const {
  createPost,
  getPost,
  getPosts,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware')

const router = Router()

// BUG FIXED: Static/specific routes MUST come before dynamic "/:id" route.
// Previously, "GET /categories/:category" and "GET /users/:id" were defined
// AFTER "GET /:id", so Express would match them as the post ID and never
// reach the correct handler — breaking category pages and author post pages entirely.
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router