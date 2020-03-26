const express = require('express')
require('./db/mongoose')
const userRoutes = require('./router/user')
const taskRoutes = require('./router/task')


// creating server
const app = express()


//to parse incomming json to object
app.use(express.json())

// adding routes
app.use(userRoutes)
app.use(taskRoutes)
 module.exports = app