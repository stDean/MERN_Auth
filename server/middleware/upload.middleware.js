const fs = require('fs');

const { BadRequestError } = require('../errors');

const uploadMiddleware = async function (req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      throw new BadRequestError("No file was uploaded.");

    const file = req.files.file;

    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath)
      throw new BadRequestError("File size too large.");
    } // 1mb

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath)
      throw new BadRequestError("File format is incorrect.");
    }

    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

const removeTmp = (path) => {
  fs.unlink(path, err => {
    if (err) throw err
  });
}

module.exports = uploadMiddleware;