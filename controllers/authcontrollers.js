const {User, Admin}  = require('../models/user');
const jwt = require('jsonwebtoken');

//Handle error
const handleError = (err) => {
    let errors = {email: '', password: ''};

    // checking validation - signUp
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message;
        });
    };
    // duplicate key - signUp
    if (err.code === 11000) {
        errors['email'] = "Email already registered! ";
    };
    // authenticating - signIn
    if (err.message === 'Incorrect email') {
        errors['email'] = 'Invalid Email '
    }
    if (err.message === 'Incorrect password') {
        errors['password'] = err.message
    }
    

    return errors;
};

const maxAge = 1 * 24 * 60 * 60;

//jwt function
const createToken = (id) => {
    return jwt.sign({id}, 'Amalitech Webby Tokes', {
        expiresIn: maxAge
    });
}

module.exports.home = (req, res) => {
    res.render('Home', {title: "Home"});
};

module.exports.signup_get = (req, res) => {
    res.render('signup', {title: "SignUp"});
};

module.exports.signin_get = (req, res) => {
    res.render('signin', {title: "SignIn"});
};

module.exports.signup_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.create({email, password})
        const token = createToken(user._id) //creating token
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });  //setting jwt cookie
        res.status(201).json({"user": user._id});
    } catch (err) {
        console.log(err.message, err.code);
        const errors = handleError(err);
        res.status(400).json({"errors": errors})
    };
};

module.exports.signin_post = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        //authentication using static function
        const user = await User.signin(email, password);
        const token = createToken(user._id); //creating token
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });  //setting jwt cookie
        res.status(200).json({"user": user._id});
    } catch (err) {
        console.log(err.message);
        const errors = handleError(err);
        console.log(errors)
        res.status(400).json({errors});
    }
};

module.exports.admin_home_get = (req, res) => {
    res.render('admin-home', {title: "Admin"})
};

module.exports.admin_signin_get = async (req, res) => {
    // const email = 'admin@gmail.com';
    // const password = 'qwerty123';
    res.render('admin-signin', {title: "Admin | SignIn"})
};

module.exports.admin_signin_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const admin = await Admin.signin(email, password);
        const token = createToken(admin._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true});
        res.status(200).json({"admin": admin._id});
    } catch (err) {
        console.log(err.message)
        const errors = handleError(err);
        // console.log(errors)
        res.status(400).json({errors});
    }
};

module.exports.admin_logout_get =(req, res) => {
    // res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/admin-signin');
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1, httpOnly: true});
    res.redirect('/signin');
};

