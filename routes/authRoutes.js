const { Router } = require('express');
const authController = require('../controllers/authcontrollers')

const router = Router();

router.get('/signin', authController.signin_get);
router.post('/signin', authController.signin_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

module.exports = router
