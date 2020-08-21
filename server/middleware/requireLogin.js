const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const User = mongoose.model("User")

require('dotenv').config()

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  // if not authorized
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" })
  }

  const token = authorization.replace("Bearer ", "")
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    // if not verified
    if (err) {
      return res.status(401).json({ error: "You must be logged in" })
    }

    const { id } = payload
    User.findById(id)
      .then(userData => {
        req.user = userData
        next()
      })
  })
}