const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// creating user
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login user
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send()
    }
})

// Logout user
router.post('/users/logout',auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save()
        res.send("Logout success!")
    } catch (error) {
        res.status(500).send()
    }
})

// Logout All user
router.post('/users/logoutall',auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logout All success!")
    } catch (error) {
        res.status(500).send()
    }
})

// View user
router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})

// update user

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "age", "password"]
    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if (!isValid) {
        return res.status(400).send({
            error: "invalid field is being updated!"
        })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

// delete user
router.delete('/users/me',auth , async (req,res) => {
    try {
        //remove is a function of mongoose
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router