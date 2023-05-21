const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors');
const { JWT_ACT_SECRET, CLIENT_URL } = process.env;
const sendMail = require('./sendMial');

const AuthController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("All fields must be field")
    }

    if (!ValidateEmail(email)) {
      throw new BadRequestError("Please provide a proper email")
    }

    if (password.length < 6) {
      throw new BadRequestError("Provide a more secure password.")
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = { name, email, password: hashPassword }
    const actToken = createActivationJWT(newUser);

    const url = `${CLIENT_URL}/user/activate/${actToken}`;
    sendMail(email, url, "Verify Your Email Address");
    res.status(StatusCodes.OK).json({ msg: "Registration successful! please activate email to start." })
  },
  login: async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "logged In" })
  },
}

module.exports = AuthController;

function ValidateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}

function createActivationJWT(payload) {
  return jwt.sign(
    payload,
    JWT_ACT_SECRET,
    { expiresIn: "5m" }
  );
}