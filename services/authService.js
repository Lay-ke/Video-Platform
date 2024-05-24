const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const maxAge = 1 * 24 * 60 * 60;

const jwtSecret = process.env.JWT_SECRET

const createToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: maxAge
    });
};

// check current admin
const currentAdmin = (token) => {
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        return decodedToken;
    } catch (error) {
        return error
    }
};

const sendMail = (email,link) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'eulalia.windler96@ethereal.email',
            pass: '4BJEAKwnDSamZuBVYJ'
        },
    });
    var mailOptions = {
        from: "VideoKAT@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `Click on the link below to reset password \n ${link} \nLink expires in 5 mins`,
      };
  
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return (error);
        } else {
            return ("Email sent: " + info.response);
        }
    });
};


module.exports = {createToken,currentAdmin,sendMail}