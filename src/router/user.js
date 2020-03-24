const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {
    sendWelcome,
    sendRemove
} = require('../emails/account')

// creating user
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        sendWelcome(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }
})

// Logout user
router.post('/users/logout', auth, async (req, res) => {
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
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logout All success!")
    } catch (error) {
        res.status(500).send()
    }
})

// View user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// update user

router.patch('/users/me', auth, async (req, res) => {
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
router.delete('/users/me', auth, async (req, res) => {
    try {
        //remove is a function of mongoose
        await req.user.remove()
        sendRemove(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

// route for file upload
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload jpg, jpeg or png file.'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

// deleting avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    try {
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// getting avatar by id
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById('5e78f321471c775708fbb23c')
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

// getting avatar by auth
router.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(req.user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

// exporting for usage in other files
module.exports = router