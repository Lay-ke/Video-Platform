const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    "email" : {
        type: String,
        required : true,
        unique: true,
        lowercase: true
    },
    "password" : {
        type: String,
        required: true,
        minlength: 8
    }
});

const userModel = mongoose.model('user', userSchema)

module.exports = userModel