const { StatusCodes } = require("http-status-codes");

const User = require('../models/user.model');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')

const AuthController = {
  register: async (req, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "Registered" })
  },
  login: async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "logged In" })
  },
}

module.exports = AuthController;