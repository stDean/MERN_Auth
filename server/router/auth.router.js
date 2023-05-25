const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/auth.middleware');
const AuthController = require('../controllers/auth.controller');
const {
  register, activateEmail, login, getAccessToken, forgetPassword,
  resetPassword, logOut, googleLogin
} = AuthController;

router.route('/register').post(register);
router.route('/activate').post(activateEmail);
router.route('/login').post(login);
router.route('/refresh_token').post(getAccessToken);
router.route('/forget').post(forgetPassword);
router.route('/reset').patch(AuthMiddleware, resetPassword);
router.route('/logout').get(logOut);
router.route('/google_login').post(googleLogin)

module.exports = router;