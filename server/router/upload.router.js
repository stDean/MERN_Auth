const express = require('express');
const router = express.Router();

const UploadController = require('../controllers/upload.controller');
const { uploadAvatar } = UploadController;

router.route('/').post(uploadAvatar);

module.exports = router;