const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const { register, login } = AuthController

router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router;