const express = require('express')
const mongoose = require('mongoose')

require('./models/user')
require('./models/post')
require('dotenv').config()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

const { MONGODB_URI } = require('./config/keys')
const app = express()
const PORT = process.env.PORT || 5000

// connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).catch(err => console.log(err))
mongoose.connection.once('open', () => {
  console.log('MongoDB connection open')
})
mongoose.connection.on('connected', () => {
  console.log("MongoDB connection success")
})
mongoose.connection.on('error', (err) => {
  console.log("MongoDB connection failure")
  console.log(err, '\n')
})

// routes
app.use(express.json())
app.use(authRouter)
app.use(postRouter)
app.use(userRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"))
  })
}

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})