const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()
require('./models/user')

const authRouter = require('./routes/auth')

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

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})