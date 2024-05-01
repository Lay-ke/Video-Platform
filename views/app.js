const express = require('express');
const mongoose = require('mongoose')
const authRoutes = require('../routes/authRoutes');
const cookieParser = require('cookie-parser')
const { requireAuth } = require('../middleware/authMiddleware')
const { db } = require('../models/user');

const app = express();

//Middleware 
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs')

const dbURI = 'mongodb+srv://node-usr:Grook1_1.@node-tuts.2kjewxh.mongodb.net/Video-Platform'
mongoose.connect(dbURI)
    .then((result) => {
        //server is listening
        console.log('DB Connected')
        app.listen(3000)
    })
    .catch((err) => console.log(err))



//Authentication Routes
app.use(authRoutes)