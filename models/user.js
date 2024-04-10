const mongoose = require('mongoose');
const {isEmail} = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    "email" : {
        type: String,
        required : [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Enter a valid email"]
    },
    "password" : {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password should contain 8 or more characters"]
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User