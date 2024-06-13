const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const maxAge = 1 * 24 * 60 * 60;

const jwtSecret = process.env.JWT_SECRET;

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

const pushMail = async (email, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",    // using ethereal SMTP email system
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });

        let mailOptions = {
            from: "VideoKAT <no-reply@videokat.com>",
            to: email,
            subject: "Password Reset",
            text: `Click on the link below to reset password \n ${link} \nLink expires in 5 mins`,
            html: `<p>Click on the link below to reset your password:</p>
                   <p><a href="${link}" target="_blank"> ${link} </a></p>
                   <p><strong>Link expires in 5 minutes.</strong></p>`
        };

        let info = await transporter.sendMail(mailOptions);
        return info.response;

    } catch (error) {
        console.log('Email err: ', error);
        return error;
    }
};


module.exports = {createToken,currentAdmin,pushMail}