const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imgUrl: { type: String, required: true },
  postedBy: { type: ObjectId, ref: "User" },
  likes: [{ type: ObjectId, ref: "User" }]
})

mongoose.model("Post", postSchema)