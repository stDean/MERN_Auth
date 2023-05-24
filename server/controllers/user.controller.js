const { StatusCodes } = require('http-status-codes');

const User = require("../models/user.model");
const { BadRequestError, NotFoundError } = require('../errors');

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
  updateUser: async (req, res) => {
    const { body: { name, avatar }, user: { userID } } = req;

    if (name === '') {
      throw new BadRequestError('Name cannot be Empty.');
    }

    await User.findOneAndUpdate(
      { _id: userID },
      { name, avatar },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ msg: "Update Successful!" });
  },
  updateUserRole: async (req, res) => {
    const { body: { role }, params: { id } } = req;
    const user = await User.findOneAndUpdate(
      { _id: id },
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError(`No user with id(${id}) found.`);
    }
    res.status(StatusCodes.OK).json({ msg: "Update Successful!" });
  },
  deleteUser: async (req, res) => {
    const { params: { id } } = req;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError(`No user with id(${id}) found.`);
    }
    res.status(StatusCodes.OK).json({ msg: "Deleted Successfully!" });
  },
}

module.exports = UserCtrl;