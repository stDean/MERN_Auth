const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors');
const { JWT_ACT_SECRET, CLIENT_URL, JWT_REF_SECRET, JWT_ACC_SECRET } = process.env;
const sendMail = require('./sendMial');

const AuthController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("All fields must be field");
    }

    if (!ValidateEmail(email)) {
      throw new BadRequestError("Please provide a proper email")
    }

    const user = await User.findOne({ email });
    if (user) {
      throw new UnauthenticatedError('This Email address already exist.');
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
    res.status(StatusCodes.OK).json({ msg: "Registration successful! please activate email to start.", actToken })
  },
  activateEmail: async (req, res) => {
    const { actToken } = req.body;
    const user = jwt.verify(actToken, JWT_ACT_SECRET);
    const { name, email, password } = user;

    const check = await User.findOne({ email })
    if (check) throw new BadRequestError("This email already exists.");

    await User.create({ name, email, password });
    res.status(StatusCodes.CREATED).json({ msg: "Account has been activated!" })
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('All fields must be filled.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('No user with this email.');
    }

    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
      throw new UnauthenticatedError('Incorrect password entered.');
    }

    const refresh_token = user.createRefreshJWT();
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(StatusCodes.OK).json({ msg: "Login success!" });

  },
  getAccessToken: async (req, res) => {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token) throw new UnauthenticatedError("Please login to have access.");

    const user = jwt.verify(rf_token, JWT_REF_SECRET);
    const access_token = createAccessJWT({ userID: user.userId });
    res.status(StatusCodes.OK).json({ access_token });
  },
  forgetPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('No user with this email.');
    }

    const access_token = createAccessJWT({ userId: user._id });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;
    sendMail(email, url, "Reset your password");
    res.status(StatusCodes.OK).json({ msg: "Check your email to reset password..", access_token })
  },
  resetPassword: async (req, res) => {
    const { body: { password }, user: { userId } } = req;
    if (password.length < 6) {
      throw new BadRequestError("Provide a more secure password.")
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate(
      { _id: userId },
      { password: hashPassword },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ msg: "Password successfully changed!" })
  },
  logOut: async (req, res) => {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh_token' });
    return res.status(StatusCodes.OK).json({ msg: "Logged out." });
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

function createAccessJWT(payload) {
  return jwt.sign(
    payload,
    JWT_ACC_SECRET,
    { expiresIn: "15m" }
  );
};