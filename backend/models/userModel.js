const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  // Full Cloudinary URL — used directly as <img src> on the frontend
  avatar:         { type: String, default: null },
  // Cloudinary public_id — needed to delete the old image when avatar changes
  avatarPublicId: { type: String, default: null },
  posts:          { type: Number, default: 0 },
})

module.exports = model('User', userSchema)