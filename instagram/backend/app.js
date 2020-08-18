const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const PORT = 5000
const URI = process.env.MONGODB_URI

// connect to MongoDB
mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log("MongoDB database connected")
})
mongoose.connection.on('error', (err) => {
  console.log("MongoDB database connection error")
  console.log(err)
})

// // router
// app.get('/', (req, res) => {
//   console.log("home")
//   res.send("Hello world!")
// })

// app.get('/about', customMiddleWare, (req, res) => {
//   console.log("about")
//   res.send("about page")
// })

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})