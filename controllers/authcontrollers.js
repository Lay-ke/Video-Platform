const User = require('../models/user')

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
        res.status(201).json('SignUp Success', user)
    } catch (error) {
        res.status(400).send('Error something failed')
    }
};

module.exports.signin_post = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    res.send('SIgnIn success');
};



