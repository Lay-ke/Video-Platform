const {User, Admin} = require('../models/user')

const jwt = require('jsonwebtoken');

// authenticating user based on jwt
const requireAuthUser = (req, res, next) => {
    const token = req.cookies.jwt ;

    //checking request path 
    if (token) {
        jwt.verify(token, 'Amalitech Webby Tokes', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/signin')
            } else {
                // console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/signin')
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt ;

    //checking request path 
    if (token) {
        jwt.verify(token, 'Amalitech Webby Tokes', async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/signin');
            } else {
                // console.log(decodedToken);
                try {
                    const user = await User.findById(decodedToken.id);
                    res.locals.usr = user.email;
                    next();
                } catch (err) {
                    res.redirect('/signin');
                    console.log('checkuser error:', err);
                }

            }
        })
    } else {
        res.redirect('/signin');
    }
}

// authenticating admin based on jwt
const requireAuthAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'Amalitech Webby Tokes', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/admin-signin');
           } else {
                // console.log(decodedToken);
                next();
            }
            })
    } else {
        res.redirect('/admin-signin');
    }
};

const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt ;

    //checking request path 
    if (token) {
        jwt.verify(token, 'Amalitech Webby Tokes', async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/admin-signin');
            } else {
                // console.log(decodedToken);
                try {
                    const admin = await Admin.findById(decodedToken.id);
                    res.locals.adm = admin.email;
                    next();
                } catch (err) {
                    res.redirect('/admin-signin');
                    console.log('checkadmin error:', err);
                }

            }
        })
    } else {
        res.redirect('/admin-signin')
    }
}

module.exports = {requireAuthUser, requireAuthAdmin, checkUser, checkAdmin};