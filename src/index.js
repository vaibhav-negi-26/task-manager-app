const express = require('express')
require('./db/mongoose')
const userRoutes = require('./router/user')
const taskRoutes = require('./router/task')
// const path = require('path')

// creating server
const app = express()
const port = process.env.PORT || 3000

//// serving static html
// const publicDir = path.join(__dirname, '../public/')
// app.use(express.static(publicDir))

//to parse incomming json to object
app.use(express.json())

// adding routes
app.use(userRoutes)
app.use(taskRoutes)


app.listen(port, () => {
    console.log('Server is up at port :', port)
})