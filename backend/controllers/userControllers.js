const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary')

// ─── Register ────────────────────────────────────────────────────────────────
// POST /api/users/register  — Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body

    if (!name || !email || !password || !password2) {
      return next(new HttpError('Fill in all fields', 422))
    }

    const emailLower = email.toLowerCase()
    const emailExists = await User.findOne({ email: emailLower })
    if (emailExists) {
      return next(new HttpError('Email already exists', 422))
    }

    if (password.trim().length < 6) {
      return next(new HttpError('Password must be at least 6 characters', 422))
    }

    if (password !== password2) {
      return next(new HttpError('Passwords do not match', 422))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)
    const newUser = await User.create({ name, email: emailLower, password: hashedPass })

    res.status(201).json({ id: newUser._id, name: newUser.name })
  } catch (error) {
    // FIX: was always returning a generic message, hiding useful errors
    // like duplicate key (email already exists) from MongoDB.
    // Now surfaces the real error message.
    return next(new HttpError(error.message || 'User registration failed', 422))
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────
// POST /api/users/login  — Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new HttpError('Fill in all fields', 422))
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return next(new HttpError('Invalid credentials', 422))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(new HttpError('Invalid credentials', 422))
    }

    const { _id: id, name } = user
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({ token, id, name })
  } catch (error) {
    return next(new HttpError('Login failed. Please check your credentials.', 422))
  }
}

// ─── Get single user ─────────────────────────────────────────────────────────
// GET /api/users/:id  — Public
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return next(new HttpError('User not found', 404))
    }
    res.status(200).json(user)
  } catch (error) {
    return next(new HttpError('User not found', 422))
  }
}

// ─── Change avatar ───────────────────────────────────────────────────────────
// POST /api/users/change-avatar  — Private
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError('Please choose an image.', 422))
    }

    const { avatar } = req.files

    if (avatar.size > 500000) {
      return next(new HttpError('Profile picture too big. Must be less than 500KB.', 422))
    }

    const user = await User.findById(req.user.id)

    // Delete old avatar from Cloudinary if it exists
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId)
    }

    // Upload new avatar buffer directly to Cloudinary — no disk writes needed
    const { url, public_id } = await uploadToCloudinary(avatar.data, 'indiblogs/avatars')

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: url, avatarPublicId: public_id },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return next(new HttpError("Avatar couldn't be changed", 422))
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Edit user profile ───────────────────────────────────────────────────────
// PATCH /api/users/edit-user  — Private
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body

    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError('Fill in all fields', 422))
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return next(new HttpError('User not found', 403))
    }

    const emailExist = await User.findOne({ email })
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError('Email already in use', 422))
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return next(new HttpError('Invalid current password', 422))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hashedPassword },
      { new: true }
    ).select('-password')

    res.status(200).json(updatedUser)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

// ─── Get all authors ─────────────────────────────────────────────────────────
// GET /api/users  — Public
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select('-password')
    res.status(200).json(authors)
  } catch (error) {
    return next(new HttpError(error.message, 500))
  }
}

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }