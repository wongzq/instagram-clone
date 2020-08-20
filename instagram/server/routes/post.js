const router = require('express').Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

router.post('/createPost', requireLogin, (req, res) => {
  const { title, body } = req.body

  // if insufficient fields
  if (!title || !body) {
    return res.status(422).json({ error: "insufficient fields" })
  }

  req.user.password = undefined
  
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  })

  post.save()
    .then(result => res.json({ post: result }))
    .catch(err => console.log(err))
})

module.exports = router