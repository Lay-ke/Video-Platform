const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const path = req.path
    const token = req.cookies.jwt ;

    //checking request path 
    if (path == '/') {
        if (token) {
            jwt.verify(token, 'Amalitech Webby Tokes', (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    res.redirect('/signin')
                } else {
                    console.log(decodedToken)
                    next();
                }
            })
        } else {
            res.redirect('/signin')
        }
    }
    if (path == '/admin-home') {
        if (token) {
            jwt.verify(token, 'Amalitech Webby Tokes', (err, decodedToken) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin-signin')
                } else {
                    console.log(decodedToken)
                    next();
                }
            })
        } else {
            res.redirect('/admin-signin')
        }
    };
}

module.exports = {requireAuth};