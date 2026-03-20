const jwt = require('jsonwebtoken')
const HttpError = require('../models/errorModel')

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new HttpError('No token provided', 401))
  }

  const token = authorization.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
    if (err) return next(new HttpError('Invalid or expired token', 403))
    req.user = info
    next()
  })
}

module.exports = authMiddleware