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
router.get('/admin-signin', authController.admin_signin_get);
router.post('/admin-signin', authController.admin_signin_post);
router.get('/admin-home',requireAuthAdmin, authController.admin_home_get); //add requireauth
router.get('/admin/logout', authController.admin_logout_get)
router.get('/logout', authController.logout_get);
router.get('/video/:videoKey', authController.video_get);
router.post('/video', upload.single('video'), authController.video_post);

module.exports = router
