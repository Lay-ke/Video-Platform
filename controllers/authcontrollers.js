const User = require('../models/user');

//Handle error
const handleError = (err) => {
    let errors = {email: '', password: ''};

    // checking validation
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message;
        });
    };
    // duplicate key 
    if (err.code === 11000) {
        errors['email'] = "Email already registered! ";
    };
    
    return errors;
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.signin_get = (req, res) => {
    res.render('signin');
};

module.exports.signup_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.create({email, password})
        res.status(201).json(user);
    } catch (err) {
        console.log(err.message, err.code)
        const errors = handleError(err)
        res.status(400).json({"errors": errors})
    };
};

module.exports.signin_post = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    res.send('SIgnIn success');
};



