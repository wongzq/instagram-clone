const router = require('express').Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

router.get('/getPosts', requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
      res.json({ posts })
    })
    .catch(err => console.log(err))
})

router.get('/myPosts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user.id })
    .populate("postedBy", "_id name")
    .then(posts => res.json({ posts }))
    .catch(err => console.log(err))

})

router.post('/createPost', requireLogin, (req, res) => {
  const { title, body, imgUrl } = req.body

  // if insufficient fields
  if (!title || !body || !imgUrl) {
    return res.status(422).json({ error: "Tnsufficient fields" })
  }

  req.user.password = undefined

  const post = new Post({
    title,
    body,
    imgUrl,
    postedBy: req.user,
  })

  post.save()
    .then(result => res.json({ post: result }))
    .catch(err => console.log(err))
})

module.exports = router