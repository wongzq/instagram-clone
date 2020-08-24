const router = require('express').Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/users/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user =>
      Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .exec((err, posts) => (
        err ? res.status(422).json({ error: err }) : res.json({ user, posts })
      ))
    )
    .catch(_ => res.status(404).json({ error: "User not found" }))
})

router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followeeId, {
      $push: { followers: req.user._id }
    }, { new: true }, (err) =>
    err ?
    res.status(422).json({ error: err }) :
    User.findByIdAndUpdate(
      req.user._id, {
        $push: { following: req.body.followeeId }
      }, { new: true })
    .select("-password")
    .then(result => res.json(result))
    .then(data => console.log(data))
    .catch(err => res.status(422).json({ error: err }))
  )
})

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.followeeId, {
    $pull: { followers: req.user._id }
  }, { new: true }, (err) => {
    if (err) return res.status(422).json({ error: err });

    User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.body.followeeId }
      }, { new: true })
      .select("-password")
      .then(result => result.json())
      .catch(err => res.status(422).json({ error: err }))
  })
})

module.exports = router