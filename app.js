const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config()


const app = express();


app.set('view engine', 'ejs');

//Middleware 
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))  //body parser
app.use(express.json());
app.use(cookieParser());


const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => {
        //server is listening
        console.log('DB Connected')
        app.listen(3000)
    })
    .catch((err) => console.log(err))


    //Authentication Routes
    app.use(authRoutes)


