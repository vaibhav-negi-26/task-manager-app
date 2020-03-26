const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    "name": "Gaurav",
    "email": "gauravnegi232628@gmail.com",
    "password": "gaurav@26",
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    "name": "aditya",
    "email": "aditya@gmail.com",
    "password": "aditya@26",
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "One",
    completed: "false",
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Two",
    completed: "true",
    owner: userOne._id
}
const taskthree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Three",
    completed: "false",
    owner: userTwo._id
}
const setupDatabase = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskthree).save()
}

module.exports = {
    setupDatabase,
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskthree
}