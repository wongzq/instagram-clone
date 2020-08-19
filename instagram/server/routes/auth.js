const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")

router.get('/', (req, res) => {
  res.send("hello through auth")
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

      // create new user
      const user = new User({
        email: email,
        password: password,
        name: name,
      })
      user.save()
        .then((user) => res.json({ message: `user ${email} created successfully` }))
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

module.exports = router