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


    //serving static files to videoplayer
    // app.get('/video/css/bootstrap.min.css', function(req, res) {
    //     res.type('text/css');
    //     res.sendFile(__dirname + '/public/css/bootstrap.min.css');
    // });

    // app.get('/video/css/style2.css', function(req, res) {
    //     res.type('text/css');
    //     res.sendFile(__dirname + '/public/css/style2.css');
    // });
    
    // app.get('/video/js/bootstrap.bundle.min.js', function(req, res) {
    //     res.type('text/js');
    //     res.sendFile(__dirname + '/public/js/bootstrap.bundle.min.js');
    // });
    //Authentication Routes
    app.use(authRoutes)


