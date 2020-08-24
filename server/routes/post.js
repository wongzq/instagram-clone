const router = require('express').Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

router.get('/getPosts', requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
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

router.delete('/deletePost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err })
      }

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove()
          .then(result => {
            res.json(result)
          })
          .catch(err => console.log(err))
      }
    })
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
      $push: { likes: req.user._id }
    }, {
      new: true
    })
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      }

      res.json(result)
    })
})

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
      $pull: { likes: req.user._id }
    }, {
      new: true
    })
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      }

      res.json(result)
    })
})

router.put('/comment', requireLogin, (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id }

  Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment }
    }, { new: true })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      }

      res.json(result)
    })
})

router.put('/uncomment', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
      $pull: { comments: { _id: req.body.commentId } }
    }, { new: true })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => (err ? res.status(422).json({ error: err }) : res.json(result)))
})

module.exports = router