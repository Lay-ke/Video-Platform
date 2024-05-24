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

// const checkUser = (req, res, next) => {
//     const token = req.cookies.jwt ;

//     //checking request path 
//     if (token) {
//         jwt.verify(token, 'Amalitech Webby Tokes', async (err, decodedToken) => {
//             if (err) {
//                 console.log(err);
//                 res.redirect('/signin')
//             } else {
//                 // console.log(decodedToken);
//                 const user = await User.findById(decodedToken.id);
//                 res.locals.usr = user.email;
//                 next();

//             }
//         })
//     } else {
//         res.redirect('/signin')
//     }
// }

// authenticating admin based on jwt
const requireAuthAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'Amalitech Webby Tokes', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/admin-signin')
           } else {
                // console.log(decodedToken);
                next();
            }
            })
    } else {
        res.redirect('/admin-signin')
    }
};

module.exports = {requireAuthUser, requireAuthAdmin};