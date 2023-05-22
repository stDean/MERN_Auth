const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name."],
    minLength: 4,
    maxLength: 100,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide you email.'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a secure password.'],
    trim: true
  },
  role: {
    type: Number,
    default: 0 // 0 = user, 1 = admin
  },
  avater: {
    type: String,
    default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
  }
},
  { timestamps: true }
);

UserSchema.methods.createRefreshJWT = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_REF_SECRET,
    { expiresIn: "7d" }
  );
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);