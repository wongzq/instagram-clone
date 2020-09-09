const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = mongoose.Schema({
  body: { type: String, required: false },
  imgUrl: { type: String, required: true },
  postedBy: { type: ObjectId, ref: "User" },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [{ text: String, postedBy: { type: ObjectId, ref: "User" } }]
})

mongoose.model("Post", postSchema)