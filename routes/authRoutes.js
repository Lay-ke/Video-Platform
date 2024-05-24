const { Router } = require('express');
const authController = require('../controllers/authcontrollers')
const {requireAuthUser, requireAuthAdmin} = require('../middleware/authMiddleware')
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = Router();

router.get('/stream/:streamKey', authController.stream_get);
router.get('/', authController.home);
router.get('/signin', authController.signin_get);
router.post('/signin', authController.signin_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/logout', authController.logout_get);   // user logout
router.get('/video', authController.video_player_get);   // users video player

// Admin
router.get('/admin-signin', authController.admin_signin_get);
router.post('/admin-signin', authController.admin_signin_post);
router.get('/admin-home',requireAuthAdmin, authController.admin_home_get); //add requireauth
router.get('/admin-upload', authController.admin_upload_get);   // admin upload page route
router.get('/admin/logout', authController.admin_logout_get);

// router.get('/video-share/:videoKey', authController.video_share);
router.delete('/video/:deleteKey', authController.video_delete);
router.get('/videos', authController.videos_get);   // get allvvideos
router.post('/video', upload.single('video'), authController.video_post);    // admin video upload route

router.get('/forget-password', authController.forget_password_get);
router.post('/forget-password', authController.forget_password_post);
router.get('/reset-password', authController.reset_password_get);
router.post('/reset-password', authController.reset_password_post);

module.exports = router
