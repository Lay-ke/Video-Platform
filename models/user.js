const mongoose = require('mongoose');
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

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

// function to hash passwd data before saving
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

//static method to sign in user
userSchema.statics.signin = async function(email, password) {
    const user = await this.findOne({email });
    if (user) {
        passwd_auth = await bcrypt.compare(password, user.password);
        if (passwd_auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);



module.exports = User