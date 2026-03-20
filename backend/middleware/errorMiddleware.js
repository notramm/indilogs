// 404 handler — catches any route that didn't match
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Global error handler
const errorHandler = (error, req, res, next) => {
  // BUG FIXED: was "res.headerSent" (undefined, always falsy) →
  // should be "res.headersSent". The old bug meant this guard never worked
  // and Express could try to send a second response, causing crashes.
  if (res.headersSent) {
    return next(error)
  }

  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred' })
}

module.exports = { notFound, errorHandler }