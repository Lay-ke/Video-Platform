const { Router } = require('express');
const authController = require('../controllers/authcontrollers')
const {requireAuthUser, requireAuthAdmin, checkUser, checkAdmin} = require('../middleware/authMiddleware')
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = Router();

// user apis
router.get('/stream/:streamKey', authController.stream_get);
router.get('/', [requireAuthUser, checkUser],authController.home);
router.get('/signin', authController.signin_get);
router.post('/signin', authController.signin_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/logout', authController.logout_get);   // user logout

// Admin apis
router.get('/admin-signin', authController.admin_signin_get);
router.post('/admin-signin', authController.admin_signin_post);
router.get('/admin-home',[requireAuthAdmin, checkAdmin], authController.admin_home_get); //add requireauth
router.get('/admin-upload', [requireAuthAdmin, checkAdmin],authController.admin_upload_get);   // admin upload page route
router.get('/admin/logout', authController.admin_logout_get);

// video api
router.delete('/video/:deleteKey', authController.video_delete);
router.get('/videos', authController.videos_get);   // get allvvideos
router.get('/video', authController.video_player_get);   // users video player
router.post('/video', upload.single('video'), authController.video_post);    // admin video upload route

// reset password apis
router.get('/forget-password', authController.forget_password_get);
router.post('/forget-password', authController.forget_password_post);
router.get('/reset-password', authController.reset_password_get);
router.post('/reset-password', authController.reset_password_post);

router.use(authController._404_page);   // render 404 page

module.exports = router
