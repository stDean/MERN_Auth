const { StatusCodes } = require('http-status-codes');

const User = require("../models/user.model");

const UserCtrl = {
  getAllUser: async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(StatusCodes.OK).json(users);
  },
  getUser: async (req, res) => {
    const { userID } = req.user;
    const user = await User.findById(userID).select('-password');
    res.status(StatusCodes.OK).json(user);
  },
  updateUser: async (req, res) => { },
  updateUserRole: async (req, res) => { },
  deleteUser: async (req, res) => { },
}

module.exports = UserCtrl;