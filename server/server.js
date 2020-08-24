const express = require('express')
const mongoose = require('mongoose')

require('./models/user')
require('./models/post')
require('dotenv').config()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const postRouter = require('./routes/user')

const app = express()
const PORT = 5000
const URI = process.env.MONGODB_URI

// connect to MongoDB
mongoose.connect(URI, {
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

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})