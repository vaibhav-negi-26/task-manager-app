const app = require('../src/app')
const request = require('supertest')
const {
    setupDatabase,
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskthree
} = require('./fixtures/db')
const Task = require('../src/models/task')

///////////////////////////////////////////////////////// DELETING THE DB CONTENTS AND ADDING A USER
beforeEach(setupDatabase)

///////////////////////////////////////////////////////// creating task
test('should create a task for user', async () => {
    const respone = await request(app)
        .post('/tasks')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "from my test!"
        })
        .expect(201)
    const task = await Task.findById(respone.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    
})

///////////////////////////////////////////////////////// getting task
test('should fetch tasks of user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toBe(2)
})

///////////////////////////////////////////////////////// deleting task
test('User two should not delete task of user one', async () => {
    const respone = await request(app)
        .delete(`/tasks/${taskthree._id}`)
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = Task.findById(taskthree._id)
    expect(task).not.toBeNull()
})