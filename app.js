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
// app.use(express.urlencoded())  //body parser
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
    app.get('/video/css/bootstrap.min.css', function(req, res) {
        res.type('text/css');
        res.sendFile(__dirname + '/public/css/bootstrap.min.css');
    });

    app.get('/video/css/style2.css', function(req, res) {
        res.type('text/css');
        res.sendFile(__dirname + '/public/css/style2.css');
    });
    
    app.get('/video/js/bootstrap.bundle.min.js', function(req, res) {
        res.type('text/js');
        res.sendFile(__dirname + '/public/js/bootstrap.bundle.min.js');
    });
    //Authentication Routes
    app.use(authRoutes)

// app.get('/stream', async (req, res) => {
//     // res.sendFile('canada-geese.mp4', {root: __dirname} )
//     const range = req.headers.range;
//     console.log('>>>>>>>>>>>>>>',range)
//     if (!range) {
//         res.status(400).send("Request Range header")
//     }
//     // const videoPath = __dirname +'\\canada-geese.mp4'
//     const videoSize = 1453723
//     // console.log('>>>>>>>>>>>>>>>>>>', videoSize)
    

//     const chunkSize = 1453723;
//     const start = Number(range.replace(/\D/g, ''));
//     const end = Math.min(start + chunkSize, videoSize - 1);

//     const contentLength = end - start + 1;
//     const headers = {
//         "Content-Range": `bytes ${start}- ${end}/${videoSize}`,
//         "Accept-Ranges": 'bytes',
//         "Content-Length": contentLength,
//         "Content-Type": 'video/mp4'
//     }

//     res.writeHead(206,headers);
//     // res.writeHead(200, { 'Content-Type': 'application/octet-stream' });

//     // const videoStream = fs.createReadStream(videoPath, {start, end});
//     // console.log('VideoSTREAM LOG>>>>>', videoStream)
//     const stream = await createAWSStream()
//     // console.log('STREAM AWS >>>>>', stream)

//     stream.pipe(res)

// })


