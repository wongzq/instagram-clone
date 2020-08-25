const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const User = mongoose.model("User")

const { JWT_SECRET } = require("../config/keys")

require('dotenv').config()

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  // if not authorized
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" })
  }

  const token = authorization.replace("Bearer ", "")
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    // if not verified
    if (err) {
      return res.status(401).json({ error: "You must be logged in" })
    }

    const { _id } = payload
    User.findById(_id)
      .then(userData => {
        req.user = userData
        next()
      })
  })
}