const mongoose = require('mongoose')
const validator = require('validator')


///////////////////////////////////////////////////// creating model    
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password is not valid, password should not contain 'passwrod'.")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0) {
                throw new Error("Age must be positive.")
            }
        }
    }
})

module.exports = User