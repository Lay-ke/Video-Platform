const {User, Admin, Video}  = require('../models/user');
const jwt = require('jsonwebtoken');
const { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const generateUniqueId = require('generate-unique-id');
const createAWSStream = require('../middleware/index');
require('dotenv').config();

//Handle error
const handleError = (err) => {
    let errors = {email: '', password: ''};

    // checking validation - signUp
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message;
        });
    };
    // duplicate key - signUp
    if (err.code === 11000) {
        errors['email'] = "Email already registered! ";
    };
    // authenticating - signIn
    if (err.message === 'Incorrect email') {
        errors['email'] = 'Invalid Email '
    }
    if (err.message === 'Incorrect password') {
        errors['password'] = err.message
    }
    

    return errors;
};

const maxAge = 1 * 24 * 60 * 60;

//jwt function
const createToken = (id) => {
    return jwt.sign({id}, 'Amalitech Webby Tokes', {
        expiresIn: maxAge
    });
}

const getVideos = async () => {
    const videos = await Video.find().sort({uploadDate: -1});
        for (const video of videos) {
            const params = {
                Bucket: BUCKET_NAME,
                Key: video.videoKey
            };
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3, command);
            video.url = url;
        }
    return videos;
}

// check current admin
const currentAdmin = (token) => {
    try {
        const decodedToken = jwt.verify(token, 'Amalitech Webby Tokes');
        return decodedToken;
    } catch (error) {
    }
};

// setting aws credentials
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    },
    region: BUCKET_REGION
});

const getObjectFileSize = async (Key) => {
    const command = new HeadObjectCommand({Key, Bucket: BUCKET_NAME})
    const response = await s3.send(command)
    const {ContentLength} = response
    return ContentLength
  };

//   getObjectFileSize('r6dfg50nt2qz275926m05gkfwb1wj7e8')
//   .then ((result) => {
//     console.log(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports.stream_get = async (req, res) => {
    const Key = req.params.streamKey;
    const range = req.headers.range;
    console.log('>>>>>>>>>>>>>>',range)
    if (!range) {
        res.status(400).send("Request Range header")
    }
    
    const videoSize = await getObjectFileSize(Key);
    

    const chunkSize = videoSize;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}- ${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": 'video/mp4'
    }

    res.writeHead(206,headers);
    
    const stream = await createAWSStream(Key)

    stream.pipe(res)
}

module.exports.video_get = async (req, res) => {
    const Key = req.params.videoKey;
    const video = await Video.findOne({videoKey: Key});
    console.log(video);
    res.render('videoplayer', {title: 'Player', video: video})
};

module.exports.video_post = async (req, res) => {
    console.log(req.body);
    console.log(req.file)
    
    const video_key = generateUniqueId({length: 32});
    const currAdmin = currentAdmin(req.cookies.jwt);
    
    // checking if admin is verified
    if (currAdmin.id) {
        // database data
        const data = {
            "videoKey": video_key,
            "title": req.body.title,
            "description": req.body.description,
            "adminID": currAdmin.id,
            "uploadDate": new Date()
        };

        // cloud storage parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: video_key,
            Body: req.file.buffer,
            MetaData: {"Content-Type": 'video/mp4'}
        };

        try {
            // sending video data
            const video = await Video.create(data)
            console.log(video);
            if (video) {
                const command = new PutObjectCommand(params);
                await s3.send(command);
            }
            res.json(video)
        } catch (err) {
            console.log("Check error here: ",err)
            res.json(err)
        }
    } else {
        res.json({'jwt': 'jwtError'})
    }
};

module.exports.home = async (req, res) => {
    const videos = await getVideos();
    // console.log(videos)
    res.render('Home', {title: "Home",videos: videos});
};

module.exports.signup_get = (req, res) => {
    res.render('signup', {title: "SignUp"});
};

module.exports.signin_get = (req, res) => {
    res.render('signin', {title: "SignIn"});
};

module.exports.signup_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await User.create({email, password})
        const token = createToken(user._id) //creating token
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });  //setting jwt cookie
        res.status(201).json({"user": user._id});
    } catch (err) {
        console.log(err.message, err.code);
        const errors = handleError(err);
        res.status(400).json({"errors": errors})
    };
};

module.exports.signin_post = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        //authentication using static function
        const user = await User.signin(email, password);
        const token = createToken(user._id); //creating token
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });  //setting jwt cookie
        res.status(200).json({"user": user._id});
    } catch (err) {
        console.log(err.message);
        const errors = handleError(err);
        console.log(errors)
        res.status(400).json({errors});
    }
};

module.exports.admin_home_get = (req, res) => {
    res.render('admin-home', {title: "Admin"})
};

module.exports.admin_signin_get = async (req, res) => {
    // const email = 'admin@gmail.com';
    // const password = 'qwerty123';
    res.render('admin-signin', {title: "Admin | SignIn"})
};

module.exports.admin_signin_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const admin = await Admin.signin(email, password);
        const token = createToken(admin._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true});
        res.status(200).json({"admin": admin._id});
    } catch (err) {
        console.log(err.message)
        const errors = handleError(err);
        // console.log(errors)
        res.status(400).json({errors});
    }
};

module.exports.admin_logout_get =(req, res) => {
    // res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/admin-signin');
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1, httpOnly: true});
    res.redirect('/signin');
};

