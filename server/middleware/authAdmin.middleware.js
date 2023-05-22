const User = require('../models/user.model');
const { UnauthenticatedError } = require('../errors');

const authAdmin = async (req, res, next) => {
  try {
    const { userID } = req.user
    const user = await User.findOne({ _id: userID });

    if (user.role !== 1) throw new UnauthenticatedError("Admin resources access denied.");
    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

module.exports = authAdmin