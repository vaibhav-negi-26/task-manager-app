const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const {setupDatabase,userOne,userOneId} = require('./fixtures/db')

///////////////////////////////////////////////////////////////////////// DELETING THE DB CONTENTS AND ADDING A USER
beforeEach(setupDatabase)

///////////////////////////////////////////////////////////////////////// SIGNUP TEST
test('Should sign up a new user!', async () => {
    const response = await request(app).post('/users').send({
        "name": "vaibahv",
        "email": "vaibhavsinghnegi@gmail.com",
        "password": "vaibahv@26"
    }).expect(201)

    // assert that the data base was created
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertion about the response
    expect(response.body).toMatchObject({
        user:{
            "name": "vaibahv",
            "email": "vaibhavsinghnegi@gmail.com"
        },
        token: user.tokens[0].token
    })

})

///////////////////////////////////////////////////////////////////////// LOGIN TEST
test('Should login a existing user', async () => {
   const response =  await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Shold not login a non existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'gaurav@'
    }).expect(400)
})

///////////////////////////////////////////////////////////////////////// USER PROFILE
test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

///////////////////////////////////////////////////////////////////////// UPDATEING USER

test('Should update the userone', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "blackmask"
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual("blackmask")
})

test('Should not update the userone', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "ranchi"
        })
        .expect(400)
})

///////////////////////////////////////////////////////////////////////// DELETE TEST
test('Should not delete the user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete the user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

///////////////////////////////////////////////////////////////////////// UPLOADING A AVATAR

test('Should upload a avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/philly.jpg') //formdata:key and path
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

