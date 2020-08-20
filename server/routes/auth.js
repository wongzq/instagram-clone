const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const mongoose = require('mongoose')
const User = mongoose.model("User")

require('dotenv').config()

router.get('/', (req, res) => {
  User.find({}).then(users => {
    res.send(users)
  })
})

router.get('/protected', requireLogin, (req, res) => {
  res.json({ "result": "you managed to get this protected resource" })
})

router.post('/signup', (req, res) => {
  const { email, password, name } = req.body

  // if incomplete fields
  if (!email || !password || !name) {
    return res.status(422).json({ error: "some fields are incomplete" })
  }

  User.findOne({ email: email })
    .then((existingUser) => {
      // if user exists
      if (existingUser) {
        return res.status(422).json({ error: "this email is already registered" })
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
            .then((user) => res.json({ message: `user ${email} created successfully` }))
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body

  // if incomplete fields
  if (!email || !password) {
    return res.status(422).json({ error: "invalid email and password" })
  }

  User.findOne({ email: email })
    .then(savedUser => {

      // if user email not found
      if (!savedUser) {
        return res.status(422).json({ error: "invalid email or password" })
      }

      // check password
      bcrypt.compare(password, savedUser.password)
        .then(validPassword => {
          if (validPassword) {

            // generate jwt token
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET)
            res.json({ token })
          } else {
            return res.status(422).json({ error: "invalid email or password" })
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router