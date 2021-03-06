const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const mongoose = require('mongoose')
const User = mongoose.model("User")

const { JWT_SECRET } = require("../config/keys")

require('dotenv').config()

router.get('/protected', requireLogin, (req, res) => {
  res.json({ "result": "you managed to get this protected resource" })
})

router.post('/signUp', (req, res) => {
  const { email, password, name } = req.body

  // if incomplete fields
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Some fields are incomplete" })
  }

  User.findOne({ email: email })
    .then((existingUser) => {
      // if user exists
      if (existingUser) {
        return res.status(422).json({ error: "This email is already registered" })
      }

      // hash password
      bcrypt.hash(password, 12)
        .then(hashedPassword => {

          // create new user
          const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
          })
          user.save()
            .then((user) => res.json({ message: "Signed up successfully" }))
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

router.post('/signIn', (req, res) => {
  const { email, password } = req.body

  // if incomplete fields
  if (!email || !password) {
    return res.status(422).json({ error: "Invalid email and password" })
  }

  User.findOne({ email: email })
    .then(savedUser => {

      // if user email not found
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" })
      }

      // check password
      bcrypt.compare(password, savedUser.password)
        .then(validPassword => {
          if (validPassword) {

            // generate jwt token
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { _id, name, email, followers, following } = savedUser
            res.json({ token, user: { _id, name, email, followers, following } })
          } else {
            return res.status(422).json({ error: "Invalid email or password" })
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router