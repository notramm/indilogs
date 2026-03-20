const { Schema, model } = require('mongoose')

const postSchema = new Schema(
  {
    title:             { type: String, required: true },
    category:          {
      type: String,
      enum: {
        values: ['Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Uncategorized', 'Weather'],
        message: '{VALUE} is not a supported category',
      },
    },
    description:       { type: String, required: true },
    // Full Cloudinary URL — used directly as <img src> on the frontend
    thumbnail:         { type: String, required: true },
    // Cloudinary public_id — needed to delete old thumbnail on edit/delete
    thumbnailPublicId: { type: String, required: true },
    creator:           { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

module.exports = model('Post', postSchema)