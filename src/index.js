const express = require('express')
require('./db/mongoose')
const userRoutes = require('./router/user')
const taskRoutes = require('./router/task')

const app = express()
const port = process.env.PORT || 3000


//to parse incomming json to object
app.use(express.json())

// adding routes
app.use(userRoutes)
app.use(taskRoutes)


app.listen(port, () => {
    console.log('Server is up at port :', port)
})

// const User = require('./models/user')
// const main = async () => {
//     const user =  await User.findById('5e78b4093b45eb3084e09070')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()