const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const { register, activateEmail, login, getAccessToken } = AuthController

router.route('/register').post(register);
router.route('/activate').post(activateEmail);
router.route('/login').post(login);
router.route('/refresh_token').post(getAccessToken);

module.exports = router;