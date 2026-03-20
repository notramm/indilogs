const Post = require('../models/postModel')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary')

// ─── Create Post ─────────────────────────────────────────────────────────────
// POST /api/posts  — Private
const createPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body

    if (!title || !category || !description || !req.files || !req.files.thumbnail) {
      return next(new HttpError('Fill in all fields and add a thumbnail', 422))
    }

    const { thumbnail } = req.files

    if (thumbnail.size > 2000000) {
      return next(new HttpError('Thumbnail too big. Should be less than 2MB', 422))
    }

    // Upload buffer directly to Cloudinary — no local disk involved
    const { url, public_id } = await uploadToCloudinary(thumbnail.data, 'indiblogs/thumbnails')

    const newPost = await Post.create({
      title,
      category,
      description,
      thumbnail: url,
      thumbnailPublicId: public_id,
      creator: req.user.id,
    })

    await User.findByIdAndUpdate(req.user.id, { $inc: { posts: 1 } })

    res.status(201).json(newPost)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Get All Posts ────────────────────────────────────────────────────────────
// GET /api/posts  — Public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Get Single Post ──────────────────────────────────────────────────────────
// GET /api/posts/:id  — Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(new HttpError('Post not found', 404))
    }
    res.status(200).json(post)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Get Posts by Category ────────────────────────────────────────────────────
// GET /api/posts/categories/:category  — Public
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params
    const posts = await Post.find({ category }).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Get Posts by User ────────────────────────────────────────────────────────
// GET /api/posts/users/:id  — Public
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError('Invalid user ID', 400))
    }

    const { page = 1, limit = 10 } = req.query

    const posts = await Post.find({ creator: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json(posts)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Edit Post ────────────────────────────────────────────────────────────────
// PATCH /api/posts/:id  — Private
const editPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params
    const { title, category, description } = req.body

    if (!title || !category || !description || description.length < 12) {
      return next(new HttpError('Fill in all fields correctly', 422))
    }

    const oldPost = await Post.findById(postId)
    if (!oldPost) {
      return next(new HttpError('Post not found', 404))
    }

    if (oldPost.creator.toString() !== req.user.id) {
      return next(new HttpError('Unauthorized to edit this post', 403))
    }

    let updatedPost

    if (!req.files || !req.files.thumbnail) {
      // No new thumbnail — update text fields only
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      )
    } else {
      const { thumbnail } = req.files

      if (thumbnail.size > 2 * 1024 * 1024) {
        return next(new HttpError('Thumbnail size exceeds 2MB limit', 422))
      }

      // Delete old thumbnail from Cloudinary
      if (oldPost.thumbnailPublicId) {
        await deleteFromCloudinary(oldPost.thumbnailPublicId)
      }

      // Upload new thumbnail buffer to Cloudinary
      const { url, public_id } = await uploadToCloudinary(thumbnail.data, 'indiblogs/thumbnails')

      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description, thumbnail: url, thumbnailPublicId: public_id },
        { new: true }
      )
    }

    if (!updatedPost) {
      return next(new HttpError('Failed to update the post', 500))
    }

    res.status(200).json(updatedPost)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Delete Post ──────────────────────────────────────────────────────────────
// DELETE /api/posts/:id  — Private
const deletePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params

    const post = await Post.findById(postId)
    if (!post) {
      return next(new HttpError('Post not found', 404))
    }

    if (post.creator.toString() !== req.user.id) {
      return next(new HttpError('Unauthorized to delete this post', 403))
    }

    // Delete thumbnail from Cloudinary
    if (post.thumbnailPublicId) {
      await deleteFromCloudinary(post.thumbnailPublicId)
    }

    await Post.findByIdAndDelete(postId)
    await User.findByIdAndUpdate(req.user.id, { $inc: { posts: -1 } })

    res.status(200).json({ message: `Post ${postId} deleted successfully.` })
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

module.exports = { createPost, getPost, getPosts, getCatPosts, getUserPosts, editPost, deletePost }